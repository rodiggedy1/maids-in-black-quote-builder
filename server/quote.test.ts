import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock db module
vi.mock("./db", () => ({
  createQuote: vi.fn(),
  getQuoteBySlug: vi.fn(),
  getAllQuotes: vi.fn(),
  updateQuote: vi.fn(),
  deleteQuote: vi.fn(),
}));

// Mock LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{
      message: {
        content: JSON.stringify({
          clientName: "Sarah",
          bedrooms: 3,
          bathrooms: 2,
          serviceType: "Standard Cleaning",
          extras: ["Oven Cleaning", "Fridge Cleaning"],
          notes: "Has a dog",
          estimateMin: 150,
          estimateMax: 200,
        }),
      },
    }],
  }),
}));

// Mock nanoid
vi.mock("nanoid", () => ({ nanoid: () => "test-slug-01" }));

import { createQuote, getQuoteBySlug, getAllQuotes } from "./db";

const mockQuote = {
  id: 1,
  slug: "test-slug-01",
  clientName: "Sarah",
  rawInput: "Sarah, 3 bed / 2 bath, oven, fridge, has a dog, $150-$200",
  bedrooms: 3,
  bathrooms: 2,
  serviceType: "Standard Cleaning",
  extrasJson: '["Oven Cleaning","Fridge Cleaning"]',
  extras: ["Oven Cleaning", "Fridge Cleaning"],
  notes: "Has a dog",
  estimateMin: "150.00",
  estimateMax: "200.00",
  ctaLabel: "Book This Cleaning" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "owner-open-id",
      email: "admin@example.com",
      name: "Admin",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("quote.getBySlug (public)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns a quote for a valid slug", async () => {
    vi.mocked(getQuoteBySlug).mockResolvedValue(mockQuote);
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.quote.getBySlug({ slug: "test-slug-01" });
    expect(result.clientName).toBe("Sarah");
    expect(result.bedrooms).toBe(3);
    expect(result.extras).toEqual(["Oven Cleaning", "Fridge Cleaning"]);
  });

  it("throws NOT_FOUND for unknown slug", async () => {
    vi.mocked(getQuoteBySlug).mockResolvedValue(undefined);
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.quote.getBySlug({ slug: "bad-slug" })).rejects.toThrow("Quote not found");
  });
});

describe("quote.list (admin)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns all quotes for admin", async () => {
    vi.mocked(getAllQuotes).mockResolvedValue([mockQuote]);
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.quote.list();
    expect(result).toHaveLength(1);
    expect(result[0].clientName).toBe("Sarah");
  });
});

describe("quote.create (admin)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("parses raw input and creates a quote", async () => {
    vi.mocked(createQuote).mockResolvedValue(mockQuote);
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.quote.create({
      rawInput: "Sarah, 3 bed / 2 bath, oven, fridge, has a dog, $150-$200",
    });
    expect(result.clientName).toBe("Sarah");
    expect(result.slug).toBe("test-slug-01");
    expect(createQuote).toHaveBeenCalledOnce();
  });
});
