import { pgTable, varchar, text, boolean } from "drizzle-orm/pg-core";
import { commonColumns, slugColumn } from "./columns.helpers";

export const brands = pgTable("brands", {
    ...commonColumns,
    name: varchar("name", { length: 100 }).notNull(),
    slug: slugColumn(),
    description: text("description"),
    logoUrl: text("logo_url"),
    website: varchar("website", { length: 255 }),
    isActive: boolean("is_active").default(true),
});
