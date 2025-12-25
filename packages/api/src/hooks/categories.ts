import { useQuery } from '@tanstack/react-query';
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

