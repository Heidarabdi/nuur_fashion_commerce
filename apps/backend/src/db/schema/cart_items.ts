import { pgTable, integer, uuid } from "drizzle-orm/pg-core";
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
});
