import { pgTable, integer, decimal, uuid } from "drizzle-orm/pg-core";
import { commonColumns } from "./columns.helpers";
import { orders } from "./orders";
import { products } from "./products";
import { productVariants } from "./product_variants";

export const orderItems = pgTable("order_items", {
    ...commonColumns,
    orderId: uuid("order_id").references(() => orders.id, { onDelete: 'cascade' }).notNull(),
    productId: uuid("product_id").references(() => products.id).notNull(),
    variantId: uuid("variant_id").references(() => productVariants.id),
    quantity: integer("quantity").notNull(),
    priceAtPurchase: decimal("price_at_purchase", { precision: 10, scale: 2 }).notNull(), // SNAPSHOT
});
