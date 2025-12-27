import { apiClient } from './index';
import { getAuthTokenSSR } from '../utils/auth';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Setup request interceptor to inject auth tokens
 * Handles both SSR (server-side) and browser contexts
 */
const originalFetch = (apiClient as any).fetch;

(apiClient as any).fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  try {
    // Get auth token (if any)
    let token: string | null = null;

    if (typeof window === 'undefined') {
      // In SSR, we might need to forward cookies, but manual token injection is avoided by default
      token = await getAuthTokenSSR();
    }

    const headers = new Headers(init?.headers);

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await originalFetch(input, {
      ...init,
      headers,
    });

    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`
      }));
      throw new ApiError(
        errorData.message || 'Request failed',
        response.status,
        errorData,
      );
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0,
      error,
    );
  }
};

