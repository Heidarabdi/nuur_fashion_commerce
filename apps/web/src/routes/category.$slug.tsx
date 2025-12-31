import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { useProducts, useCategories, useWishlistItems, useToggleWishlist } from '@nuur-fashion-commerce/api'
import { toast } from 'sonner'
import { authClient } from '../lib/auth-client'
import { FeaturedProductCard } from '../components/shop'

export const Route = createFileRoute('/category/$slug')({
    component: CategoryPage,
})

function CategoryPage() {
    const { slug } = useParams({ from: '/category/$slug' })
    const { data: session } = authClient.useSession()

    // Fetch all categories to find current one and its subcategories
    const { data: categoriesData, isLoading: categoriesLoading } = useCategories()
    const { data: wishlistData } = useWishlistItems()
    const toggleWishlist = useToggleWishlist()

    const allCategories = categoriesData?.data || categoriesData || []

    // Find current category
    const category = allCategories.find((c: any) => c.slug === slug)

    // Find subcategories
    const subcategories = allCategories.filter((c: any) => c.parentId === category?.id)

    // Fetch products for this category
    const { data: productsData, isLoading: productsLoading } = useProducts({
        categoryId: category?.id,
        limit: 8
    })

    const products = productsData?.data || productsData || []
    const wishlistItems = wishlistData?.items || wishlistData?.data?.items || []
    const wishlistIds = new Set(Array.isArray(wishlistItems) ? wishlistItems.map((item: any) => item.productId) : [])

    const handleToggleWishlist = (productId: string, isCurrentlyWishlisted: boolean) => {
        if (!session?.user) {
            toast.error('Please login to add items to wishlist')
            return
        }
        toggleWishlist.mutate(
            { productId, isCurrentlyWishlisted },
            {
                onSuccess: () => toast.success(isCurrentlyWishlisted ? 'Removed from wishlist' : 'Added to wishlist!'),
                onError: () => toast.error('Failed to update wishlist'),
            }
        )
    }

    // Hero backgrounds for each category
    const heroStyles: Record<string, string> = {
        men: 'from-slate-800/20 via-blue-900/10 to-slate-800/20',
        women: 'from-rose-800/20 via-pink-900/10 to-rose-800/20',
        kids: 'from-amber-800/20 via-orange-900/10 to-amber-800/20',
        accessories: 'from-purple-800/20 via-indigo-900/10 to-purple-800/20',
    }

    if (categoriesLoading) {
        return (
            <div className="min-h-screen pt-10 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
            </div>
        )
    }

    if (!category) {
        return (
            <div className="min-h-screen pt-10">
                <div className="pt-14 pb-16 px-4 text-center">
                    <h1 className="text-2xl font-bold mb-4">Category not found</h1>
                    <Link to="/shop" className="text-accent hover:underline">
                        Browse all products
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-10">
            <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Hero Banner */}
                    <div className={`relative overflow-hidden rounded-3xl mb-12 bg-linear-to-r ${heroStyles[slug] || 'from-primary/20 to-accent/20'}`}>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
                        <div className="relative px-8 py-16 md:px-12 md:py-24">
                            <nav className="flex items-center gap-2 text-sm text-foreground/60 mb-4">
                                <Link to="/" className="hover:text-foreground">Home</Link>
                                <ChevronRight size={14} />
                                <span className="text-foreground">{category.name}</span>
                            </nav>
                            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
                                {category.name}'s Collection
                            </h1>
                            <p className="text-foreground/70 text-lg max-w-2xl">
                                {category.description || `Discover our curated selection for ${category.name.toLowerCase()}.`}
                            </p>
                        </div>
                    </div>

                    {/* Subcategories */}
                    {subcategories.length > 0 && (
                        <section className="mb-16">
                            <h2 className="font-serif text-2xl font-semibold mb-6">Shop by Category</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {subcategories.map((subcat: any) => (
                                    <Link
                                        key={subcat.id}
                                        to="/shop"
                                        search={{ category: subcat.id }}
                                        className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-secondary to-secondary/50 p-6 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <h3 className="font-medium text-lg mb-1 group-hover:text-accent transition-colors">
                                            {subcat.name}
                                        </h3>
                                        <p className="text-sm text-foreground/60">{subcat.description}</p>
                                        <ArrowRight className="absolute bottom-4 right-4 w-5 h-5 text-foreground/30 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Featured Products */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-serif text-2xl font-semibold">Featured Products</h2>
                            <Link
                                to="/shop"
                                search={{ category: category.id }}
                                className="flex items-center gap-1 text-accent hover:underline text-sm font-medium"
                            >
                                View All
                                <ArrowRight size={14} />
                            </Link>
                        </div>

                        {productsLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="bg-secondary rounded-2xl aspect-3/4 mb-4" />
                                        <div className="h-4 bg-secondary rounded w-1/2 mb-2" />
                                        <div className="h-4 bg-secondary rounded w-3/4" />
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((product: any) => {
                                    const isWishlisted = wishlistIds.has(product.id)
                                    return (
                                        <FeaturedProductCard
                                            key={product.id}
                                            product={product}
                                            isWishlisted={isWishlisted}
                                            onToggleWishlist={() => handleToggleWishlist(product.id, isWishlisted)}
                                        />
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-secondary/30 rounded-2xl">
                                <p className="text-foreground/60 mb-4">No products in this category yet</p>
                                <Link
                                    to="/shop"
                                    className="inline-flex items-center gap-2 text-accent hover:underline"
                                >
                                    Browse all products
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* CTA */}
                    {products.length > 0 && (
                        <div className="text-center mt-12">
                            <Link
                                to="/shop"
                                search={{ category: category.id }}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
                            >
                                Shop All {category.name}
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
