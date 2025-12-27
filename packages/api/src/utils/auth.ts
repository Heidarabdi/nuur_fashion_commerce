/**
 * Auth utilities for Better Auth
 * 
 * The API client relies on session cookies for authentication.
 * When used in a browser, Better Auth manages these automatically.
 */

/**
 * Get auth token (placeholder for legacy compatibility or custom logic)
 */
export async function getAuthTokenSSR(): Promise<string | null> {
  // Better Auth uses session cookies. 
  // Manual token injection is typically not needed if headers/cookies are forwarded.
  return null;
}
