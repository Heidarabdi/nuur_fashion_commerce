import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index";
import { users, sessions, accounts, verifications } from "../db/schema";
import { emailService } from "../services/external/email.service";

// Better Auth expects singular table names, our schema uses plural exports
const authSchema = {
    user: users,
    session: sessions,
    account: accounts,
    verification: verifications,
};

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: authSchema,
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true, // Users must verify email before login
        sendResetPassword: async ({ user, url }) => {
            await emailService.sendPasswordResetEmail({
                name: user.name,
                email: user.email,
                resetUrl: url,
            });
        },
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, request) => {
            // Use void to avoid timing attacks (per Better Auth docs)
            void emailService.sendVerificationEmail({
                name: user.name,
                email: user.email,
                verificationUrl: url,
            });
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "PLACEHOLDER",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "PLACEHOLDER",
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "PLACEHOLDER",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "PLACEHOLDER",
        },
        facebook: {
            clientId: process.env.FACEBOOK_CLIENT_ID || "PLACEHOLDER",
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "PLACEHOLDER",
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
});
