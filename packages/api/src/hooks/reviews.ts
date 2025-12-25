import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../queries/keys';

/**
 * Get reviews for a product
 */
export function useProductReviews(productId: string) {
    return useQuery({
        queryKey: queryKeys.reviews.byProduct(productId),
        queryFn: async () => {
            const res = await (apiClient as any).api.products[':id'].reviews.$get({
                param: { id: productId },
            });
            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: 'Failed to fetch reviews' }));
                throw new Error(error.message || 'Failed to fetch reviews');
            }
            const json = await res.json();
            return json.data || json;
        },
        enabled: !!productId,
    });
}

/**
 * Create a review for a product
 */
export function useCreateReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (reviewData: {
            productId: string;
            rating: number;
            title?: string;
            content?: string;
        }) => {
            const res = await (apiClient as any).api.reviews.$post({
                json: reviewData,
            });
            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: 'Failed to create review' }));
                throw new Error(error.message || 'Failed to create review');
            }
            const json = await res.json();
            return json.data || json;
        },
        onSuccess: (_data, variables) => {
            // Invalidate reviews for the product
            queryClient.invalidateQueries({ queryKey: queryKeys.reviews.byProduct(variables.productId) });
        },
    });
}
