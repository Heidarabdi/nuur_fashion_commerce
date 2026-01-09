import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

// Production API URL (same as web app)
const PRODUCTION_API_URL = 'https://nuur-fashion-api.hono-waitlist-template-cloudflare.workers.dev';

export const authClient = createAuthClient({
    baseURL: PRODUCTION_API_URL + "/api/auth",
    storage: {
        getItem: async (key: string): Promise<string | null> => {
            return await SecureStore.getItemAsync(key);
        },
        setItem: async (key: string, value: string): Promise<void> => {
            await SecureStore.setItemAsync(key, value);
        },
        removeItem: async (key: string): Promise<void> => {
            await SecureStore.deleteItemAsync(key);
        },
    },
});

// Re-export hooks for consistency with web
export const { useSession, signIn, signUp, signOut } = authClient;
