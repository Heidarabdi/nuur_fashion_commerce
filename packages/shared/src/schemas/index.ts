import { z } from "zod";

// Product schema
export const ProductSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  price: z.number(),
  currency: z.string().optional(),
  slug: z.string().optional(),
  categories: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
});
type Product = z.infer<typeof ProductSchema>;

// User schema
export const UserSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  email: z.string().email(),
  roles: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
});
type User = z.infer<typeof UserSchema>;

// Category schema
export const CategorySchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  slug: z.string().optional(),
});
type Category = z.infer<typeof CategorySchema>;

// Utility to validate multiple schema objects
export function validateAllSchemas(payload: {
  product?: unknown;
  user?: unknown;
  category?: unknown;
}) {
  return {
    product: payload.product ? ProductSchema.safeParse(payload.product) : undefined,
    user: payload.user ? UserSchema.safeParse(payload.user) : undefined,
    category: payload.category ? CategorySchema.safeParse(payload.category) : undefined,
  };
}

export default {
  ProductSchema,
  UserSchema,
  CategorySchema,
  validateAllSchemas,
};
