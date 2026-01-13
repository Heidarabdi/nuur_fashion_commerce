import { hc } from 'hono/client';
import type { AppType } from '@nuur-fashion-commerce/backend/src/app';

// Type helper for Hono client
type HonoClientType = ReturnType<typeof hc<AppType>>;

// Production and Dev URLs
const PRODUCTION_API_URL = 'https://nuur-fashion-api.hono-waitlist-template-cloudflare.workers.dev';
const DEV_API_URL = 'http://localhost:3002';

/**
 * Detect if running in React Native
 */
const isReactNative = (): boolean => {
  return typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
};

/**
 * Get API URL based on environment
 * - React Native: Always use production URL
 * - Browser: Check hostname for localhost
 * - SSR: Use production URL
 */
const getApiUrl = (): string => {
  // React Native - always use production
  if (isReactNative()) {
    console.log('[API] React Native - using production API');
    return PRODUCTION_API_URL;
  }

  // Browser context - check hostname
  if (typeof window !== 'undefined' && 'location' in window) {
    const hostname = window.location.hostname;

    // Only use localhost if we're actually on localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      console.log('[API] Development mode - using localhost');
      return DEV_API_URL;
    }
  }

  // For SSR and all other cases, use production URL
  console.log('[API] Production mode - using deployed API');
  return PRODUCTION_API_URL;
};

// In-memory cache for React Native (synced with AsyncStorage externally)
let reactNativeCache: Record<string, string> = {};

/**
 * Set the React Native storage cache (call this after hydrating from AsyncStorage)
 */
export function setReactNativeStorageCache(cache: Record<string, string>) {
  reactNativeCache = cache;
}

/**
 * Get or create guest ID for React Native
 */
export function getOrCreateGuestId(): string {
  if (reactNativeCache['guest_id']) {
    return reactNativeCache['guest_id'];
  }
  // Generate a new UUID if crypto is available
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    const newId = crypto.randomUUID();
    reactNativeCache['guest_id'] = newId;
    return newId;
  }
  // Fallback to timestamp-based ID
  const fallbackId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  reactNativeCache['guest_id'] = fallbackId;
  return fallbackId;
}

/**
 * Storage abstraction for guest ID
 * Works in both web (localStorage) and React Native (memory cache)
 */
const storage = {
  getItem: (key: string): string | null => {
    if (isReactNative()) {
      // Use in-memory cache for React Native
      return reactNativeCache[key] || null;
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (isReactNative()) {
      reactNativeCache[key] = value;
      return;
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  },
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

      // Add guest ID header for non-authenticated requests
      const guestId = storage.getItem('guest_id');
      if (guestId) {
        headers.set('X-Guest-Id', guestId);
      } else if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        const newGuestId = crypto.randomUUID();
        storage.setItem('guest_id', newGuestId);
        headers.set('X-Guest-Id', newGuestId);
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
