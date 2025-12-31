import { createFileRoute, Link } from '@tanstack/react-router'
import { Sparkles, ArrowRight } from 'lucide-react'
import { useProducts, useWishlistItems, useToggleWishlist } from '@nuur-fashion-commerce/api'
import { toast } from 'sonner'
import { authClient } from '../lib/auth-client'
import { FeaturedProductCard } from '../components/shop'

export const Route = createFileRoute('/new-arrivals')({
    component: NewArrivalsPage,
})

function NewArrivalsPage() {
    const { data: session } = authClient.useSession()

    // Fetch newest products
    const { data: productsData, isLoading } = useProducts({ sortBy: 'newest', limit: 20 })
    const { data: wishlistData } = useWishlistItems()
    const toggleWishlist = useToggleWishlist()

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

    return (
        <div className="min-h-screen pt-10">
            <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Hero Banner */}
                    <div className="relative overflow-hidden rounded-3xl mb-12 bg-linear-to-r from-accent/20 via-primary/10 to-accent/20">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
                        <div className="relative px-8 py-16 md:px-12 md:py-20 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full mb-6">
                                <Sparkles className="w-5 h-5 text-accent" />
                                <span className="text-sm font-medium text-accent">Just Dropped</span>
                            </div>
                            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
                                New Arrivals
                            </h1>
                            <p className="text-foreground/70 text-lg md:text-xl max-w-2xl mx-auto">
                                Discover the latest additions to our collection. Fresh styles, trending pieces, and exclusive drops.
                            </p>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {isLoading ? (
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
                        <div className="text-center py-16">
                            <p className="text-foreground/60 mb-4">No new arrivals yet</p>
                            <Link
                                to="/shop"
                                className="inline-flex items-center gap-2 text-accent hover:underline"
                            >
                                Browse all products
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    )}

                    {/* View All Link */}
                    {products.length > 0 && (
                        <div className="text-center mt-12">
                            <Link
                                to="/shop"
                                search={{ sortBy: 'newest' }}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
                            >
                                View All Products
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
