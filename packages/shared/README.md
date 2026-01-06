# @nuur-fashion-commerce/shared

Shared schemas, types, and utilities for the Nuur Fashion platform.

## Overview

This package provides:
- **Zod schemas** for validation across frontend and backend
- **TypeScript types** inferred from schemas
- Shared constants and utilities

## Installation

```bash
# From workspace
bun install @nuur-fashion-commerce/shared
```

## Schemas

### Products

```tsx
import {
  createProductSchema,
  updateProductSchema,
  productStatusSchema
} from '@nuur-fashion-commerce/shared';

// Validate product creation
const result = createProductSchema.safeParse({
  name: 'Cotton Shirt',
  price: 29.99,
  status: 'active',
  images: ['https://...']
});

// Product status enum: 'draft' | 'active' | 'archived'
const status = productStatusSchema.parse('active');
```

### Categories

```tsx
import { createCategorySchema } from '@nuur-fashion-commerce/shared';

const result = createCategorySchema.safeParse({
  name: 'T-Shirts',
  description: 'Casual wear',
  slug: 't-shirts'
});
```

### Brands

```tsx
import { createBrandSchema } from '@nuur-fashion-commerce/shared';

const result = createBrandSchema.safeParse({
  name: 'Nike',
  description: 'Just Do It',
  slug: 'nike'
});
```

### Cart

```tsx
import { addToCartSchema, updateCartItemSchema } from '@nuur-fashion-commerce/shared';

addToCartSchema.parse({
  productId: '...',
  quantity: 1
});

updateCartItemSchema.parse({
  quantity: 3
});
```

### Orders

```tsx
import { createOrderSchema, updateOrderStatusSchema } from '@nuur-fashion-commerce/shared';

createOrderSchema.parse({
  addressId: '...',
  paymentMethod: 'card'
});

updateOrderStatusSchema.parse({
  status: 'shipped'
});
```

### Addresses

```tsx
import { createAddressSchema } from '@nuur-fashion-commerce/shared';

createAddressSchema.parse({
  name: 'Home',
  street: '123 Main St',
  city: 'New York',
  state: 'NY',
  postalCode: '10001',
  country: 'USA',
  phone: '+1234567890',
  isDefault: true
});
```

### Reviews

```tsx
import { createReviewSchema } from '@nuur-fashion-commerce/shared';

createReviewSchema.parse({
  productId: '...',
  rating: 5,
  title: 'Great product!',
  content: 'Highly recommend'
});
```

## Type Inference

Get TypeScript types from schemas:

```tsx
import { z } from 'zod';
import { createProductSchema } from '@nuur-fashion-commerce/shared';

type CreateProductInput = z.infer<typeof createProductSchema>;
// {
//   name: string;
//   price: number;
//   description?: string;
//   categoryId?: string;
//   brandId?: string;
//   status?: 'draft' | 'active' | 'archived';
//   isFeatured?: boolean;
//   isNew?: boolean;
//   images?: string[];
// }
```

## Exports

```tsx
// Product schemas
export {
  productSchema,
  createProductSchema,
  updateProductSchema,
  productStatusSchema
} from './schemas/products';

// Category schemas
export {
  categorySchema,
  createCategorySchema
} from './schemas/categories';

// Brand schemas
export {
  brandSchema,
  createBrandSchema
} from './schemas/brands';

// Cart schemas
export {
  addToCartSchema,
  updateCartItemSchema
} from './schemas/cart';

// Order schemas
export {
  createOrderSchema,
  updateOrderStatusSchema
} from './schemas/orders';

// Address schemas
export {
  createAddressSchema
} from './schemas/addresses';

// Review schemas
export {
  createReviewSchema
} from './schemas/reviews';
```

## Building

```bash
bun run build
```

This generates compiled JavaScript and type declarations for non-TypeScript consumers.
