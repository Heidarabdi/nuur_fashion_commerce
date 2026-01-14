/**
 * useRequireAuth Hook
 * Checks if user is authenticated and redirects to login if not.
 * Use at the top of any protected screen.
 */
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSession } from '@/lib/auth-client';

interface UseRequireAuthOptions {
    redirectTo?: string;
    showToast?: boolean;
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
    const { redirectTo = '/auth/login', showToast = true } = options;
    const router = useRouter();
    const session = useSession();

    const isLoading = session.isPending;
    const isAuthenticated = !!session.data?.user;
    const user = session.data?.user;

    useEffect(() => {
        // Don't redirect while loading
        if (isLoading) return;

        // If not authenticated, redirect to login
        if (!isAuthenticated) {
            if (showToast) {
                // Import Toast dynamically to avoid circular deps
                import('react-native-toast-message').then(({ default: Toast }) => {
                    Toast.show({
                        type: 'info',
                        text1: 'Sign In Required',
                        text2: 'Please sign in to access this page',
                        position: 'top',
                    });
                });
            }
            router.replace(redirectTo as any);
        }
    }, [isLoading, isAuthenticated, router, redirectTo, showToast]);

    return {
        isLoading,
        isAuthenticated,
        user,
    };
}
