import { pgTable, varchar, text, integer, boolean, uuid } from "drizzle-orm/pg-core";
import { commonColumns } from "./columns.helpers";
import { products } from "./products";

export const productImages = pgTable("product_images", {
    id: commonColumns.id,
    createdAt: commonColumns.createdAt,
    productId: uuid("product_id").references(() => products.id).notNull(),
    url: text("url").notNull(),
    altText: varchar("alt_text", { length: 255 }),
    position: integer("position").default(0),
    isPrimary: boolean("is_primary").default(false),
});
