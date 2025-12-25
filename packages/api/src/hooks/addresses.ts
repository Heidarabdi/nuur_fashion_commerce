import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';

// Query keys for addresses
const addressKeys = {
    all: ['addresses'] as const,
    list: () => [...addressKeys.all, 'list'] as const,
};

/**
 * Get current user's addresses
 */
export function useAddresses() {
    return useQuery({
        queryKey: addressKeys.list(),
        queryFn: async () => {
            const res = await (apiClient as any).api.addresses.$get();
            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: 'Failed to fetch addresses' }));
                throw new Error(error.message || 'Failed to fetch addresses');
            }
            const json = await res.json();
            return json.data || json;
        },
    });
}

/**
 * Create a new address
 */
export function useCreateAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (addressData: {
            type?: 'shipping' | 'billing';
            firstName: string;
            lastName: string;
            company?: string;
            addressLine1: string;
            addressLine2?: string;
            city: string;
            state?: string;
            postalCode: string;
            country: string;
            phone?: string;
            isDefault?: boolean;
        }) => {
            const res = await (apiClient as any).api.addresses.$post({
                json: addressData,
            });
            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: 'Failed to create address' }));
                throw new Error(error.message || 'Failed to create address');
            }
            const json = await res.json();
            return json.data || json;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: addressKeys.all });
        },
    });
}

/**
 * Delete an address
 */
export function useDeleteAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (addressId: string) => {
            const res = await (apiClient as any).api.addresses[':id'].$delete({
                param: { id: addressId },
            });
            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: 'Failed to delete address' }));
                throw new Error(error.message || 'Failed to delete address');
            }
            const json = await res.json();
            return json.data || json;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: addressKeys.all });
        },
    });
}
