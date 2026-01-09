# Universal Monorepo API Strategy - Updated 2025

> **Last Updated:** January 2025  
> **Status:** Ready for Implementation  
> This plan outlines the creation of a centralized **API SDK** that will power both the **Web (TanStack Start)** and **Mobile (Expo)** applications, leveraging our monorepo structure for maximum code reuse and type safety.

---

## 🚀 The Vision: "Nuur API SDK"

We are building `@nuur-fashion-commerce/api`—a shared logic layer that ensures our business rules, data fetching, and caching strategies are identical across all platforms. This SDK will provide:

- **100% Type Safety**: End-to-end type inference from backend to frontend
- **Unified Caching**: Shared TanStack Query cache across Web and Mobile
- **Optimistic Updates**: Instant UI feedback with automatic rollback on errors
- **SSR Support**: Seamless server-side rendering with TanStack Start
- **Offline Support**: Persistent caching for mobile with React Query
- **Authentication**: Unified Better Auth session handling across platforms

---

## 🏗️ Architecture Overview

### 1. Centralized SDK (`packages/api`)

Instead of duplicating logic, we will house all API interactions in a new package:

```
packages/api/
├── src/
│   ├── client/
│   │   ├── index.ts              # Hono RPC client setup
│   │   ├── types.ts              # AppType import from backend
│   │   └── interceptors.ts       # Auth & error interceptors
│   ├── hooks/
│   │   ├── products.ts          # useProducts, useProduct, etc.
│   │   ├── categories.ts        # useCategories, etc.
│   │   ├── cart.ts              # useCart with optimistic updates
│   │   ├── orders.ts            # useOrders, useOrder
│   │   ├── reviews.ts           # useReviews, useCreateReview
│   │   └── wishlists.ts         # useWishlists, etc.
│   ├── queries/
│   │   ├── keys.ts              # Query key factory
│   │   └── options.ts           # Default query options
│   ├── mutations/
│   │   ├── cart.ts              # Cart mutations
│   │   └── orders.ts            # Order mutations
│   ├── providers/
│   │   ├── ApiProvider.tsx      # QueryClient + Auth provider
│   │   └── SSRProvider.tsx      # SSR hydration support
│   └── utils/
│       ├── errors.ts            # Error handling utilities
│       └── auth.ts              # Auth token management
├── package.json
└── tsconfig.json
```

### 2. Technology Stack (2025 Best Practices)

| Tool | Usage | Version | Cross-Platform Benefit |
| :--- | :--- | :--- | :--- |
| **@hono/client** | Type-safe RPC client | Latest | 100% Type safety from backend types |
| **TanStack Query v5** | Server state & cache | ^5.62.11 | Consistent caching, optimistic UI |
| **React useState** | Client/UI state | Built-in | UI state, modals, sidebars |
| **TanStack Router** | URL state | ^1.132.0 | Filters in URL (persistent, shareable) |
| **Better Auth Client** | Authentication (Web/Mobile) | Latest | Self-hosted, unified auth client |
| **Zod** | Runtime validation | ^3.24.1 | Shared schemas from `packages/shared` |
| **TanStack Start** | SSR framework | ^1.132.0 | Server-side data fetching |

**State Management Strategy:**
- **TanStack Query**: Handles all **server state** (API data, caching, mutations)
- **React useState**: Handles **UI state** (modals, sidebars, local state)
- **URL Search Params**: Handles **filters** (persistent, shareable, SEO-friendly)

---

## 📡 Platform Integration Strategy

### 🌐 Web (TanStack Start)

**SSR Power:**
- Use TanStack Start's `loader` functions to fetch initial data on the server
- Hydrate TanStack Query cache from server data
- Enable instant page loads with SEO-friendly content

**Implementation Pattern:**
```tsx
// Route with SSR loader
export const Route = createFileRoute('/shop')({
  loader: async ({ context }) => {
    const queryClient = context.queryClient;
    await queryClient.prefetchQuery({
      queryKey: ['products'],
      queryFn: () => api.products.list(),
    });
  },
  component: ShopPage,
});

// Component uses the same hook
function ShopPage() {
  const { data } = useProducts(); // Data already in cache!
  return <ProductGrid products={data} />;
}
```

