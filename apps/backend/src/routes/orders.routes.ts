import { Hono } from "hono";
import { ordersController } from "../controllers/orders.controller";
import { authMiddleware, optionalAuthMiddleware } from "../middleware";

const ordersRoutes = new Hono();

// Create order can be Guest or User
ordersRoutes.post("/", optionalAuthMiddleware, ordersController.create);


// Listing orders is strictly protected
ordersRoutes.get("/", authMiddleware, ordersController.getMyOrders);
ordersRoutes.get("/:id", authMiddleware, ordersController.getById);

export default ordersRoutes;
