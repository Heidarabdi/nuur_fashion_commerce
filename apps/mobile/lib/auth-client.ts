import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

// Production API URL (same as web app)
const PRODUCTION_API_URL = 'https://nuur-fashion-api.hono-waitlist-template-cloudflare.workers.dev';

export const authClient = createAuthClient({
    baseURL: PRODUCTION_API_URL + "/api/auth",
    plugins: [
        expoClient({
            storage: SecureStore,
            // Note: Keep caching enabled (default) so session persists after login
            // signOut will properly clear the cached session
        }),
    ],
});

// Re-export hooks for consistency with web
export const { useSession, signIn, signUp, signOut } = authClient;

