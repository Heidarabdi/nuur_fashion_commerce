/**
 * Query key factory for consistent cache key management
 * Prevents typos and ensures consistent invalidation
 */

export const queryKeys = {
  // Products
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    bySlug: (slug: string) => [...queryKeys.products.all, 'slug', slug] as const,
    featured: () => [...queryKeys.products.all, 'featured'] as const,
    newArrivals: () => [...queryKeys.products.all, 'new-arrivals'] as const,
  },

  // Categories
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    list: () => [...queryKeys.categories.lists()] as const,
    details: () => [...queryKeys.categories.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },

  // Brands
  brands: {
    all: ['brands'] as const,
    lists: () => [...queryKeys.brands.all, 'list'] as const,
    list: () => [...queryKeys.brands.lists()] as const,
    details: () => [...queryKeys.brands.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.brands.details(), id] as const,
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
    list: () => [...queryKeys.orders.lists()] as const,
    details: () => [...queryKeys.orders.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
  },

  // Reviews
  reviews: {
    all: ['reviews'] as const,
    byProduct: (productId: string) => [...queryKeys.reviews.all, 'product', productId] as const,
  },

  // Wishlists
  wishlists: {
    all: ['wishlists'] as const,
    lists: () => [...queryKeys.wishlists.all, 'list'] as const,
    list: () => [...queryKeys.wishlists.lists()] as const,
  },

  // Admin
  admin: {
    all: ['admin'] as const,
    stats: () => [...queryKeys.admin.all, 'stats'] as const,
    products: () => [...queryKeys.admin.all, 'products'] as const,
    orders: () => [...queryKeys.admin.all, 'orders'] as const,
    customers: () => [...queryKeys.admin.all, 'customers'] as const,
  },
} as const;