### 📱 Mobile (Expo)

**Offline First:**
- Configure React Query with persistent storage
- Support optimistic updates with automatic rollback
- Handle network errors gracefully

**Implementation Pattern:**
```tsx
// Provider with persistent cache
<QueryClientProvider client={queryClient}>
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{
      persister: createAsyncStoragePersister({
        storage: AsyncStorage,
      }),
    }}
  >
    <App />
  </PersistQueryClientProvider>
</QueryClientProvider>
```

---

## 🔧 Implementation Details

### Phase 1: SDK Foundation

#### Step 1.1: Initialize `packages/api`

```bash
mkdir -p packages/api/src/{client,hooks,queries,mutations,providers,utils}
cd packages/api
bun init
```

**package.json:**
```json
{
  "name": "@nuur-fashion-commerce/api",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js",
    "./client": "./dist/client/index.js",
    "./hooks": "./dist/hooks/index.js"
  },
  "dependencies": {
    "@hono/client": "^1.11.0",
    "@tanstack/react-query": "^5.62.11",
    "@nuur-fashion-commerce/shared": "workspace:*",
    "@nuur-fashion-commerce/backend": "workspace:*"
  },
  "peerDependencies": {
    "react": "^19.0.0"
  }
}
```

#### Step 1.2: Type-Safe Hono Client

**packages/api/src/client/index.ts:**
```typescript
import { hc } from '@hono/client';
import type { AppType } from '@nuur-fashion-commerce/backend/src/app';

// Get API URL from environment
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser: use relative URL or env var
    return import.meta.env.VITE_API_URL || 'http://localhost:3002';
  }
  // SSR: use absolute URL
  return process.env.API_URL || 'http://localhost:3002';
};

// Create type-safe client
export const apiClient = hc<AppType>(getApiUrl(), {
  init: {
    credentials: 'include', // For Better Auth session cookies
    headers: {
      'Content-Type': 'application/json',
    },
  },
});

// Export typed client
export type ApiClient = typeof apiClient;
```

**packages/api/src/client/interceptors.ts:**
```typescript
import { apiClient } from './index';
import { getAuthToken } from '../utils/auth';

// Add auth token to requests
const originalFetch = apiClient.fetch;

apiClient.fetch = async (input, init = {}) => {
  const token = await getAuthToken();
  
  const headers = new Headers(init.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  return originalFetch(input, {
    ...init,
    headers,
  });
};

// Error handling interceptor
apiClient.fetch = async (input, init = {}) => {
  try {
    const response = await originalFetch(input, init);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new ApiError(error.message, response.status);
    }
    
    return response;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Network error', 0);
  }
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

#### Step 1.3: Better Auth Setup

For Web, the `authClient` is already configured in `apps/web/src/lib/auth-client.ts`.
For Mobile, a similar client will be initialized in `apps/mobile/src/lib/auth-client.ts`.


**Using Better Auth Pre-Built Components:**

Better Auth allows for custom login/signup forms (already implemented in `apps/web/src/routes/auth/`).
For complex UI like MFA or User Management, use the Better Auth UI package or custom components.

#### Step 1.4: Query Key Factory

**packages/api/src/queries/keys.ts:**
```typescript
/**
 * Query key factory for consistent cache key management
 * Prevents typos and ensures consistent invalidation
 */
