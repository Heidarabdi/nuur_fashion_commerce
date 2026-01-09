import { create } from 'zustand';
import { authClient } from './auth-client';

interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role?: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    signOut: () => Promise<void>;
}

/**
 * Minimal auth store for global state sync.
 * Use `authClient.useSession()` hook in components for reactive session data.
 * This store is for imperative actions and global state access.
 */
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    isAuthenticated: false,

    setUser: (user) => set({
        user,
        isAuthenticated: !!user
    }),

    setLoading: (isLoading) => set({ isLoading }),

    signOut: async () => {
        await authClient.signOut();
        set({ user: null, isAuthenticated: false, isLoading: false });
    },
}));
