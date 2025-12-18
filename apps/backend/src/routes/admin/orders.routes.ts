import { Hono } from "hono";
import { ordersController } from "../../controllers/orders.controller";

const adminOrdersRoutes = new Hono();

// GET /api/admin/orders
adminOrdersRoutes.get("/", ordersController.adminGetAll);

// PATCH /api/admin/orders/:id
adminOrdersRoutes.patch("/:id", ordersController.adminUpdateStatus);

export default adminOrdersRoutes;
