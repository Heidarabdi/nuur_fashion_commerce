/**
 * Shared Type Definitions
 *
 * Minimal, well-typed interfaces used across apps. Keep these lightweight
 * — the more detailed runtime validation belongs in `src/schemas`.
 */

/** Utility maybe type used across packages */
export type Maybe<T> = T | null | undefined;

/** Product entity used in shop/catalog flows */
export type Product = {
  id: string | number;
  name: string;
  price: number;
  currency?: string;
  slug?: string;
  categories?: string[];
  images?: string[];
  createdAt?: string;
};

/** User entity used for accounts & authorization */
export type User = {
  id: string | number;
  name: string;
  email: string;
  roles?: string[];
  createdAt?: string;
};

/** Category entity for product categorization */
export type Category = {
  id: string | number;
  name: string;
  slug?: string;
};

/** Small helper union used in a few places */
export type ID = string | number;

export {};

/* NOTE:
   This file intentionally exports only lightweight TypeScript types.
   For runtime schema validation please use the Zod schemas in `src/schemas`.
*/
