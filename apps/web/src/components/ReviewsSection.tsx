import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { User } from 'lucide-react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { getFieldError } from '../lib/form-utils'
import { useProductReviews, useCreateReview } from '@nuur-fashion-commerce/api'
import { authClient } from '../lib/auth-client'
import { StarRating } from './StarRating'

interface ReviewsSectionProps {
    productId: string
}

const reviewSchema = z.object({
    rating: z.coerce.number().min(1, 'Please select a rating').max(5),
    title: z.string(),
    content: z.string(),
})

export function ReviewsSection({ productId }: ReviewsSectionProps) {
    const { data: session } = authClient.useSession()
    const { data: reviewsData, isLoading } = useProductReviews(productId)
    const createReview = useCreateReview()

    const [showForm, setShowForm] = useState(false)

    const reviews = reviewsData || []
    const user = session?.user
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length
        : 0

    const form = useForm({
        defaultValues: {
            rating: 5,
            title: '',
            content: '',
        },
        validators: {
            onChange: reviewSchema as any,
        },
        onSubmit: async ({ value }) => {
            if (!user) return

            try {
                await createReview.mutateAsync({
                    productId,
                    rating: value.rating,
                    title: value.title,
                    content: value.content,
                })
                toast.success('Review submitted!', {
                    description: 'Thank you for your feedback.',
                })
                setShowForm(false)
                form.reset()
            } catch (err) {
                toast.error('Failed to submit review', {
                    description: 'Please try again later.',
                })
            }
        },
    })

    return (
        <div className="mt-16 pt-16 border-t border-border">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="font-serif text-2xl font-bold mb-2">Customer Reviews</h2>
                    <div className="flex items-center gap-3">
                        <StarRating rating={Math.round(averageRating)} />
                        <span className="text-foreground/60">
                            {averageRating.toFixed(1)} out of 5 ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                        </span>
                    </div>
                </div>
                {user && !showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity"
                    >
                        Write a Review
                    </button>
                )}
            </div>

            {/* Review Form */}
            {showForm && user && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="bg-secondary/30 rounded-xl p-6 mb-8 space-y-4"
                >
                    <h3 className="font-semibold text-lg mb-4">Write Your Review</h3>

                    <form.Field name="rating">
                        {(field) => (
                            <div>
                                <label className="block text-sm font-medium mb-2">Your Rating</label>
                                <StarRating
                                    rating={field.state.value}
                                    onRatingChange={(rating) => field.handleChange(rating)}
                                    interactive
                                />
                                {field.state.meta.errorMap['onChange'] && (
                                    <p className="text-sm text-destructive mt-1">
                                        {getFieldError(field.state.meta.errorMap['onChange'])}
                                    </p>
                                )}
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="title">
                        {(field) => (
                            <div>
                                <label className="block text-sm font-medium mb-2">Review Title (optional)</label>
                                <input
                                    type="text"
                                    value={field.state.value || ''}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Summarize your experience"
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="content">
                        {(field) => (
                            <div>
                                <label className="block text-sm font-medium mb-2">Your Review (optional)</label>
                                <textarea
                                    value={field.state.value || ''}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                    placeholder="Share your thoughts about this product..."
                                />
                            </div>
                        )}
                    </form.Field>

                    <div className="flex gap-3">
                        <form.Subscribe selector={(state) => state.isSubmitting}>
                            {(isSubmitting) => (
                                <button
                                    type="submit"
                                    disabled={isSubmitting || createReview.isPending}
                                    className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {isSubmitting || createReview.isPending ? 'Submitting...' : 'Submit Review'}
                                </button>
                            )}
                        </form.Subscribe>
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false)
                                form.reset()
                            }}
                            className="px-6 py-3 text-foreground/60 hover:text-foreground"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {!user && (
                <div className="bg-secondary/30 rounded-xl p-6 mb-8 text-center">
                    <p className="text-foreground/60 mb-4">Sign in to write a review</p>
                    <Link
                        to="/auth/login"
                        className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity"
                    >
                        Sign In
                    </Link>
                </div>
            )}

            {/* Reviews List */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse bg-secondary/30 rounded-xl p-6">
                            <div className="h-4 bg-secondary rounded w-32 mb-2" />
                            <div className="h-4 bg-secondary rounded w-48 mb-4" />
                            <div className="h-20 bg-secondary rounded" />
                        </div>
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-12 bg-secondary/20 rounded-xl">
                    <p className="text-foreground/60">No reviews yet. Be the first to review this product!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review: any) => (
                        <div key={review.id} className="bg-card rounded-xl border border-border p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{review.user?.name || 'Anonymous'}</p>
                                        <p className="text-sm text-foreground/50">
                                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <StarRating rating={review.rating} />
                            </div>
                            {review.title && <h4 className="font-semibold mb-2">{review.title}</h4>}
                            {review.content && <p className="text-foreground/70">{review.content}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
