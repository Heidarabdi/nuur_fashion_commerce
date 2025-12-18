import { Hono } from "hono";
import { adminController } from "../../controllers/admin.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";

import productsRoutes from "./products.routes";
import categoriesRoutes from "./categories.routes";
import brandsRoutes from "./brands.routes";
import ordersRoutes from "./orders.routes";

// We will mount this under /api/admin
const adminRoutes = new Hono();

// Global Protection for all Admin Routes
adminRoutes.use("*", authMiddleware, adminMiddleware);

adminRoutes.get("/stats", adminController.getStats);

adminRoutes.route("/products", productsRoutes);
adminRoutes.route("/categories", categoriesRoutes);
adminRoutes.route("/brands", brandsRoutes);
adminRoutes.route("/orders", ordersRoutes);

export default adminRoutes;
