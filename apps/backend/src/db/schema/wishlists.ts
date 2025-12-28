import { pgTable, varchar, boolean, text } from "drizzle-orm/pg-core";
import { commonColumns } from "./columns.helpers";
import { users } from "./auth";

export const wishlists = pgTable("wishlists", {
    ...commonColumns,
    userId: text("user_id").references(() => users.id).notNull(),
    name: varchar("name", { length: 100 }).default("My Wishlist").notNull(),
    isPublic: boolean("is_public").default(false),
});
