import { hc } from 'hono/client';
import type { AppType } from '@nuur-fashion-commerce/backend/src/app';

// Type helper for Hono client
type HonoClientType = ReturnType<typeof hc<AppType>>;

/**
 * Get API URL from environment
 * Supports both browser and SSR contexts
 * Bun provides process.env globally
 */
const getApiUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Browser: use relative URL or env var
    const env = (import.meta as { env?: { VITE_API_URL?: string } }).env;
    return env?.VITE_API_URL || 'http://localhost:3002';
  }
  // SSR: Bun provides process.env globally
  // Using globalThis to access Bun's process.env
  const globalEnv = typeof globalThis !== 'undefined' && (globalThis as any).process?.env;
  const apiUrl = globalEnv?.API_URL || globalEnv?.VITE_API_URL;
  return apiUrl || 'http://localhost:3002';
};

/**
 * Type-safe Hono RPC client
 * Automatically infers types from backend AppType
 */
export const apiClient: HonoClientType = hc<AppType>(getApiUrl(), {
  init: {
    credentials: 'include', // For Clerk cookies
    headers: {
      'Content-Type': 'application/json',
    },
  },
  fetch: (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers);

    // Inject Guest ID for browser environment
    if (typeof window !== 'undefined') {
      let guestId = localStorage.getItem('guest_id');
      if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem('guest_id', guestId);
      }
      headers.set('X-Guest-Id', guestId);
    }

    return fetch(input, { ...init, headers });
  },
});

// Export typed client
export type ApiClient = typeof apiClient;
