import { Hono } from "hono";
import productsRoutes from "./products.routes";
import categoriesRoutes from "./categories.routes";
import brandsRoutes from "./brands.routes";
import usersRoutes from "./users.routes";
import addressesRoutes from "./addresses.routes";
import cartsRoutes from "./carts.routes";
import ordersRoutes from "./orders.routes";
import reviewsRoutes from "./reviews.routes";
import wishlistsRoutes from "./wishlists.routes";
import adminRoutes from "./admin";
import uploadRoutes from "./upload.routes";

const routes = new Hono();

routes.route("/products", productsRoutes);
routes.route("/categories", categoriesRoutes);
routes.route("/brands", brandsRoutes);
routes.route("/users", usersRoutes);
routes.route("/addresses", addressesRoutes);
routes.route("/carts", cartsRoutes);
routes.route("/orders", ordersRoutes);
routes.route("/reviews", reviewsRoutes);
routes.route("/wishlists", wishlistsRoutes);
routes.route("/admin", adminRoutes);
routes.route("/upload", uploadRoutes);

export default routes;
