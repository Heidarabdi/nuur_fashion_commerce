import { db } from "../src/db";
import { products, users, reviews, wishlists, wishlistItems } from "../src/db/schema";
import { reviewsService } from "../src/services/reviews.service";
import { wishlistsService } from "../src/services/wishlists.service";
import { eq, and } from "drizzle-orm";

const verifyEngagement = async () => {
    console.log("Verifying Engagement Features (Reviews & Wishlists)...");

    // 1. Get a test user and product
    const admin = await db.query.users.findFirst({
        where: eq(users.role, "admin")
    });
    if (!admin) {
        console.error("Admin user not found. Run seed-admin.ts first.");
        return;
    }

    const product = await db.query.products.findFirst();
    if (!product) {
        console.error("No products found. Run seed script or verify catalog first.");
        return;
    }

    console.log(`Using User: ${admin.email}, Product: ${product.name}`);

    // 2. Test Wishlist
    console.log("Testing Wishlist...");
    const wishlist = await wishlistsService.getForUser(admin.id);
    console.log("User wishlist found/created:", wishlist.name);

    const addedItem = await wishlistsService.addItem(admin.id, { productId: product.id });
    console.log("Item added to wishlist:", addedItem.id);

    const refreshedWishlist = await wishlistsService.getForUser(admin.id);
    console.log("Wishlist items count:", refreshedWishlist.items.length);

    // 3. Test Reviews
    console.log("Testing Reviews...");
    const review = await reviewsService.create(admin.id, {
        productId: product.id,
        rating: 5,
        title: "Great Product!",
        content: "Highly recommended."
    });
    console.log("Review created:", review.id, "Status:", review.status);

    // Approve review
    console.log("Approving review...");
    const approved = await reviewsService.approve(review.id);
    console.log("Review status now:", approved.status);

    // Fetch reviews for product
    const productReviews = await reviewsService.getByProduct(product.id);
    console.log(`Total approved reviews for product: ${productReviews.length}`);

    // Clean up (Optional, but good for repetitive runs if we use unique IDs)
    // For now we just verify it works.

    console.log("Engagement Verification Complete!");
};

verifyEngagement().catch(console.error);
