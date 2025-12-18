import { Hono } from "hono";
import { brandsController } from "../controllers/brands.controller";

const brandsRoutes = new Hono();

brandsRoutes.get("/", brandsController.getAll);
brandsRoutes.get("/:id", brandsController.getById);
brandsRoutes.get("/slug/:slug", brandsController.getBySlug);
brandsRoutes.get("/slug/:slug/products", brandsController.getProducts);
brandsRoutes.post("/", brandsController.create);

export default brandsRoutes;
