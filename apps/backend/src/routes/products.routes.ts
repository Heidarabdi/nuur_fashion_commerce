import { Hono } from "hono";
import { productsController } from "../controllers/products.controller";
import { reviewsController } from "../controllers/reviews.controller";

const productsRoutes = new Hono();

productsRoutes.get("/", productsController.getAll);
productsRoutes.get("/:id", productsController.getById);
productsRoutes.get("/:id/reviews", reviewsController.getByProduct);
productsRoutes.get("/slug/:slug", productsController.getBySlug);
productsRoutes.post("/", productsController.create); // Auth middleware to be added later

export default productsRoutes;
