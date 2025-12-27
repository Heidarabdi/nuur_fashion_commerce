import { pgTable, text, integer, boolean, uuid, pgEnum, varchar } from "drizzle-orm/pg-core";
import { commonColumns } from "./columns.helpers";
import { users } from "./auth";
import { products } from "./products";

export const reviewStatusEnum = pgEnum("review_status", ["pending", "approved", "rejected"]);

export const reviews = pgTable("reviews", {
    ...commonColumns,
    userId: uuid("user_id").references(() => users.id).notNull(),
    productId: uuid("product_id").references(() => products.id).notNull(),
    rating: integer("rating").notNull(), // 1-5 validation in app layer
    title: varchar("title", { length: 255 }),
    content: text("content"),
    isVerifiedPurchase: boolean("is_verified_purchase").default(false),
    status: reviewStatusEnum("status").default("pending").notNull(),
    helpfulCount: integer("helpful_count").default(0),
});
