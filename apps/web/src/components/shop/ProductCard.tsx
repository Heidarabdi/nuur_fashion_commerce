import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Heart } from 'lucide-react'

interface ProductCardProps {
    product: any
    viewMode: 'grid' | 'list'
    isWishlisted: boolean
    onToggleWishlist: () => void
}

export function ProductCard({
    product,
    viewMode,
    isWishlisted,
    onToggleWishlist,
}: ProductCardProps) {
    const [isAnimating, setIsAnimating] = useState(false)

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsAnimating(true)
        onToggleWishlist()
        setTimeout(() => setIsAnimating(false), 300)
    }

    if (viewMode === 'list') {
        return (
            <div className="flex gap-6 p-4 bg-card border border-border rounded-lg hover:border-accent/50 transition-colors">
                <Link to="/product/$id" params={{ id: product.id }} className="shrink-0">
                    <div className="w-40 h-40 bg-secondary rounded-lg overflow-hidden">
                        {product.images?.[0] ? (
                            <img
                                src={product.images[0].url || '/placeholder.svg'}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-foreground/40">
                                No image
                            </div>
                        )}
                    </div>
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <Link to="/product/$id" params={{ id: product.id }}>
                            <h3 className="font-medium text-lg hover:text-accent transition-colors">{product.name}</h3>
                        </Link>
                        <p className="text-sm text-foreground/60 mt-1">{product.brand?.name || 'Designer Studio'}</p>
                        <p className="text-sm text-foreground/60 mt-2 line-clamp-2">{product.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <p className="font-semibold text-lg text-accent">${product.price}</p>
                        <button
                            onClick={handleWishlistClick}
                            className={`p-2.5 rounded-full border-2 transition-all duration-200 ${isWishlisted
                                    ? 'bg-red-50 border-red-500 text-red-500 dark:bg-red-500/10'
                                    : 'border-border hover:border-red-300 hover:text-red-400'
                                } ${isAnimating ? 'scale-125' : 'scale-100'}`}
                        >
                            <Heart
                                size={20}
                                fill={isWishlisted ? 'currentColor' : 'none'}
                                className={`transition-transform duration-200 ${isAnimating ? 'scale-110' : ''}`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Grid view
    return (
        <Link to="/product/$id" params={{ id: product.id }} className="group block relative">
            <div className="bg-secondary rounded-lg overflow-hidden h-80 mb-4 relative">
                {product.images?.[0] ? (
                    <img
                        src={product.images[0].url || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-foreground/40">
                        No image
                    </div>
                )}
                {product.isNew && (
                    <span className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 text-xs font-semibold rounded-full">
                        NEW
                    </span>
                )}

                {/* Wishlist button - always visible */}
                <button
                    onClick={handleWishlistClick}
                    className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-sm border-2 shadow-lg transition-all duration-200 ${isWishlisted
                            ? 'bg-red-500 border-red-500 text-white'
                            : 'bg-white/90 dark:bg-black/50 border-white/50 dark:border-white/20 text-gray-600 dark:text-gray-300 hover:text-red-500 hover:border-red-300'
                        } ${isAnimating ? 'scale-125' : 'scale-100 hover:scale-110'}`}
                >
                    <Heart
                        size={18}
                        fill={isWishlisted ? 'currentColor' : 'none'}
                        className={`transition-transform duration-200 ${isAnimating ? 'scale-110' : ''}`}
                    />
                </button>
            </div>
            <h3 className="font-medium mb-1 group-hover:text-accent transition-colors line-clamp-1">{product.name}</h3>
            <p className="text-sm text-foreground/60 mb-2">{product.brand?.name || 'Designer Studio'}</p>
            <p className="font-semibold text-accent">${product.price}</p>
        </Link>
    )
}
