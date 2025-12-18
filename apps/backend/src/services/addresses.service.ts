import { db } from "../db";
import { addresses } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { createAddressSchema } from "@nuur-fashion-commerce/shared";
import { z } from "zod";

type CreateAddressInput = z.infer<typeof createAddressSchema>;

export const addressesService = {
    async getAll(userId: string) {
        return await db.query.addresses.findMany({
            where: eq(addresses.userId, userId),
        });
    },

    async create(userId: string, data: CreateAddressInput) {
        // If setting as default, unset others first
        if (data.isDefault) {
            await db
                .update(addresses)
                .set({ isDefault: false })
                .where(eq(addresses.userId, userId));
        }

        const [newAddress] = await db.insert(addresses).values({
            ...data,
            userId,
        }).returning();
        return newAddress;
    },

    async delete(userId: string, addressId: string) {
        return await db.delete(addresses).where(
            and(eq(addresses.id, addressId), eq(addresses.userId, userId))
        ).returning();
    }
};
