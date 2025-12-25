import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../queries/keys';

/**
 * List products with optional filters
 */
export function useProducts(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: async () => {
      const res = await (apiClient as any).api.products.$get({
        query: filters as Record<string, string>,
      });
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
 * Get single product by ID
 */
export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: async () => {
      const res = await (apiClient as any).api.products[':id'].$get({
        param: { id },
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to fetch product' }));
        throw new Error(error.message || 'Failed to fetch product');
      }
      const json = await res.json();
      return json.data || json;
    },
    enabled: !!id,
  });
}

/**
 * Get product by slug
 */
export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.products.bySlug(slug),
    queryFn: async () => {
      const res = await (apiClient as any).api.products['slug'][':slug'].$get({
        param: { slug },
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to fetch product' }));
        throw new Error(error.message || 'Failed to fetch product');
      }
      const json = await res.json();
      return json.data || json;
    },
    enabled: !!slug,
  });
}

