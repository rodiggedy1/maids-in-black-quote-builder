import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// extrasJson: stored as JSON string, no DB-level default (handled in app layer)
export const quotes = mysqlTable("quotes", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  clientName: varchar("clientName", { length: 256 }).notNull(),
  rawInput: text("rawInput"),
  bedrooms: int("bedrooms").default(0).notNull(),
  bathrooms: int("bathrooms").default(0).notNull(),
  serviceType: varchar("serviceType", { length: 128 }).default("Standard Cleaning").notNull(),
  extrasJson: text("extrasJson").notNull(),
  notes: text("notes"),
  estimateMin: decimal("estimateMin", { precision: 10, scale: 2 }),
  estimateMax: decimal("estimateMax", { precision: 10, scale: 2 }),
  ctaLabel: mysqlEnum("ctaLabel", ["Book This Cleaning", "Confirm My Date & Time"]).default("Book This Cleaning").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = typeof quotes.$inferInsert;

export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  quoteSlug: varchar("quoteSlug", { length: 64 }).notNull(),
  clientName: varchar("clientName", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  address: text("address").notNull(),
  timePreference: mysqlEnum("timePreference", ["morning", "midday", "evening", "flexible"]).notNull(),
  preferredDate: varchar("preferredDate", { length: 16 }),
  notes: text("notes"),
  estimateMin: decimal("estimateMin", { precision: 10, scale: 2 }),
  estimateMax: decimal("estimateMax", { precision: 10, scale: 2 }),
  bedrooms: int("bedrooms"),
  bathrooms: int("bathrooms"),
  serviceType: varchar("serviceType", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
