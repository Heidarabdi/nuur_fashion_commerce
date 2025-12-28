import { Link, createFileRoute } from '@tanstack/react-router'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useWishlist, useRemoveFromWishlist, useAddToCart } from '@nuur-fashion-commerce/api'
import { toast } from 'sonner'

export const Route = createFileRoute('/wishlist')({
    component: WishlistPage,
})

function WishlistPage() {
    const { data: wishlistData, isLoading, error } = useWishlist()
    const removeFromWishlist = useRemoveFromWishlist()
    const addToCart = useAddToCart()

    const items = wishlistData?.items || wishlistData || []

    const handleRemove = async (productId: string) => {
        try {
            await removeFromWishlist.mutateAsync(productId)
            toast.success('Removed from wishlist')
        } catch (err) {
            toast.error('Failed to remove item')
        }
    }

    const handleAddToCart = async (productId: string) => {
        try {
            await addToCart.mutateAsync({ productId, quantity: 1 })
            await removeFromWishlist.mutateAsync(productId)
            toast.success('Added to cart!')
        } catch (err) {
            toast.error('Failed to add to cart')
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen pt-10">
                <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="animate-pulse">
                            <div className="h-10 bg-secondary rounded w-64 mb-12" />
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="aspect-3/4 bg-secondary rounded-xl" />
                                        <div className="h-4 bg-secondary rounded w-3/4" />
                                        <div className="h-4 bg-secondary rounded w-1/2" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen pt-10">
                <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                            <p className="text-destructive">Failed to load wishlist. Please try again.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-10">
            <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-12">
                        <Heart className="w-8 h-8 text-primary" />
                        <h1 className="font-serif text-4xl font-bold">My Wishlist</h1>
                        <span className="ml-2 text-foreground/60">({items.length} items)</span>
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-border">
                            <Heart className="w-16 h-16 mx-auto mb-6 text-foreground/30" />
                            <h2 className="text-2xl font-serif font-semibold mb-3">Your wishlist is empty</h2>
                            <p className="text-foreground/60 mb-8 max-w-md mx-auto">
                                Save your favorite items to buy them later or share them with friends.
                            </p>
                            <Link
                                to="/shop"
                                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {items.map((item: any) => {
                                const product = item.product || item
                                const imageUrl = product.images?.[0]?.url || '/placeholder.svg'
                                const price = product.price || 0
                                const comparePrice = product.compareAtPrice

                                return (
                                    <div
                                        key={product.id}
                                        className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        {/* Product Image */}
                                        <Link to="/product/$id" params={{ id: product.id }} className="block">
                                            <div className="aspect-3/4 bg-secondary overflow-hidden">
                                                <img
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        </Link>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemove(product.id)}
                                            disabled={removeFromWishlist.isPending}
                                            className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50"
                                            title="Remove from wishlist"
                                        >
                                            {removeFromWishlist.isPending ? (
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>

                                        {/* Product Info */}
                                        <div className="p-4 space-y-3">
                                            <Link to="/product/$id" params={{ id: product.id }}>
                                                <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
                                                    {product.name}
                                                </h3>
                                            </Link>

                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">${price.toFixed(2)}</span>
                                                {comparePrice && comparePrice > price && (
                                                    <span className="text-sm text-foreground/50 line-through">
                                                        ${comparePrice.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Add to Cart Button */}
                                            <button
                                                onClick={() => handleAddToCart(product.id)}
                                                disabled={addToCart.isPending}
                                                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
