import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../queries/keys';

/**
 * Get current user's wishlist
 */
export function useWishlist() {
    return useQuery({
        queryKey: queryKeys.wishlists.list(),
        queryFn: async () => {
            const res = await (apiClient as any).api.wishlists.$get();
            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: 'Failed to fetch wishlist' }));
                throw new Error(error.message || 'Failed to fetch wishlist');
            }
            const json = await res.json();
            return json.data || json;
        },
    });
}

/**
 * Add item to wishlist
 */
export function useAddToWishlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: string) => {
            const res = await (apiClient as any).api.wishlists.$post({
                json: { productId },
            });
            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: 'Failed to add to wishlist' }));
                throw new Error(error.message || 'Failed to add to wishlist');
            }
            const json = await res.json();
            return json.data || json;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.wishlists.all });
        },
    });
}

/**
 * Remove item from wishlist
 */
export function useRemoveFromWishlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: string) => {
            const res = await (apiClient as any).api.wishlists[':productId'].$delete({
                param: { productId },
            });
            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: 'Failed to remove from wishlist' }));
                throw new Error(error.message || 'Failed to remove from wishlist');
            }
            const json = await res.json();
            return json.data || json;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.wishlists.all });
        },
    });
}

/**
 * Toggle wishlist - adds if not in wishlist, removes if already in
 * Includes toast notifications for feedback
 */
export function useToggleWishlist() {
    const queryClient = useQueryClient();
    const addMutation = useAddToWishlist();
    const removeMutation = useRemoveFromWishlist();

    return useMutation({
        mutationFn: async ({ productId, isCurrentlyWishlisted }: { productId: string; isCurrentlyWishlisted: boolean }) => {
            if (isCurrentlyWishlisted) {
                return removeMutation.mutateAsync(productId);
            } else {
                return addMutation.mutateAsync(productId);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.wishlists.all });
        },
    });
}

// Alias for compatibility
export const useWishlistItems = useWishlist;
