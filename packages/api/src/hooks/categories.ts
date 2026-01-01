import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../queries/keys';

/**
 * List all categories
 */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: async () => {
      const res = await (apiClient as any).api.categories.$get();
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to fetch categories' }));
        throw new Error(error.message || 'Failed to fetch categories');
      }
      const json = await res.json();
      return json.data || json;
    },
  });
}

/**
 * Get category by ID
 */
export function useCategory(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: async () => {
      const res = await (apiClient as any).api.categories[':id'].$get({
        param: { id },
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to fetch category' }));
        throw new Error(error.message || 'Failed to fetch category');
      }
      const json = await res.json();
      return json.data || json;
    },
    enabled: !!id,
  });
}

/**
 * Create Category (Admin)
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; slug?: string; description?: string; imageUrl?: string }) => {
      const res = await (apiClient as any).api.admin.categories.$post({
        json: data,
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to create category' }));
        throw new Error(error.message || 'Failed to create category');
      }
      const json = await res.json();
      return json.data || json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

/**
 * Update Category (Admin)
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; name?: string; slug?: string; description?: string; imageUrl?: string }) => {
      const res = await (apiClient as any).api.admin.categories[':id'].$put({
        param: { id },
        json: data,
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to update category' }));
        throw new Error(error.message || 'Failed to update category');
      }
      const json = await res.json();
      return json.data || json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

/**
 * Delete Category (Admin)
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await (apiClient as any).api.admin.categories[':id'].$delete({
        param: { id },
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to delete category' }));
        throw new Error(error.message || 'Failed to delete category');
      }
      const json = await res.json();
      return json.data || json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}
