import { pgTable, varchar, decimal, integer, uuid } from "drizzle-orm/pg-core";
import { commonColumns } from "./columns.helpers";
import { products } from "./products";

export const productVariants = pgTable("product_variants", {
    id: commonColumns.id, // Only ID, no timestamps for now or add them if needed
    createdAt: commonColumns.createdAt,
    productId: uuid("product_id").references(() => products.id).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    sku: varchar("sku", { length: 100 }).unique(),
    price: decimal("price", { precision: 10, scale: 2 }),
    size: varchar("size", { length: 20 }),
    color: varchar("color", { length: 50 }),
    stockQuantity: integer("stock_quantity").default(0),
});
