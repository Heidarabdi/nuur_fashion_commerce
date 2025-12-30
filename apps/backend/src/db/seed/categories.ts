import { db } from "../index";
import { categories } from "../schema";

const categoryData = [
    { name: "Men", slug: "men", description: "Men's clothing and accessories", position: 1 },
    { name: "Women", slug: "women", description: "Women's clothing and accessories", position: 2 },
    { name: "Kids", slug: "kids", description: "Kids' clothing and accessories", position: 3 },
    { name: "Accessories", slug: "accessories", description: "Fashion accessories", position: 4 },
];

const subCategories = [
    // Men's subcategories
    { name: "T-Shirts", slug: "men-tshirts", description: "Men's t-shirts", parentSlug: "men", position: 1 },
    { name: "Shirts", slug: "men-shirts", description: "Men's shirts", parentSlug: "men", position: 2 },
    { name: "Pants", slug: "men-pants", description: "Men's pants", parentSlug: "men", position: 3 },
    { name: "Jackets", slug: "men-jackets", description: "Men's jackets", parentSlug: "men", position: 4 },
    // Women's subcategories
    { name: "Dresses", slug: "women-dresses", description: "Women's dresses", parentSlug: "women", position: 1 },
    { name: "Tops", slug: "women-tops", description: "Women's tops", parentSlug: "women", position: 2 },
    { name: "Pants", slug: "women-pants", description: "Women's pants", parentSlug: "women", position: 3 },
    { name: "Skirts", slug: "women-skirts", description: "Women's skirts", parentSlug: "women", position: 4 },
    // Kids subcategories
    { name: "Boys", slug: "kids-boys", description: "Boys' clothing", parentSlug: "kids", position: 1 },
    { name: "Girls", slug: "kids-girls", description: "Girls' clothing", parentSlug: "kids", position: 2 },
];

export const seedCategories = async () => {
    console.log("  Creating main categories...");

    // Insert main categories
    const insertedCategories = await db.insert(categories)
        .values(categoryData.map(cat => ({
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            position: cat.position,
            isActive: true,
        })))
        .onConflictDoNothing({ target: categories.slug })
        .returning();

    console.log(`  ✓ Created ${insertedCategories.length} main categories`);

    // Get all categories to find parent IDs
    const allCategories = await db.query.categories.findMany();
    const categoryMap = new Map(allCategories.map((c: { slug: string; id: string }) => [c.slug, c.id]));

    // Insert subcategories
    console.log("  Creating subcategories...");
    const subCatValues = subCategories.map(sub => ({
        name: sub.name,
        slug: sub.slug,
        description: sub.description,
        position: sub.position,
        parentId: categoryMap.get(sub.parentSlug) || null,
        isActive: true,
    }));

    const insertedSubs = await db.insert(categories)
        .values(subCatValues)
        .onConflictDoNothing({ target: categories.slug })
        .returning();

    console.log(`  ✓ Created ${insertedSubs.length} subcategories`);

    return [...insertedCategories, ...insertedSubs];
};

// Allow running directly
if (import.meta.main) {
    seedCategories()
        .then(() => {
            console.log("Categories seeded successfully!");
            process.exit(0);
        })
        .catch((err) => {
            console.error("Failed to seed categories:", err);
            process.exit(1);
        });
}
