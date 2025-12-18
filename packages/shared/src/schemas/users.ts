import { z } from "zod";

export const userRoleSchema = z.enum(["customer", "admin"]);
export const userStatusSchema = z.enum(["active", "inactive", "suspended"]);

export const userSchema = z.object({
    id: z.string().uuid(),
    clerkId: z.string(),
    email: z.string().email(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    phone: z.string().nullable(),
    avatarUrl: z.string().url().nullable(),
    role: userRoleSchema,
    status: userStatusSchema,
    emailVerified: z.boolean().default(false),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const createUserSchema = userSchema.pick({
    email: true,
    firstName: true,
    lastName: true,
    clerkId: true,
}).extend({
    avatarUrl: z.string().url().optional(),
});

export const updateUserSchema = userSchema.partial().pick({
    firstName: true,
    lastName: true,
    phone: true,
    avatarUrl: true,
});
