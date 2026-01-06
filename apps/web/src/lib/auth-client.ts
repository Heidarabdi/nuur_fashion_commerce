import { createAuthClient } from "better-auth/react";

// Production API URL - hardcoded because Vite env vars don't work reliably in SSR
const PRODUCTION_API_URL = 'https://nuur-fashion-api.hono-waitlist-template-cloudflare.workers.dev';
const DEV_API_URL = 'http://localhost:3002';

/**
 * Get API URL based on hostname
 * SSR always uses production, browser checks hostname
 */
function getApiUrl(): string {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return DEV_API_URL;
        }
    }
    return PRODUCTION_API_URL;
}

export const authClient = createAuthClient({
    baseURL: getApiUrl() + "/api/auth",
});