export const queryKeys = {
  // Products
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters?: ProductFilters) => 
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    featured: () => [...queryKeys.products.all, 'featured'] as const,
    newArrivals: () => [...queryKeys.products.all, 'new-arrivals'] as const,
  },
  
  // Categories
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.categories.all, id] as const,
  },
  
  // Cart
  cart: {
    all: ['cart'] as const,
    current: () => [...queryKeys.cart.all, 'current'] as const,
  },
  
  // Orders
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.orders.all, id] as const,
  },
} as const;
```

#### Step 1.5: Unified Provider

**packages/api/src/providers/ApiProvider.tsx:**
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

### Phase 2: Commerce Core SDK

#### Step 2.1: Products Module

**packages/api/src/hooks/products.ts:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../queries/keys';
import type { ProductFilters } from '@nuur-fashion-commerce/shared/types';

// List products with filters
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: async () => {
      const res = await apiClient.api.products.$get({
        query: filters,
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
  });
}

// Get single product
export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: async () => {
      const res = await apiClient.api.products[':id'].$get({
        param: { id },
      });
      if (!res.ok) throw new Error('Failed to fetch product');
      return res.json();
    },
    enabled: !!id,
  });
}

// Featured products
export function useFeaturedProducts() {
  return useQuery({
    queryKey: queryKeys.products.featured(),
    queryFn: async () => {
      const res = await apiClient.api.products.featured.$get();
      if (!res.ok) throw new Error('Failed to fetch featured products');
      return res.json();
    },
  });
}

// New arrivals
export function useNewArrivals() {
  return useQuery({
    queryKey: queryKeys.products.newArrivals(),
    queryFn: async () => {
      const res = await apiClient.api.products['new-arrivals'].$get();
      if (!res.ok) throw new Error('Failed to fetch new arrivals');
      return res.json();
    },
  });
}
```

#### Step 2.2: Cart Module with Optimistic Updates

**packages/api/src/hooks/cart.ts:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../queries/keys';

// Get current cart
export function useCart() {
  return useQuery({
    queryKey: queryKeys.cart.current(),
    queryFn: async () => {
      const res = await apiClient.api.carts.$get();
      if (!res.ok) throw new Error('Failed to fetch cart');
      return res.json();
    },
  });
}

// Add item to cart (optimistic update)
export function useAddToCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: { productId: string; variantId?: string; quantity: number }) => {
      const res = await apiClient.api.carts.items.$post({
        json: item,
      });
      if (!res.ok) throw new Error('Failed to add item to cart');
      return res.json();
    },
    // Optimistic update
    onMutate: async (newItem) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.current() });
      
      // Snapshot previous value
      const previousCart = queryClient.getQueryData(queryKeys.cart.current());
      
      // Optimistically update
      queryClient.setQueryData(queryKeys.cart.current(), (old: any) => {
        if (!old) return { items: [newItem] };
        return {
          ...old,
          items: [...old.items, newItem],
        };
      });
      
      return { previousCart };
    },
    // Rollback on error
    onError: (_err, _newItem, context) => {
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

// Remove item from cart
export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (itemId: string) => {
      const res = await apiClient.api.carts.items[':id'].$delete({
        param: { id: itemId },
      });
      if (!res.ok) throw new Error('Failed to remove item from cart');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
    },
  });
}

// Update cart item quantity
export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const res = await apiClient.api.carts.items[':id'].$put({
        param: { id: itemId },
        json: { quantity },
      });
      if (!res.ok) throw new Error('Failed to update cart item');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
    },
  });
}
```

### Phase 3: TanStack Start SSR Integration

#### Step 3.1: SSR Provider Setup

**packages/api/src/providers/SSRProvider.tsx:**
```typescript
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { DehydratedState } from '@tanstack/react-query';

export function SSRProvider({
  children,
  dehydratedState,
}: {
  children: React.ReactNode;
  dehydratedState?: DehydratedState;
}) {
  return (
    <HydrationBoundary state={dehydratedState}>
      {children}
    </HydrationBoundary>
  );
}

// Helper to create dehydrated state in loaders
export function createDehydratedState(queryClient: QueryClient): DehydratedState {
  return dehydrate(queryClient);
}
```

#### Step 3.2: Route Loader Pattern

**apps/web/src/routes/shop.tsx:**
```typescript
import { createFileRoute } from '@tanstack/react-router';
import { useProducts } from '@nuur-fashion-commerce/api/hooks';
import { queryKeys } from '@nuur-fashion-commerce/api/queries';
import { apiClient } from '@nuur-fashion-commerce/api/client';

export const Route = createFileRoute('/shop')({
  // SSR loader
  loader: async ({ context }) => {
    const queryClient = context.queryClient;
    
    // Prefetch products on server
    await queryClient.prefetchQuery({
      queryKey: queryKeys.products.list(),
      queryFn: async () => {
        const res = await apiClient.api.products.$get();
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      },
    });
  },
  component: ShopPage,
});

