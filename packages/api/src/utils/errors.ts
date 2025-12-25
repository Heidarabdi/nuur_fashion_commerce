import { ApiError } from '../client/interceptors';

/**
 * Type guard to check if error is ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Get user-friendly error message from error
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

/**
 * Handle API errors with appropriate user actions
 */
export function handleApiError(error: unknown): string {
  if (isApiError(error)) {
    switch (error.status) {
      case 401:
        // Redirect to login (handled by component/router)
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return 'Please sign in to continue';
      case 403:
        return 'You do not have permission to perform this action';
      case 404:
        return 'Resource not found';
      case 500:
        return 'Server error. Please try again later';
      default:
        return error.message || 'An error occurred';
    }
  }
  return getErrorMessage(error);
}

