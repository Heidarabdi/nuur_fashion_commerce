import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { updateUserSchema } from "@nuur-fashion-commerce/shared";
import { z } from "zod";

type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const usersService = {
    async getById(id: string) {
        return await db.query.users.findFirst({
            where: eq(users.id, id),
        });
    },

    async update(id: string, data: UpdateUserInput) {
        const [updatedUser] = await db
            .update(users)
            .set(data)
            .where(eq(users.id, id))
            .returning();
        return updatedUser;
    },
};