function ShopPage() {
  // Data is already in cache from SSR!
  const { data: products, isLoading } = useProducts();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Shop</h1>
      <ProductGrid products={products} />
    </div>
  );
}
```

### Phase 4: Client State Management

#### Step 4.1: UI State with React useState

**Simple UI state (modals, sidebars):**
```typescript
// In components - no need for external library
function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  return isOpen ? <Sidebar onClose={() => setIsOpen(false)} /> : null;
}
```

#### Step 4.2: Filters with URL Search Params

**Using TanStack Router search params (persistent, shareable, SEO-friendly):**
```typescript
import { createFileRoute, useSearch } from '@tanstack/react-router';
import { useProducts } from '@nuur-fashion-commerce/api/hooks';

// Define search params schema
const shopSearchSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sizes: z.array(z.string()).optional(),
  sortBy: z.enum(['price-asc', 'price-desc', 'newest', 'popular']).optional(),
});

export const Route = createFileRoute('/shop')({
  validateSearch: shopSearchSchema,
  component: ShopPage,
});

function ShopPage() {
  // Filters from URL (persistent, shareable)
  const search = useSearch({ from: '/shop' });
  
  // Server state (TanStack Query)
  const { data: products } = useProducts(search);
  
  return <ProductGrid products={products} />;
}
```

**Benefits:**
- ✅ Filters persist in URL (shareable links)
- ✅ Browser back/forward works
- ✅ SEO-friendly
- ✅ No extra library needed
- ✅ Built into TanStack Router

### Phase 5: Error Handling & Type Safety

#### Step 5.1: Error Utilities

**packages/api/src/utils/errors.ts:**
```typescript
import { ApiError } from '../client/interceptors';

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

export function handleApiError(error: unknown) {
  if (isApiError(error)) {
    switch (error.status) {
      case 401:
        // Redirect to login
        window.location.href = '/auth/login';
        break;
      case 403:
        // Show forbidden message
        return 'You do not have permission to perform this action';
      case 404:
        return 'Resource not found';
      case 500:
        return 'Server error. Please try again later';
      default:
        return error.message;
    }
  }
  return getErrorMessage(error);
}
```

#### Step 5.2: Auth Utilities

**packages/api/src/utils/auth.ts:**
```typescript
/**
 * Better Auth session handling is automatic via cookies
 * Handles both SSR (TanStack Start) and client-side scenarios
 */

// For Web (TanStack Start) - SSR context
// For Web (TanStack Start) - Better Auth uses session cookies
export async function getAuthSessionSSR() {
  // Better Auth sessions are automatically handled via cookies
  return null;
}

// For Mobile (Expo)
export async function getAuthSessionMobile() {
  // Mobile session retrieval logic
  return null;
}
```

**Usage in API Client Interceptor:**
```typescript
// packages/api/src/client/interceptors.ts
import { getAuthTokenSSR } from '../utils/auth';

