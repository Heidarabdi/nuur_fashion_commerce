import { Hono } from "hono";
import { categoriesController } from "../controllers/categories.controller";

const categoriesRoutes = new Hono();

categoriesRoutes.get("/", categoriesController.getAll);
categoriesRoutes.get("/:id", categoriesController.getById);
categoriesRoutes.get("/slug/:slug", categoriesController.getBySlug);
categoriesRoutes.get("/slug/:slug/products", categoriesController.getProducts);
categoriesRoutes.post("/", categoriesController.create);

export default categoriesRoutes;
