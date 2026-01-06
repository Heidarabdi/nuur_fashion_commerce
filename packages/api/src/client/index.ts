import { hc } from 'hono/client';
import type { AppType } from '@nuur-fashion-commerce/backend/src/app';

// Type helper for Hono client
type HonoClientType = ReturnType<typeof hc<AppType>>;

// IMPORTANT: This is hardcoded because Vite's define doesn't work properly 
// for Cloudflare Workers SSR. The SSR environment bundler doesn't apply defines.
// If you change deployment URL, update this value!
const PRODUCTION_API_URL = 'https://nuur-fashion-api.hono-waitlist-template-cloudflare.workers.dev';
const DEV_API_URL = 'http://localhost:3002';

/**
 * Get API URL - For production, always use the production URL
 * The only time we use localhost is when literally on localhost
 */
const getApiUrl = (): string => {
  // Browser context - check hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // Only use localhost if we're actually on localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      console.log('[API] Development mode - using localhost');
      return DEV_API_URL;
    }
  }

  // For SSR and all other cases, ALWAYS use production URL
  // This is safe because SSR only runs on Cloudflare Workers which is production
  console.log('[API] Production mode - using deployed API');
  return PRODUCTION_API_URL;
};

// Create client with the URL
const createClient = (url: string): HonoClientType => {
  return hc<AppType>(url, {
    init: {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    fetch: (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);

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
};

// Lazy client - created on first access
let _client: HonoClientType | null = null;

const getClient = (): HonoClientType => {
  if (!_client) {
    const url = getApiUrl();
    _client = createClient(url);
  }
  return _client;
};

// Proxy that lazily creates the client on first property access
export const apiClient = new Proxy({} as object, {
  get(_target, prop: string | symbol) {
    const client = getClient() as Record<string | symbol, unknown>;
    return client[prop];
  },
}) as HonoClientType;

export type ApiClient = typeof apiClient;
