import { z } from "zod";

export const createAddressSchema = z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "ZIP code is required"),
    country: z.string().min(1, "Country is required"),
    isDefault: z.boolean().default(false),
});

export const addressSchema = createAddressSchema.extend({
    id: z.string(),
    userId: z.string(),
});
