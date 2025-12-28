import { db } from "../db";
import { orders, users, products } from "../db/schema";
import { count, sum, eq, desc, not } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof users>;

export const adminService = {
    async getDashboardStats() {
        // 1. Total Revenue (sum of all NON-CANCELLED orders)
        const [revenueResult] = await db
            .select({ value: sum(orders.totalAmount) })
            .from(orders)
            .where(not(eq(orders.status, "cancelled")));

        // 2. Total Orders
        const [ordersResult] = await db
            .select({ value: count() })
            .from(orders);

        // 3. Total Customers
        const [customersResult] = await db
            .select({ value: count() })
            .from(users)
            .where(eq(users.role, "customer"));

        // 4. Recent Orders
        const recentOrders = await db.query.orders.findMany({
            orderBy: desc(orders.createdAt),
            limit: 5,
            with: {
                user: true,
                items: true
            }
        });

        // 5. Total Products
        const [productsResult] = await db
            .select({ value: count() })
            .from(products);

        return {
            totalRevenue: Number(revenueResult?.value || 0),
            totalOrders: Number(ordersResult?.value || 0),
            totalCustomers: Number(customersResult?.value || 0),
            totalProducts: Number(productsResult?.value || 0),
            recentOrders
        };
    },

    async getCustomers() {
        // Get all customers with their order count and total spent
        const customers = await db.query.users.findMany({
            where: eq(users.role, "customer"),
            orderBy: desc(users.createdAt),
        });

        // For each customer, get their order stats
        const customersWithStats = await Promise.all(
            customers.map(async (customer: User) => {
                const [orderStats] = await db
                    .select({
                        orderCount: count(),
                        totalSpent: sum(orders.totalAmount),
                    })
                    .from(orders)
                    .where(eq(orders.userId, customer.id));

                return {
                    id: customer.id,
                    name: customer.name,
                    email: customer.email,
                    image: customer.image,
                    createdAt: customer.createdAt,
                    orderCount: Number(orderStats?.orderCount || 0),
                    totalSpent: Number(orderStats?.totalSpent || 0),
                };
            })
        );

        return customersWithStats;
    },

    async getAllProducts() {
        // Get all products including drafts for admin
        const allProducts = await db.query.products.findMany({
            orderBy: desc(products.createdAt),
            with: {
                category: true,
                brand: true,
            },
        });
        return allProducts;
    },
};
