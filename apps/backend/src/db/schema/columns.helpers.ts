import { uuid, timestamp, text } from "drizzle-orm/pg-core";

export const commonColumns = {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
};

export const slugColumn = (name = "slug") => text(name).unique().notNull();
