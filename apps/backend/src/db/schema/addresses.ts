import { pgTable, text, boolean, uuid } from "drizzle-orm/pg-core";
import { commonColumns } from "./columns.helpers";
import { users } from "./auth";

export const addresses = pgTable("addresses", {
    ...commonColumns,
    userId: uuid("user_id").references(() => users.id).notNull(),
    street: text("street").notNull(),
    city: text("city").notNull(),
    state: text("state").notNull(),
    zip: text("zip").notNull(),
    country: text("country").notNull(),
    isDefault: boolean("is_default").default(false),
});
