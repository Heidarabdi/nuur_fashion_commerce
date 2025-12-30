import { db } from "../index";
import { brands } from "../schema";

const brandData = [
    { name: "Nuur Fashion", slug: "nuur-fashion", description: "Our flagship brand", website: "https://nuur.com" },
    { name: "Urban Style", slug: "urban-style", description: "Street wear and casual fashion", website: null },
    { name: "Elegance", slug: "elegance", description: "Premium formal wear", website: null },
    { name: "Active Wear", slug: "active-wear", description: "Sports and fitness apparel", website: null },
    { name: "Cozy Home", slug: "cozy-home", description: "Comfortable loungewear", website: null },
];

export const seedBrands = async () => {
    console.log("  Creating brands...");

    const insertedBrands = await db.insert(brands)
        .values(brandData.map(brand => ({
            name: brand.name,
            slug: brand.slug,
            description: brand.description,
            website: brand.website,
            isActive: true,
        })))
        .onConflictDoNothing({ target: brands.slug })
        .returning();

    console.log(`  ✓ Created ${insertedBrands.length} brands`);

    return insertedBrands;
};

// Allow running directly
if (import.meta.main) {
    seedBrands()
        .then(() => {
            console.log("Brands seeded successfully!");
            process.exit(0);
        })
        .catch((err) => {
            console.error("Failed to seed brands:", err);
            process.exit(1);
        });
}
