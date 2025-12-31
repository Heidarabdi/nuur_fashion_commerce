import { db } from "../index";
import { products, productVariants, productImages, productCategories, categories, brands } from "../schema";
import { eq } from "drizzle-orm";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = ["Black", "White", "Navy", "Gray", "Beige"];

// Product data with multiple category slugs (first is product type, second is gender/demographic)
const productData = [
    // Men's products - each has both a product type category AND the "men" category
    { name: "Classic Cotton T-Shirt", categorySlugs: ["men-tshirts", "men"], brandSlug: "nuur-fashion", price: 29.99, description: "Premium cotton t-shirt for everyday comfort", isFeatured: true, isNew: true },
    { name: "Slim Fit Jeans", categorySlugs: ["men-pants", "men"], brandSlug: "urban-style", price: 79.99, description: "Classic slim fit denim jeans", isFeatured: true },
    { name: "Oxford Button-Down Shirt", categorySlugs: ["men-shirts", "men"], brandSlug: "elegance", price: 59.99, description: "Timeless Oxford shirt for any occasion" },
    { name: "Bomber Jacket", categorySlugs: ["men-jackets", "men"], brandSlug: "urban-style", price: 129.99, description: "Stylish bomber jacket for cool weather", isFeatured: true, isNew: true },
    { name: "Casual Polo", categorySlugs: ["men-tshirts", "men"], brandSlug: "nuur-fashion", price: 39.99, description: "Comfortable polo for casual occasions" },

    // Women's products - each has both a product type category AND the "women" category
    { name: "Floral Summer Dress", categorySlugs: ["women-dresses", "women"], brandSlug: "nuur-fashion", price: 89.99, description: "Beautiful floral print summer dress", isFeatured: true, isNew: true },
    { name: "High-Waist Trouser", categorySlugs: ["women-pants", "women"], brandSlug: "elegance", price: 69.99, description: "Elegant high-waist trousers" },
    { name: "Silk Blouse", categorySlugs: ["women-tops", "women"], brandSlug: "elegance", price: 79.99, description: "Luxurious silk blouse", isFeatured: true },
    { name: "A-Line Midi Skirt", categorySlugs: ["women-skirts", "women"], brandSlug: "nuur-fashion", price: 54.99, description: "Classic A-line midi skirt" },
    { name: "Casual Linen Top", categorySlugs: ["women-tops", "women"], brandSlug: "cozy-home", price: 44.99, description: "Breathable linen top for summer", isNew: true },

    // Kids products
    { name: "Boys Graphic Tee", categorySlugs: ["kids-boys", "kids"], brandSlug: "nuur-fashion", price: 19.99, description: "Fun graphic t-shirt for boys", isNew: true },
    { name: "Girls Party Dress", categorySlugs: ["kids-girls", "kids"], brandSlug: "elegance", price: 49.99, description: "Beautiful party dress for special occasions", isFeatured: true },

    // More featured products
    { name: "Athletic Performance Tee", categorySlugs: ["men-tshirts", "men"], brandSlug: "active-wear", price: 34.99, description: "Moisture-wicking athletic t-shirt", isNew: true },
    { name: "Yoga Leggings", categorySlugs: ["women-pants", "women"], brandSlug: "active-wear", price: 59.99, description: "High-performance yoga leggings", isFeatured: true },
];

const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export const seedProducts = async () => {
    // Get categories and brands
    const allCategories = await db.query.categories.findMany();
    const allBrands = await db.query.brands.findMany();

    const categoryMap = new Map(allCategories.map((c: { slug: string; id: string }) => [c.slug, c.id]));
    const brandMap = new Map(allBrands.map((b: { slug: string; id: string }) => [b.slug, b.id]));

    console.log("  Creating products...");

    for (const prod of productData) {
        const slug = generateSlug(prod.name);
        // Get the first category for the main categoryId (backwards compatible)
        const primaryCategoryId = categoryMap.get(prod.categorySlugs[0]);
        const brandId = brandMap.get(prod.brandSlug);

        if (!primaryCategoryId) {
            console.log(`  ⚠ Skipping ${prod.name}: category ${prod.categorySlugs[0]} not found`);
            continue;
        }

        // Check if product exists
        const existing = await db.query.products.findFirst({
            where: eq(products.slug, slug)
        });

        if (existing) {
            console.log(`  ⏭ Product ${prod.name} already exists`);

            // Still add to product_categories if not already there
            for (const catSlug of prod.categorySlugs) {
                const catId = categoryMap.get(catSlug);
                if (catId) {
                    await db.insert(productCategories).values({
                        productId: existing.id,
                        categoryId: catId,
                    }).onConflictDoNothing();
                }
            }
            continue;
        }

        // Insert product
        const [product] = await db.insert(products).values({
            name: prod.name,
            slug,
            description: prod.description,
            price: prod.price.toString(),
            categoryId: primaryCategoryId,
            brandId,
            status: "active",
            isFeatured: prod.isFeatured || false,
            isNew: prod.isNew || false,
        }).returning();

        console.log(`  ✓ Created product: ${product.name}`);

        // Add product to multiple categories via junction table
        for (const catSlug of prod.categorySlugs) {
            const catId = categoryMap.get(catSlug);
            if (catId) {
                await db.insert(productCategories).values({
                    productId: product.id,
                    categoryId: catId,
                }).onConflictDoNothing();
            }
        }
        console.log(`    → Added to ${prod.categorySlugs.length} categories`);

        // Add variants (sizes)
        const variantData = sizes.map((size, idx) => ({
            productId: product.id,
            name: `${product.name} - ${size}`,
            size,
            color: colors[idx % colors.length],
            stockQuantity: Math.floor(Math.random() * 50) + 10,
            sku: `${slug}-${size.toLowerCase()}`,
        }));

        await db.insert(productVariants).values(variantData);
        console.log(`    → Added ${sizes.length} variants`);

        // Add placeholder images
        const imageData = [
            { productId: product.id, url: `https://placehold.co/600x800/1a1a2e/ffffff?text=${encodeURIComponent(prod.name)}`, altText: prod.name, position: 0, isPrimary: true },
            { productId: product.id, url: `https://placehold.co/600x800/16213e/ffffff?text=${encodeURIComponent(prod.name)}+Back`, altText: `${prod.name} - Back`, position: 1, isPrimary: false },
        ];

        await db.insert(productImages).values(imageData);
        console.log(`    → Added ${imageData.length} images`);
    }

    const total = await db.query.products.findMany();
    console.log(`  ✓ Total products in database: ${total.length}`);
};

// Allow running directly
if (import.meta.main) {
    seedProducts()
        .then(() => {
            console.log("Products seeded successfully!");
            process.exit(0);
        })
        .catch((err) => {
            console.error("Failed to seed products:", err);
            process.exit(1);
        });
}
