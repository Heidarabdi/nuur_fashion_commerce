/**
 * Get Clerk auth token for API requests
 * 
 * In browser context: Use the useAuth hook from @clerk/tanstack-react-start directly in components.
 * The API client relies on cookies for authentication - Clerk handles this automatically.
 * 
 * In SSR context: Token injection is not needed as the backend uses @hono/clerk-auth
 * middleware which handles authentication via cookies/headers.
 */

/**
 * Get auth token in SSR context (server-side)
 * Note: This function is a no-op in browser environments.
 * The backend handles auth via cookies set by Clerk.
 */
export async function getAuthTokenSSR(): Promise<string | null> {
  // In browser, we don't need to manually inject tokens
  // Clerk handles auth via cookies which are sent automatically
  if (typeof window !== 'undefined') {
    return null;
  }

  // In SSR context, we also rely on cookie-based auth
  // The backend's @hono/clerk-auth middleware handles this
  // No manual token injection needed
  return null;
}

/**
 * Note: In browser components, use the useAuth hook directly:
 * 
 * ```typescript
 * import { useAuth } from '@clerk/tanstack-react-start';
 * 
 * function MyComponent() {
 *   const { getToken } = useAuth();
 *   const token = await getToken();
 *   // Use token in API calls
 * }
 * ```
 * 
 * However, since we're using credentials: 'include' in the API client,
 * Clerk cookies are automatically sent with each request, so manual
 * token injection is typically not necessary.
 */
