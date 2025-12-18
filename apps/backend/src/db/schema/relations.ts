import { relations } from "drizzle-orm";
import { users } from "./users";
import { products } from "./products";
import { categories } from "./categories";
import { brands } from "./brands";
import { carts } from "./carts";
import { cartItems } from "./cart_items";
import { productVariants } from "./product_variants";
import { productImages } from "./product_images";
import { orders } from "./orders";
import { orderItems } from "./order_items";
import { addresses } from "./addresses";
import { reviews } from "./reviews";
import { wishlists } from "./wishlists";
import { wishlistItems } from "./wishlist_items";

// Users Relations
export const usersRelations = relations(users, ({ many }) => ({
    carts: many(carts),
    orders: many(orders),
    addresses: many(addresses),
    reviews: many(reviews),
    wishlists: many(wishlists),
}));

// Products Relations
export const productsRelations = relations(products, ({ one, many }) => ({
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id],
    }),
    brand: one(brands, {
        fields: [products.brandId],
        references: [brands.id],
    }),
    variants: many(productVariants),
    images: many(productImages),
    reviews: many(reviews),
    wishlistItems: many(wishlistItems),
}));

// Carts Relations
export const cartsRelations = relations(carts, ({ one, many }) => ({
    user: one(users, {
        fields: [carts.userId],
        references: [users.id],
    }),
    items: many(cartItems),
}));

// Cart Items Relations
export const cartItemsRelations = relations(cartItems, ({ one }) => ({
    cart: one(carts, {
        fields: [cartItems.cartId],
        references: [carts.id],
    }),
    product: one(products, {
        fields: [cartItems.productId],
        references: [products.id],
    }),
    variant: one(productVariants, {
        fields: [cartItems.variantId],
        references: [productVariants.id],
    }),
}));

// Orders Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
    items: many(orderItems),
    address: one(addresses, {
        fields: [orders.addressId],
        references: [addresses.id]
    })
}));

// Order Items Relations
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    product: one(products, {
        fields: [orderItems.productId],
        references: [products.id],
    }),
    variant: one(productVariants, {
        fields: [orderItems.variantId],
        references: [productVariants.id]
    })
}));

// Categories Relations (Recursive potentially, but for now simple)
export const categoriesRelations = relations(categories, ({ one, many }) => ({
    parent: one(categories, {
        fields: [categories.parentId],
        references: [categories.id],
        relationName: "parent_child"
    }),
    children: many(categories, { relationName: "parent_child" }),
    products: many(products),
}));

// Brand Relations
export const brandsRelations = relations(brands, ({ many }) => ({
    products: many(products),
}));

// Reviews Relations
export const reviewsRelations = relations(reviews, ({ one }) => ({
    user: one(users, {
        fields: [reviews.userId],
        references: [users.id],
    }),
    product: one(products, {
        fields: [reviews.productId],
        references: [products.id],
    }),
}));

// Wishlists Relations
export const wishlistsRelations = relations(wishlists, ({ one, many }) => ({
    user: one(users, {
        fields: [wishlists.userId],
        references: [users.id],
    }),
    items: many(wishlistItems),
}));

// Wishlist Items Relations
export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
    wishlist: one(wishlists, {
        fields: [wishlistItems.wishlistId],
        references: [wishlists.id],
    }),
    product: one(products, {
        fields: [wishlistItems.productId],
        references: [products.id],
    }),
}));
