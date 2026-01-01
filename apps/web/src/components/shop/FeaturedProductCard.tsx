import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Heart, Eye } from 'lucide-react'

interface FeaturedProductCardProps {
    product: any
    isWishlisted: boolean
    onToggleWishlist: () => void
}

export function FeaturedProductCard({
    product,
    isWishlisted,
    onToggleWishlist,
}: FeaturedProductCardProps) {
    const [isAnimating, setIsAnimating] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsAnimating(true)
        onToggleWishlist()
        setTimeout(() => setIsAnimating(false), 300)
    }

    return (
        <Link
            to="/product/$id"
            params={{ id: product.id }}
            className="group block relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container - Taller aspect ratio */}
            <div className="relative overflow-hidden rounded-2xl bg-secondary aspect-3/4">
                {product.images?.[0] ? (
                    <img
                        src={product.images[0].url || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-foreground/40 bg-linear-to-br from-primary/10 to-accent/10">
                        <Eye size={48} className="opacity-30" />
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* NEW Badge */}
                <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent text-accent-foreground text-xs font-bold rounded-full shadow-lg animate-pulse">
                        ✨ NEW
                    </span>
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistClick}
                    className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md border-2 shadow-xl transition-all duration-300 ${isWishlisted
                        ? 'bg-primary border-primary text-primary-foreground scale-110'
                        : 'bg-card/80 border-border text-foreground/60 hover:bg-primary hover:border-primary hover:text-primary-foreground'
                        } ${isAnimating ? 'scale-125' : ''}`}
                >
                    <Heart
                        size={20}
                        fill={isWishlisted ? 'currentColor' : 'none'}
                        className={`transition-transform duration-300 ${isAnimating ? 'scale-125' : ''}`}
                    />
                </button>

                {/* Hover Info Overlay */}
                <div className={`absolute bottom-0 left-0 right-0 p-5 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <p className="text-white/80 text-sm font-medium mb-1">
                        {product.brand?.name || 'Designer Studio'}
                    </p>
                    <h3 className="text-white font-semibold text-lg line-clamp-1">
                        {product.name}
                    </h3>
                    <p className="text-accent text-xl font-bold mt-2">
                        ${product.price}
                    </p>
                </div>
            </div>

            {/* Static info below card (visible when not hovered) */}
            <div className={`mt-4 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                <p className="text-foreground/60 text-sm">
                    {product.brand?.name || 'Designer Studio'}
                </p>
                <h3 className="font-medium mt-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                </h3>
                <p className="text-primary font-bold mt-1">
                    ${product.price}
                </p>
            </div>
        </Link>
    )
}
