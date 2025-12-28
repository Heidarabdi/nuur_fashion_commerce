import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../queries/keys';

/**
 * Admin Dashboard Stats
 */
export function useAdminStats() {
    return useQuery({
        queryKey: queryKeys.admin.stats(),
        queryFn: async () => {
            const res = await (apiClient as any).api.admin.stats.$get();
            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: 'Failed to fetch stats' }));
                throw new Error(error.message || 'Failed to fetch stats');
            }
            const json = await res.json();
            return json.data || json;
        },
    });
}

/**
 * Admin Products (includes drafts)
 */
export function useAdminProducts() {
    return useQuery({
        queryKey: queryKeys.admin.products(),
        queryFn: async () => {
            const res = await (apiClient as any).api.admin.products.$get();
            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: 'Failed to fetch products' }));
                throw new Error(error.message || 'Failed to fetch products');
            }
            const json = await res.json();
            return json.data || json;
        },
    });
}

/**
 * Admin Orders
 */
export function useAdminOrders() {
    return useQuery({
        queryKey: queryKeys.admin.orders(),
        queryFn: async () => {
            const res = await (apiClient as any).api.admin.orders.$get();
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
 * Admin Customers
 */
export function useAdminCustomers() {
    return useQuery({
        queryKey: queryKeys.admin.customers(),
        queryFn: async () => {
            const res = await (apiClient as any).api.admin.customers.$get();
            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: 'Failed to fetch customers' }));
                throw new Error(error.message || 'Failed to fetch customers');
            }
            const json = await res.json();
            return json.data || json;
        },
    });
}

/**
 * Update Order Status (Admin)
 */
export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const res = await (apiClient as any).api.admin.orders[':id'].$patch({
                param: { id },
                json: { status },
            });
            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: 'Failed to update order status' }));
                throw new Error(error.message || 'Failed to update order status');
            }
            const json = await res.json();
            return json.data || json;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders() });
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
        },
    });
}

/**
 * Create Product (Admin)
 */
export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productData: {
            name: string;
            description: string;
            price: number;
            compareAtPrice?: number;
            categoryId?: string;
            brandId?: string;
            status?: string;
            images?: string[];
        }) => {
            const res = await (apiClient as any).api.admin.products.$post({
                json: productData,
            });
            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: 'Failed to create product' }));
                throw new Error(error.message || 'Failed to create product');
            }
            const json = await res.json();
            return json.data || json;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.products() });
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
            queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
        },
    });
}

/**
 * Update Product (Admin)
 */
export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            ...productData
        }: {
            id: string;
            name?: string;
            description?: string;
            price?: number;
            compareAtPrice?: number;
            categoryId?: string;
            brandId?: string;
            status?: string;
            images?: string[];
        }) => {
            const res = await (apiClient as any).api.admin.products[':id'].$put({
                param: { id },
                json: productData,
            });
            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: 'Failed to update product' }));
                throw new Error(error.message || 'Failed to update product');
            }
            const json = await res.json();
            return json.data || json;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.products() });
            queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
        },
    });
}

/**
 * Delete Product (Admin)
 */
export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await (apiClient as any).api.admin.products[':id'].$delete({
                param: { id },
            });
            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: 'Failed to delete product' }));
                throw new Error(error.message || 'Failed to delete product');
            }
            const json = await res.json();
            return json.data || json;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.products() });
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
            queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
        },
    });
}
