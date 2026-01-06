import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDb, DbType } from "../db/index";
import { users, sessions, accounts, verifications } from "../db/schema";
import { createEmailService } from "../services/external/email.service";

// Better Auth expects singular table names, our schema uses plural exports
const authSchema = {
    user: users,
    session: sessions,
    account: accounts,
    verification: verifications,
};

export type AuthEnv = {
    DATABASE_URL: string;
    BETTER_AUTH_SECRET: string;
    RESEND_API_KEY: string;
    RESEND_EMAIL: string;
    BETTER_AUTH_URL: string;
    FRONTEND_URL: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;
    FACEBOOK_CLIENT_ID?: string;
    FACEBOOK_CLIENT_SECRET?: string;
};

/**
 * Create a new Better Auth instance per-request
 * This is required for Cloudflare Workers to avoid I/O sharing between requests
 */
export const createAuth = (env: AuthEnv) => {
    const db = createDb(env.DATABASE_URL);
    const emailService = createEmailService(env.RESEND_API_KEY, env.RESEND_EMAIL);

    return betterAuth({
        secret: env.BETTER_AUTH_SECRET,
        baseURL: env.BETTER_AUTH_URL,
        trustedOrigins: [env.FRONTEND_URL],
        database: drizzleAdapter(db, {
            provider: "pg",
            schema: authSchema,
        }),
        emailAndPassword: {
            enabled: true,
            requireEmailVerification: true,
            sendResetPassword: async ({ user, url }: { user: { name: string; email: string }; url: string }) => {
                await emailService.sendPasswordResetEmail({
                    name: user.name,
                    email: user.email,
                    resetUrl: url,
                });
            },
        },
        emailVerification: {
            sendVerificationEmail: async ({ user, url }: { user: { name: string; email: string }; url: string; token: string }, request: any) => {
                void emailService.sendVerificationEmail({
                    name: user.name,
                    email: user.email,
                    verificationUrl: url,
                });
            },
        },
        socialProviders: {
            google: {
                clientId: env.GOOGLE_CLIENT_ID || "PLACEHOLDER",
                clientSecret: env.GOOGLE_CLIENT_SECRET || "PLACEHOLDER",
            },
            github: {
                clientId: env.GITHUB_CLIENT_ID || "PLACEHOLDER",
                clientSecret: env.GITHUB_CLIENT_SECRET || "PLACEHOLDER",
            },
            facebook: {
                clientId: env.FACEBOOK_CLIENT_ID || "PLACEHOLDER",
                clientSecret: env.FACEBOOK_CLIENT_SECRET || "PLACEHOLDER",
            }
        },
        user: {
            additionalFields: {
                role: {
                    type: "string",
                    required: false,
                    defaultValue: "user",
                },
            },
        },
        advanced: {
            ipAddress: {
                ipAddressHeaders: ["x-forwarded-for", "x-real-ip", "cf-connecting-ip"],
            },
        },
        rateLimit: {
            enabled: true,
            window: 60,
            max: 100,
        },
    });
};

export type Auth = ReturnType<typeof createAuth>;
