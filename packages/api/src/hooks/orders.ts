import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../queries/keys';

/**
 * Get current user's orders
 */
export function useOrders() {
    return useQuery({
        queryKey: queryKeys.orders.list(),
        queryFn: async () => {
            const res = await (apiClient as any).api.orders.$get();
            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: 'Failed to fetch orders' }));
                throw new Error(error.message || 'Failed to fetch orders');
            }
            const json = await res.json();
            return json.data || json;
        },
    });
}

/**
 * Get single order by ID
 */
export function useOrder(id: string) {
    return useQuery({
        queryKey: queryKeys.orders.detail(id),
        queryFn: async () => {
            const res = await (apiClient as any).api.orders[':id'].$get({
                param: { id },
            });
            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: 'Failed to fetch order' }));
                throw new Error(error.message || 'Failed to fetch order');
            }
            const json = await res.json();
            return json.data || json;
        },
        enabled: !!id,
    });
}

/**
 * Create a new order
 */
export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (orderData: {
            items: Array<{ productId: string; variantId?: string; quantity: number }>;
            shippingAddressId?: string;
            billingAddressId?: string;
            notes?: string;
        }) => {
            const res = await (apiClient as any).api.orders.$post({
                json: orderData,
            });
            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: 'Failed to create order' }));
                throw new Error(error.message || 'Failed to create order');
            }
            const json = await res.json();
            return json.data || json;
        },
        onSuccess: () => {
            // Invalidate orders list and cart
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
        },
    });
}
