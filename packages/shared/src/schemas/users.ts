import { z } from "zod";

export const userRoleSchema = z.enum(["customer", "admin"]);
export const userStatusSchema = z.enum(["active", "inactive", "suspended"]);

export const userSchema = z.object({
    id: z.string(), // Better Auth IDs are strings (UUIDs or random)
    email: z.string().email(),
    name: z.string(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    avatarUrl: z.string().url().nullable().optional(),
    role: userRoleSchema.default("customer"),
    status: userStatusSchema.default("active"),
    emailVerified: z.boolean().default(false),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const createUserSchema = userSchema.pick({
    email: true,
    name: true,
}).extend({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    avatarUrl: z.string().url().optional(),
    password: z.string().min(8),
});

export const updateUserSchema = userSchema.partial().pick({
    name: true,
    firstName: true,
    lastName: true,
    phone: true,
    avatarUrl: true,
});
