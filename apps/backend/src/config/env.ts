import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3002),
  DATABASE_URL: z.string().url(),
  CLERK_SECRET_KEY: z.string().optional(), // Make optional dev
  CLERK_PUBLISHABLE_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  FRONTEND_URL: z.string().min(1).default("http://localhost:3000"),
});

export const env = envSchema.parse(process.env);
