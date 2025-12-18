import { pgTable, varchar, text, boolean, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { commonColumns } from "./columns.helpers";

export const userRoleEnum = pgEnum("user_role", ["customer", "admin"]);
export const userStatusEnum = pgEnum("user_status", ["active", "inactive", "suspended"]);

export const users = pgTable("users", {
    ...commonColumns,
    clerkId: varchar("clerk_id", { length: 255 }).unique().notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    phone: varchar("phone", { length: 20 }),
    avatarUrl: text("avatar_url"),
    role: userRoleEnum("role").default("customer").notNull(),
    status: userStatusEnum("status").default("active").notNull(),
    emailVerified: boolean("email_verified").default(false),
});
