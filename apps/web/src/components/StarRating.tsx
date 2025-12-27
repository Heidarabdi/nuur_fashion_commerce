import { Star } from 'lucide-react'

interface StarRatingProps {
    rating: number
    onRatingChange?: (rating: number) => void
    interactive?: boolean
    size?: number
}

export function StarRating({ rating, onRatingChange, interactive = false, size = 20 }: StarRatingProps) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => interactive && onRatingChange?.(star)}
                    className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
                    disabled={!interactive}
                >
                    <Star
                        size={size}
                        className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-foreground/30'}
                    />
                </button>
            ))}
        </div>
    )
}
