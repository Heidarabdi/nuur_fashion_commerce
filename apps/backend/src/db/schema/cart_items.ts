import { pgTable, integer, uuid, uniqueIndex, index } from "drizzle-orm/pg-core";
import { commonColumns } from "./columns.helpers";
import { carts } from "./carts";
import { products } from "./products";
import { productVariants } from "./product_variants";

export const cartItems = pgTable("cart_items", {
    ...commonColumns,
    cartId: uuid("cart_id").references(() => carts.id, { onDelete: 'cascade' }).notNull(),
    productId: uuid("product_id").references(() => products.id).notNull(),
    variantId: uuid("variant_id").references(() => productVariants.id), // Nullable
    quantity: integer("quantity").default(1).notNull(),
}, (table) => [
    // Prevent duplicate product+variant combinations in the same cart
    uniqueIndex("cart_items_unique_idx").on(table.cartId, table.productId, table.variantId),
    index("cart_items_cart_idx").on(table.cartId),
]);
