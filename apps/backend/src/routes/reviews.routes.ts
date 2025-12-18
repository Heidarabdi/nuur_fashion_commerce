import { Hono } from "hono";
import { reviewsController } from "../controllers/reviews.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const reviewsRoutes = new Hono();

// Public: List reviews for a product (usually mounted at /products/:id/reviews or /reviews?productId=...)
// But our design in SERVER_PLAN says /api/products/:id/reviews. 
// However, we can also have /api/reviews for easier posting.

// Protected: Create Review
reviewsRoutes.post("/", authMiddleware, reviewsController.create);

// Admin Routes (Could be moved to admin router, but kept here for cohesion if guarded)
reviewsRoutes.patch("/:id/approve", authMiddleware, adminMiddleware, reviewsController.adminApprove);
reviewsRoutes.patch("/:id/reject", authMiddleware, adminMiddleware, reviewsController.adminReject);

export default reviewsRoutes;
