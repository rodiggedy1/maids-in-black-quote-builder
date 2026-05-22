import { z } from "zod";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { createQuote, getQuoteBySlug, getAllQuotes, updateQuote, deleteQuote, createBooking, getAllBookings } from "./db";
import { ENV } from "./_core/env";

// ─── LLM Parser ──────────────────────────────────────────────────────────────

async function parseQuoteText(rawInput: string) {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a cleaning service quote parser. Extract structured data from free-text lead notes.
Return ONLY valid JSON matching this exact schema:
{
  "clientName": string,
  "bedrooms": number,
  "bathrooms": number,
  "serviceType": string (e.g. "Standard Cleaning", "Deep Cleaning", "Move-In/Move-Out"),
  "extras": string[] (e.g. ["Oven Cleaning", "Fridge Cleaning", "Window Cleaning"]),
  "notes": string (any special notes, pets, access info, focus areas),
  "estimateMin": number (dollar amount, no symbols),
  "estimateMax": number (dollar amount, no symbols)
}
Rules:
- If bedrooms/bathrooms not specified, use 0
- If estimate is a single number, set both min and max to that number
- If no estimate mentioned, use 0 for both
- extras should be properly capitalized service names
- notes should capture everything else: pets, special requests, focus areas, access info
- If serviceType not clear, default to "Standard Cleaning"`,
      },
      { role: "user", content: rawInput },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "quote_parse",
        strict: true,
        schema: {
          type: "object",
          properties: {
            clientName: { type: "string" },
            bedrooms: { type: "number" },
            bathrooms: { type: "number" },
            serviceType: { type: "string" },
            extras: { type: "array", items: { type: "string" } },
            notes: { type: "string" },
            estimateMin: { type: "number" },
            estimateMax: { type: "number" },
          },
          required: ["clientName", "bedrooms", "bathrooms", "serviceType", "extras", "notes", "estimateMin", "estimateMax"],
          additionalProperties: false,
        },
      },
    },
  });

  const rawContent = response.choices?.[0]?.message?.content;
  const content = typeof rawContent === "string" ? rawContent : null;
  if (!content) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "LLM returned no content" });
  return JSON.parse(content) as {
    clientName: string;
    bedrooms: number;
    bathrooms: number;
    serviceType: string;
    extras: string[];
    notes: string;
    estimateMin: number;
    estimateMax: number;
  };
}

// ─── Admin guard ─────────────────────────────────────────────────────────────

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin" && ctx.user.openId !== ENV.ownerOpenId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// ─── Routers ─────────────────────────────────────────────────────────────────

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  quote: router({
    // Public: get a single quote by slug (for client page)
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const quote = await getQuoteBySlug(input.slug);
        if (!quote) throw new TRPCError({ code: "NOT_FOUND", message: "Quote not found" });
        return quote;
      }),

    // Admin: parse raw text with LLM (preview, no save)
    parse: adminProcedure
      .input(z.object({ rawInput: z.string().min(3) }))
      .mutation(async ({ input }) => {
        return parseQuoteText(input.rawInput);
      }),

    // Admin: create a new quote (parse + save)
    create: adminProcedure
      .input(z.object({
        rawInput: z.string().min(3),
        ctaLabel: z.enum(["Book This Cleaning", "Confirm My Date & Time"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const parsed = await parseQuoteText(input.rawInput);
        const slug = nanoid(10);
        const quote = await createQuote({
          slug,
          rawInput: input.rawInput,
          clientName: parsed.clientName,
          bedrooms: parsed.bedrooms,
          bathrooms: parsed.bathrooms,
          serviceType: parsed.serviceType,
          extras: parsed.extras,
          notes: parsed.notes || null,
          estimateMin: parsed.estimateMin > 0 ? String(parsed.estimateMin) : null,
          estimateMax: parsed.estimateMax > 0 ? String(parsed.estimateMax) : null,
          ctaLabel: input.ctaLabel ?? "Book This Cleaning",
        });
        return quote;
      }),

    // Admin: create a quote from already-parsed fields (preserves edits made in UI)
    createFromParsed: adminProcedure
      .input(z.object({
        clientName: z.string().min(1),
        bedrooms: z.number(),
        bathrooms: z.number(),
        serviceType: z.string(),
        extras: z.array(z.string()),
        notes: z.string().optional(),
        estimateMin: z.number().nullable().optional(),
        estimateMax: z.number().nullable().optional(),
        ctaLabel: z.enum(["Book This Cleaning", "Confirm My Date & Time"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const slug = nanoid(10);
        const quote = await createQuote({
          slug,
          rawInput: "",
          clientName: input.clientName,
          bedrooms: input.bedrooms,
          bathrooms: input.bathrooms,
          serviceType: input.serviceType,
          extras: input.extras,
          notes: input.notes || null,
          estimateMin: input.estimateMin != null ? String(input.estimateMin) : null,
          estimateMax: input.estimateMax != null ? String(input.estimateMax) : null,
          ctaLabel: input.ctaLabel ?? "Book This Cleaning",
        });
        return quote;
      }),

    // Admin: list all quotes
    list: adminProcedure.query(async () => {
      return getAllQuotes();
    }),

    // Admin: update a quote
    update: adminProcedure
      .input(z.object({
        slug: z.string(),
        clientName: z.string().optional(),
        bedrooms: z.number().optional(),
        bathrooms: z.number().optional(),
        serviceType: z.string().optional(),
        extras: z.array(z.string()).optional(),
        notes: z.string().nullable().optional(),
        estimateMin: z.number().nullable().optional(),
        estimateMax: z.number().nullable().optional(),
        ctaLabel: z.enum(["Book This Cleaning", "Confirm My Date & Time"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { slug, estimateMin, estimateMax, ...rest } = input;
        const updated = await updateQuote(slug, {
          ...rest,
          estimateMin: estimateMin != null ? String(estimateMin) : estimateMin === null ? null : undefined,
          estimateMax: estimateMax != null ? String(estimateMax) : estimateMax === null ? null : undefined,
        });
        if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "Quote not found" });
        return updated;
      }),

    // Admin: delete a quote
    delete: adminProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ input }) => {
        await deleteQuote(input.slug);
        return { success: true };
      }),

    // Public: submit booking request from client page
    submitBooking: publicProcedure
      .input(z.object({
        slug: z.string(),
        email: z.string().email(),
        address: z.string().min(5),
        timePreference: z.enum(["morning", "midday", "evening", "flexible"]),
        preferredDate: z.string().optional(),
        bookingNotes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const quote = await getQuoteBySlug(input.slug);
        if (!quote) throw new TRPCError({ code: "NOT_FOUND", message: "Quote not found" });
        // Persist booking to database — use client-submitted notes if provided, fall back to quote notes
        await createBooking({
          quoteSlug: input.slug,
          clientName: quote.clientName,
          email: input.email,
          address: input.address,
          timePreference: input.timePreference,
          preferredDate: input.preferredDate ?? null,
          notes: input.bookingNotes ?? quote.notes ?? null,
          estimateMin: quote.estimateMin ?? null,
          estimateMax: quote.estimateMax ?? null,
          bedrooms: quote.bedrooms,
          bathrooms: quote.bathrooms,
          serviceType: quote.serviceType,
        });
        // Notify owner of new booking request
        const { notifyOwner } = await import("./_core/notification");
        const timeLabels: Record<string, string> = {
          morning: "8:30 AM",
          midday: "12:30 PM",
          evening: "4:30 PM",
          flexible: "Completely flexible",
        };
        const dateStr = input.preferredDate ? `\nPreferred Date: ${input.preferredDate}` : "";
        await notifyOwner({
          title: `New Booking Request — ${quote.clientName}`,
          content: `Client: ${quote.clientName}\nEmail: ${input.email}\nAddress: ${input.address}\nTime Preference: ${timeLabels[input.timePreference]}${dateStr}\nEstimate: $${quote.estimateMin}–$${quote.estimateMax}`,
        });
        return { success: true };
      }),

    // Admin: list all bookings
    listBookings: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.openId !== ENV.ownerOpenId && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return getAllBookings();
      }),
  }),
});

export type AppRouter = typeof appRouter;
