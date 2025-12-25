import { useQuery } from '@tanstack/react-query';
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

