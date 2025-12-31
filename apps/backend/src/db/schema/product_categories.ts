import { pgTable, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { products } from "./products";
import { categories } from "./categories";

// Junction table for many-to-many relationship between products and categories
export const productCategories = pgTable("product_categories", {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
    // Ensure a product can only be in a category once
    uniqueProductCategory: unique().on(table.productId, table.categoryId),
}));
