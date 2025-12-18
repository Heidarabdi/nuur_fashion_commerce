import { pgTable, text, decimal, uuid, pgEnum } from "drizzle-orm/pg-core";
import { commonColumns } from "./columns.helpers";
import { users } from "./users";
import { addresses } from "./addresses";

export const orderStatusEnum = pgEnum("order_status", ["pending", "processing", "shipped", "delivered", "cancelled"]);

export const orders = pgTable("orders", {
    ...commonColumns,
    userId: uuid("user_id").references(() => users.id),
    status: orderStatusEnum("status").default("pending").notNull(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),

    // Linking to address ID is simpler, but a real snapshot is better. 
    // For MVP, we'll link, but ideally we copy address fields here too.
    addressId: uuid("address_id").references(() => addresses.id),

    paymentIntentId: text("payment_intent_id"),
});
