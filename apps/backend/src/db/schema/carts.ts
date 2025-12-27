import { pgTable, text, uuid, pgEnum } from "drizzle-orm/pg-core";
import { commonColumns } from "./columns.helpers";
import { users } from "./auth";

export const cartStatusEnum = pgEnum("cart_status", ["active", "abandoned", "converted"]);

export const carts = pgTable("carts", {
    ...commonColumns,
    userId: uuid("user_id").references(() => users.id), // Nullable for guests
    guestId: text("guest_id"), // Nullable if logged in (or we can keep it for tracking)
    status: cartStatusEnum("status").default("active").notNull(),
});
