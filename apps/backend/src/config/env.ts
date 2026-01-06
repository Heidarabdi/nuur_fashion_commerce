import { z } from "zod";

// Make secrets optional with defaults for initial deployment
// Real values come from Cloudflare secrets or wrangler.jsonc vars
const envSchema = z.object({
  PORT: z.coerce.number().default(3002),
  DATABASE_URL: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  FRONTEND_URL: z.string().min(1).default("http://localhost:3000"),
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_URL: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_EMAIL: z.string().optional(),
  R2_PUBLIC_URL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

// Parse env from process.env (for local Bun development)
// In Cloudflare Workers, env comes from the context
let processEnv: Partial<Env> = {};
if (typeof process !== "undefined" && process.env) {
  processEnv = envSchema.partial().parse(process.env);
}

export const env = envSchema.parse(processEnv);

// Helper to merge context env with defaults (for Workers)
export const getEnv = (contextEnv: Record<string, unknown>): Env => {
  return envSchema.parse({ ...env, ...contextEnv });
};
