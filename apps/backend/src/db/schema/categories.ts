import { pgTable, varchar, text, boolean, integer, uuid, AnyPgColumn } from "drizzle-orm/pg-core";
import { commonColumns, slugColumn } from "./columns.helpers";

export const categories = pgTable("categories", {
    ...commonColumns,
    name: varchar("name", { length: 100 }).notNull(),
    slug: slugColumn(),
    description: text("description"),
    imageUrl: text("image_url"),
    parentId: uuid("parent_id").references((): AnyPgColumn => categories.id),
    position: integer("position").default(0),
    isActive: boolean("is_active").default(true),
});
