import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../queries/keys';

/**
 * List all brands
 */
export function useBrands() {
  return useQuery({
    queryKey: queryKeys.brands.list(),
    queryFn: async () => {
      const res = await (apiClient as any).api.brands.$get();
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to fetch brands' }));
        throw new Error(error.message || 'Failed to fetch brands');
      }
      const json = await res.json();
      return json.data || json;
    },
  });
}

/**
 * Get brand by ID
 */
export function useBrand(id: string) {
  return useQuery({
    queryKey: queryKeys.brands.detail(id),
    queryFn: async () => {
      const res = await (apiClient as any).api.brands[':id'].$get({
        param: { id },
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to fetch brand' }));
        throw new Error(error.message || 'Failed to fetch brand');
      }
      const json = await res.json();
      return json.data || json;
    },
    enabled: !!id,
  });
}

/**
 * Create Brand (Admin)
 */
export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; slug?: string; description?: string; logoUrl?: string }) => {
      const res = await (apiClient as any).api.admin.brands.$post({
        json: data,
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to create brand' }));
        throw new Error(error.message || 'Failed to create brand');
      }
      const json = await res.json();
      return json.data || json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
    },
  });
}

/**
 * Update Brand (Admin)
 */
export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; name?: string; slug?: string; description?: string; logoUrl?: string }) => {
      const res = await (apiClient as any).api.admin.brands[':id'].$put({
        param: { id },
        json: data,
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to update brand' }));
        throw new Error(error.message || 'Failed to update brand');
      }
      const json = await res.json();
      return json.data || json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
    },
  });
}

/**
 * Delete Brand (Admin)
 */
export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await (apiClient as any).api.admin.brands[':id'].$delete({
        param: { id },
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to delete brand' }));
        throw new Error(error.message || 'Failed to delete brand');
      }
      const json = await res.json();
      return json.data || json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
    },
  });
}
