import { db } from "../index";
import { products, productVariants, productImages, categories, brands } from "../schema";
import { eq } from "drizzle-orm";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = ["Black", "White", "Navy", "Gray", "Beige"];

const productData = [
    // Men's products
    { name: "Classic Cotton T-Shirt", categorySlug: "men-tshirts", brandSlug: "nuur-fashion", price: 29.99, description: "Premium cotton t-shirt for everyday comfort", isFeatured: true, isNew: true },
    { name: "Slim Fit Jeans", categorySlug: "men-pants", brandSlug: "urban-style", price: 79.99, description: "Classic slim fit denim jeans", isFeatured: true },
    { name: "Oxford Button-Down Shirt", categorySlug: "men-shirts", brandSlug: "elegance", price: 59.99, description: "Timeless Oxford shirt for any occasion" },
    { name: "Bomber Jacket", categorySlug: "men-jackets", brandSlug: "urban-style", price: 129.99, description: "Stylish bomber jacket for cool weather", isFeatured: true, isNew: true },
    { name: "Casual Polo", categorySlug: "men-tshirts", brandSlug: "nuur-fashion", price: 39.99, description: "Comfortable polo for casual occasions" },

    // Women's products
    { name: "Floral Summer Dress", categorySlug: "women-dresses", brandSlug: "nuur-fashion", price: 89.99, description: "Beautiful floral print summer dress", isFeatured: true, isNew: true },
    { name: "High-Waist Trouser", categorySlug: "women-pants", brandSlug: "elegance", price: 69.99, description: "Elegant high-waist trousers" },
    { name: "Silk Blouse", categorySlug: "women-tops", brandSlug: "elegance", price: 79.99, description: "Luxurious silk blouse", isFeatured: true },
    { name: "A-Line Midi Skirt", categorySlug: "women-skirts", brandSlug: "nuur-fashion", price: 54.99, description: "Classic A-line midi skirt" },
    { name: "Casual Linen Top", categorySlug: "women-tops", brandSlug: "cozy-home", price: 44.99, description: "Breathable linen top for summer", isNew: true },

    // More featured products
    { name: "Athletic Performance Tee", categorySlug: "men-tshirts", brandSlug: "active-wear", price: 34.99, description: "Moisture-wicking athletic t-shirt", isNew: true },
    { name: "Yoga Leggings", categorySlug: "women-pants", brandSlug: "active-wear", price: 59.99, description: "High-performance yoga leggings", isFeatured: true },
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
        const categoryId = categoryMap.get(prod.categorySlug);
        const brandId = brandMap.get(prod.brandSlug);

        if (!categoryId) {
            console.log(`  ⚠ Skipping ${prod.name}: category ${prod.categorySlug} not found`);
            continue;
        }

        // Check if product exists
        const existing = await db.query.products.findFirst({
            where: eq(products.slug, slug)
        });

        if (existing) {
            console.log(`  ⏭ Product ${prod.name} already exists`);
            continue;
        }

        // Insert product
        const [product] = await db.insert(products).values({
            name: prod.name,
            slug,
            description: prod.description,
            price: prod.price.toString(),
            categoryId,
            brandId,
            status: "active",
            isFeatured: prod.isFeatured || false,
            isNew: prod.isNew || false,
        }).returning();

        console.log(`  ✓ Created product: ${product.name}`);

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
