import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true,
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
