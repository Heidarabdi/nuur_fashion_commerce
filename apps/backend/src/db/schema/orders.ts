import { pgTable, text, decimal, uuid, pgEnum } from "drizzle-orm/pg-core";
import { commonColumns } from "./columns.helpers";
import { users } from "./auth";
import { addresses } from "./addresses";

export const orderStatusEnum = pgEnum("order_status", ["pending", "processing", "shipped", "delivered", "cancelled"]);

export const orders = pgTable("orders", {
    ...commonColumns,
    userId: uuid("user_id").references(() => users.id),
    status: orderStatusEnum("status").default("pending").notNull(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),

    // Customer Info (for Guest or Snapshot)
    email: text("email"),
    firstName: text("first_name"),
    lastName: text("last_name"),

    // Guest ID
    guestId: text("guest_id"),

    // Shipping Address Snapshot
    addressId: uuid("address_id").references(() => addresses.id),
    street: text("street"),
    city: text("city"),
    state: text("state"),
    zip: text("zip"),
    country: text("country").default("US"),

    paymentIntentId: text("payment_intent_id"),
});
