import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../queries/keys';

/**
 * Get current user's cart
 */
export function useCart() {
  return useQuery({
    queryKey: queryKeys.cart.current(),
    queryFn: async () => {
      const res = await (apiClient as any).api.carts.$get();
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to fetch cart' }));
        throw new Error(error.message || 'Failed to fetch cart');
      }
      const json = await res.json();
      return json.data || json;
    },
  });
}

/**
 * Add item to cart with optimistic update
 */
export function useAddToCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: { productId: string; variantId?: string; quantity: number; guestId?: string }) => {
      const res = await (apiClient as any).api.carts.items.$post({
        json: item,
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to add item to cart' }));
        throw new Error(error.message || 'Failed to add item to cart');
      }
      const json = await res.json();
      return json.data || json;
    },
    // Optimistic update
    onMutate: async (newItem: { productId: string; variantId?: string; quantity: number; guestId?: string }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.current() });
      
      // Snapshot previous value
      const previousCart = queryClient.getQueryData(queryKeys.cart.current());
      
      // Optimistically update
      queryClient.setQueryData(queryKeys.cart.current(), (old: unknown) => {
        const oldCart = old as { data?: { items?: unknown[] } } | null | undefined;
        if (!oldCart || !oldCart.data) {
          return {
            data: {
              items: [{
                productId: newItem.productId,
                variantId: newItem.variantId,
                quantity: newItem.quantity,
              }],
            },
          };
        }
        return {
          ...oldCart,
          data: {
            ...oldCart.data,
            items: [
              ...(oldCart.data.items || []),
              {
                productId: newItem.productId,
                variantId: newItem.variantId,
                quantity: newItem.quantity,
              },
            ],
          },
        };
      });
      
      return { previousCart };
    },
    // Rollback on error
    onError: (_err: unknown, _newItem: { productId: string; variantId?: string; quantity: number; guestId?: string }, context: { previousCart: unknown } | undefined) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.current(), context.previousCart);
      }
    },
    // Refetch on success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
    },
  });
}

/**
 * Remove item from cart
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (itemId: string) => {
      const res = await (apiClient as any).api.carts.items[':itemId'].$delete({
        param: { itemId },
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to remove item from cart' }));
        throw new Error(error.message || 'Failed to remove item from cart');
      }
      const json = await res.json();
      return json.data || json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
    },
  });
}

/**
 * Update cart item quantity
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const res = await (apiClient as any).api.carts.items[':itemId'].$patch({
        param: { itemId },
        json: { quantity },
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to update cart item' }));
        throw new Error(error.message || 'Failed to update cart item');
      }
      const json = await res.json();
      return json.data || json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
    },
  });
}

