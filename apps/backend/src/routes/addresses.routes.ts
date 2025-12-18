import { Hono } from "hono";
import { addressesController } from "../controllers/addresses.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const addressesRoutes = new Hono();

// Protected Routes
addressesRoutes.use("*", authMiddleware);

addressesRoutes.get("/", addressesController.getAll);
addressesRoutes.post("/", addressesController.create);
addressesRoutes.delete("/:id", addressesController.delete);

export default addressesRoutes;
