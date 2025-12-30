import { pgTable, varchar, text, boolean, decimal, integer, uuid, jsonb, pgEnum, index } from "drizzle-orm/pg-core";
import { commonColumns, slugColumn } from "./columns.helpers";
import { categories } from "./categories";
import { brands } from "./brands";

export const productStatusEnum = pgEnum("product_status", ["draft", "active", "archived"]);

export const products = pgTable("products", {
    ...commonColumns,
    name: varchar("name", { length: 255 }).notNull(),
    slug: slugColumn(),
    description: text("description"),
    shortDescription: varchar("short_description", { length: 500 }),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
    costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
    sku: varchar("sku", { length: 100 }).unique(),
    barcode: varchar("barcode", { length: 100 }),
    categoryId: uuid("category_id").references(() => categories.id),
    brandId: uuid("brand_id").references(() => brands.id),
    status: productStatusEnum("status").default("draft").notNull(),
    isFeatured: boolean("is_featured").default(false),
    isNew: boolean("is_new").default(false),
    weight: decimal("weight", { precision: 8, scale: 2 }),
    dimensions: jsonb("dimensions"),
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
}, (table) => [
    index("products_category_idx").on(table.categoryId),
    index("products_brand_idx").on(table.brandId),
    index("products_status_idx").on(table.status),
    index("products_featured_idx").on(table.isFeatured),
]);
