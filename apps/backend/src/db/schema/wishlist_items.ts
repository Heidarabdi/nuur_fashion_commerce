import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { wishlists } from "./wishlists";
import { products } from "./products";

export const wishlistItems = pgTable("wishlist_items", {
    id: uuid("id").defaultRandom().primaryKey(),
    wishlistId: uuid("wishlist_id").references(() => wishlists.id).notNull(),
    productId: uuid("product_id").references(() => products.id).notNull(),
    addedAt: timestamp("added_at").defaultNow(),
});
