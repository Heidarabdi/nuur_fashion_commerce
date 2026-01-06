# @nuur-fashion-commerce/api

Shared API client and React hooks for the Nuur Fashion platform.

## Overview

This package provides:
- **Hono RPC client** for type-safe API calls
- **TanStack Query hooks** for data fetching and mutations
- Query key management for cache invalidation

## Installation

```bash
# From workspace
bun install @nuur-fashion-commerce/api
```

## Usage

### Products

```tsx
import { useProducts, useProduct, useProductBySlug } from '@nuur-fashion-commerce/api';

// List products with filters
const { data: products } = useProducts({ categoryId: '...', search: 'shirt' });

// Get single product
const { data: product } = useProduct(productId);

// Get by slug
const { data: product } = useProductBySlug('cotton-shirt');
```

### Categories & Brands

```tsx
import { useCategories, useBrands } from '@nuur-fashion-commerce/api';

const { data: categories } = useCategories();
const { data: brands } = useBrands();
```

### Cart

```tsx
import { useCart, useAddToCart, useUpdateCartItem, useRemoveFromCart } from '@nuur-fashion-commerce/api';

const { data: cart } = useCart();
const addToCart = useAddToCart();
const updateItem = useUpdateCartItem();
const removeItem = useRemoveFromCart();

// Add item
addToCart.mutate({ productId, quantity: 1 });

// Update quantity
updateItem.mutate({ itemId, quantity: 3 });

// Remove item
removeItem.mutate(itemId);
```

### Wishlist

```tsx
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '@nuur-fashion-commerce/api';

const { data: wishlist } = useWishlist();
const addToWishlist = useAddToWishlist();
const removeFromWishlist = useRemoveFromWishlist();

addToWishlist.mutate(productId);
removeFromWishlist.mutate(productId);
```

### Orders

```tsx
import { useOrders, useOrder, useCreateOrder } from '@nuur-fashion-commerce/api';

const { data: orders } = useOrders();
const { data: order } = useOrder(orderId);
const createOrder = useCreateOrder();

createOrder.mutate({
  addressId: '...',
  paymentMethod: 'card'
});
```

### Admin Hooks

```tsx
import {
  useAdminStats,
  useAdminProducts,
  useAdminOrders,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct
} from '@nuur-fashion-commerce/api';

// Dashboard stats
const { data: stats } = useAdminStats();

// CRUD products
const createProduct = useCreateProduct();
const updateProduct = useUpdateProduct();
const deleteProduct = useDeleteProduct();

createProduct.mutate({
  name: 'New Shirt',
  price: 29.99,
  images: ['https://...']
});
```

### User & Addresses

```tsx
import { useCurrentUser, useAddresses, useCreateAddress } from '@nuur-fashion-commerce/api';

const { data: user } = useCurrentUser();
const { data: addresses } = useAddresses();
const createAddress = useCreateAddress();
```

## API Client

Direct access to the Hono RPC client:

```tsx
import { apiClient } from '@nuur-fashion-commerce/api';

// Make custom requests
const res = await apiClient.api.products.$get();
const data = await res.json();
```

## Query Keys

For manual cache invalidation:

```tsx
import { queryKeys } from '@nuur-fashion-commerce/api';

queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
```

## Exports

```tsx
// Client
export { apiClient } from './client';

// Query keys
export { queryKeys } from './queries/keys';

// Hooks
export * from './hooks/products';
export * from './hooks/categories';
export * from './hooks/brands';
export * from './hooks/cart';
export * from './hooks/wishlist';
export * from './hooks/orders';
export * from './hooks/user';
export * from './hooks/addresses';
export * from './hooks/reviews';
export * from './hooks/admin';
```