// Add auth token to requests
apiClient.fetch = async (input, init = {}) => {
  const token = typeof window === 'undefined' 
    ? await getAuthTokenSSR() 
    : null; // In browser, use hook in components
  
  const headers = new Headers(init.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  return originalFetch(input, { ...init, headers });
};
```

**Better Approach: Pass token from component:**
```typescript
// In components, get token and pass to API calls
import { authClient } from '../lib/auth-client';

function MyComponent() {
  const { getToken } = useAuth();
  
  const handleApiCall = async () => {
    const token = await getToken();
    // Pass token to API call
    const res = await apiClient.api.products.$get({
      header: { Authorization: `Bearer ${token}` }
    });
  };
}
```

**Usage in API Client Interceptor:**
```typescript
// packages/api/src/client/interceptors.ts
import { getAuthToken } from '../utils/auth';

// Add auth token to requests
apiClient.fetch = async (input, init = {}) => {
  const token = await getAuthToken();
  
  const headers = new Headers(init.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  return originalFetch(input, { ...init, headers });
};
```

**Usage in Components (Recommended):**
```typescript
// In components, use Better Auth client hooks
import { authClient } from '../lib/auth-client';

function MyComponent() {
  const { getToken, userId, isSignedIn } = useAuth();
  
  const handleApiCall = async () => {
    const token = await getToken();
    // Use token in API call
  };
}
```

---

## 📅 Implementation Roadmap

### ✅ Phase 1: SDK Foundation (Week 1)
- [ ] Initialize `packages/api` package
- [ ] Set up Hono RPC client with type inference
- [ ] Create query key factory
- [ ] Implement unified ApiProvider
- [ ] Add error handling utilities
- [ ] Set up auth token management

### ✅ Phase 2: Core Modules (Week 2)
- [ ] Products module (list, detail, featured, new arrivals)
- [ ] Categories module
- [ ] Brands module
- [ ] Cart module with optimistic updates
- [ ] Orders module
- [ ] Reviews module
- [ ] Wishlists module

### ✅ Phase 3: SSR Integration (Week 3)
- [ ] Set up SSR provider for TanStack Start
- [ ] Implement route loaders for key pages
- [ ] Add hydration support
- [ ] Test SSR data fetching

### ✅ Phase 4: Web Integration (Week 4)
- [ ] Replace local state with SDK hooks
- [ ] Update all routes to use SDK
- [ ] Ensure authentication forms and user menus are fully integrated with Better Auth
- [ ] Implement filters with URL search params
- [ ] Add error boundaries
- [ ] Implement loading states
- [ ] Add optimistic UI updates

### ✅ Phase 5: Mobile Integration (Week 5)
- [ ] Set up persistent cache for mobile
- [ ] Integrate SDK hooks in mobile app
- [ ] Add offline support
- [ ] Test on iOS and Android

### ✅ Phase 6: Polish & Optimization (Week 6)
- [ ] Add request deduplication
- [ ] Implement cache invalidation strategies
- [ ] Add performance monitoring
- [ ] Write documentation
- [ ] Add tests

---

## 💎 Why This Approach is "Premium"

### 1. **Single Source of Truth**
Fixed a bug in the Cart logic? It's fixed on both iPhone and Web simultaneously.

### 2. **Unbeatable Type Safety**
If a backend developer changes a field name, both the Web and Mobile apps will show TypeScript errors immediately.

### 3. **Optimistic UI**
Shared hooks provide "instant" feedback to users (e.g., items appearing in the cart before the request finishes).

### 4. **SSR Performance**
TanStack Start loaders fetch data on the server, providing instant page loads with SEO benefits.

### 5. **Offline Support**
Mobile app works offline with persistent caching, providing a native app-like experience.

### 6. **Developer Experience**
- Autocomplete for all API calls
- Type-safe error handling
- Consistent patterns across the codebase
- Easy to test and mock

---

## 🔒 Security Considerations

1. **Auth Tokens**: Stored securely, never in localStorage
2. **CORS**: Properly configured on backend
3. **Input Validation**: Zod schemas validate all inputs
4. **Error Messages**: Sanitized to prevent information leakage
5. **Rate Limiting**: Handled on backend, respected by client

---

## 📊 Performance Optimizations

1. **Query Deduplication**: TanStack Query automatically deduplicates requests
2. **Stale-While-Revalidate**: Show cached data while fetching fresh data
3. **Optimistic Updates**: Instant UI feedback
4. **Code Splitting**: SDK modules loaded on demand
5. **SSR Caching**: Server-side data cached and hydrated

---

## 🧪 Testing Strategy

### Unit Tests
- Test individual hooks
- Test query key factory
- Test error handling

### Integration Tests
- Test API client with mock server
- Test optimistic updates
- Test cache invalidation

### E2E Tests
- Test complete user flows
- Test SSR hydration
- Test offline behavior

---

## 📚 Resources

- [Hono RPC Client Docs](https://hono.dev/docs/rpc/client)
- [TanStack Query v5 Docs](https://tanstack.com/query/latest)
- [TanStack Start Docs](https://tanstack.com/start/latest)
- [Better Auth Docs](https://www.better-auth.com/docs)

---

**Next Steps:** Begin Phase 1 implementation by initializing the `packages/api` package and setting up the Hono RPC client.
