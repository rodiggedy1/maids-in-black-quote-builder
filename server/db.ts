import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, quotes, InsertQuote, Quote, bookings, InsertBooking, Booking } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Quote helpers ────────────────────────────────────────────────────────────

export type QuoteRow = Quote & { extras: string[] };

function deserializeQuote(row: Quote): QuoteRow {
  let extras: string[] = [];
  try { extras = JSON.parse(row.extrasJson || "[]"); } catch { extras = []; }
  return { ...row, extras };
}

export async function createQuote(data: Omit<InsertQuote, "extrasJson"> & { extras: string[] }): Promise<QuoteRow> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { extras, ...rest } = data;
  const row: InsertQuote = { ...rest, extrasJson: JSON.stringify(extras) };
  await db.insert(quotes).values(row);
  const created = await db.select().from(quotes).where(eq(quotes.slug, data.slug)).limit(1);
  return deserializeQuote(created[0]);
}

export async function getQuoteBySlug(slug: string): Promise<QuoteRow | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(quotes).where(eq(quotes.slug, slug)).limit(1);
  return result.length > 0 ? deserializeQuote(result[0]) : undefined;
}

export async function getAllQuotes(): Promise<QuoteRow[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(quotes).orderBy(quotes.createdAt);
  return result.map(deserializeQuote);
}

export async function updateQuote(
  slug: string,
  data: Partial<Omit<InsertQuote, "extrasJson" | "slug" | "id"> & { extras: string[] }>
): Promise<QuoteRow | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { extras, ...rest } = data;
  const updateData: Partial<InsertQuote> = { ...rest };
  if (extras !== undefined) updateData.extrasJson = JSON.stringify(extras);
  if (Object.keys(updateData).length > 0) {
    await db.update(quotes).set(updateData).where(eq(quotes.slug, slug));
  }
  return getQuoteBySlug(slug);
}

export async function deleteQuote(slug: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(quotes).where(eq(quotes.slug, slug));
}

// ─── Booking helpers ──────────────────────────────────────────────────────────

export type BookingRow = Booking;

export async function createBooking(data: InsertBooking): Promise<BookingRow> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(bookings).values(data);
  const created = await db.select().from(bookings)
    .where(eq(bookings.quoteSlug, data.quoteSlug))
    .orderBy(desc(bookings.createdAt))
    .limit(1);
  return created[0];
}

export async function getLatestBookingBySlug(quoteSlug: string): Promise<BookingRow | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(bookings)
    .where(eq(bookings.quoteSlug, quoteSlug))
    .orderBy(desc(bookings.createdAt))
    .limit(1);
  return rows[0] ?? null;
}

export async function getAllBookings(): Promise<BookingRow[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(bookings).orderBy(desc(bookings.createdAt));
}
