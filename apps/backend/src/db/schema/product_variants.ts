import { pgTable, varchar, decimal, integer, uuid, index } from "drizzle-orm/pg-core";
import { commonColumns } from "./columns.helpers";
import { products } from "./products";

export const productVariants = pgTable("product_variants", {
    id: commonColumns.id,
    createdAt: commonColumns.createdAt,
    updatedAt: commonColumns.updatedAt, // Added for tracking variant updates
    productId: uuid("product_id").references(() => products.id, { onDelete: 'cascade' }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    sku: varchar("sku", { length: 100 }).unique(),
    price: decimal("price", { precision: 10, scale: 2 }),
    size: varchar("size", { length: 20 }),
    color: varchar("color", { length: 50 }),
    stockQuantity: integer("stock_quantity").default(0),
}, (table) => [
    index("product_variants_product_idx").on(table.productId),
]);
