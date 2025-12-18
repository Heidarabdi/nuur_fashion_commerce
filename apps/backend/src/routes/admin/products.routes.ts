import { Hono } from "hono";
import { productsController } from "../../controllers/products.controller";

const adminProductsRoutes = new Hono();

// All routes are already protected by adminMiddleware in the parent router
adminProductsRoutes.post("/", productsController.create);
adminProductsRoutes.put("/:id", productsController.update);
adminProductsRoutes.delete("/:id", productsController.delete);

export default adminProductsRoutes;
