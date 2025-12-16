import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Heart, Share2, ChevronLeft, ChevronRight, Send } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/product/$id')({
  component: ProductPage,
})

function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'Sarah M.',
      rating: 5,
      date: '2 weeks ago',
      title: 'Absolutely stunning!',
      text: 'This dress exceeded my expectations. The quality is exceptional and it fits perfectly. I received so many compliments!',
    },
    {
      id: 2,
      author: 'Jessica L.',
      rating: 5,
      date: '1 month ago',
      title: 'Perfect for my wedding',
      text: 'Elegant, comfortable, and beautifully made. The fabric drapes wonderfully and the attention to detail is impressive.',
    },
    {
      id: 3,
      author: 'Emma R.',
      rating: 4,
      date: '1 month ago',
      title: 'Great quality, runs small',
      text: "Love the dress but it runs a bit small. Sized up one size and it's perfect. Would definitely recommend!",
    },
  ])

  const images = ['/fashion-product-front.png', '/fashion-product-side.jpg', '/fashion-product-back.png', '/fashion-product-detail.jpg']
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  const handleSubmitReview = () => {
    if (rating > 0 && reviewText.trim()) {
      const newReview = {
        id: reviews.length + 1,
        author: 'You',
        rating,
        date: 'Just now',
        title: '',
        text: reviewText,
      }
      setReviews([newReview, ...reviews])
      setRating(0)
      setReviewText('')
    }
  }

  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '5.0'

  const recommendedProducts = [
    { id: 1, name: 'Silk Evening Wrap', price: '$299', image: '/luxury-silk-evening-wrap.jpg', rating: 4.8 },
    { id: 2, name: 'Classic Black Heels', price: '$399', image: '/luxury-black-heels.jpg', rating: 4.9 },
    { id: 3, name: 'Pearl Necklace', price: '$449', image: '/luxury-pearl-necklace.jpg', rating: 5.0 },
    { id: 4, name: 'Diamond Earrings', price: '$599', image: '/luxury-diamond-earrings.jpg', rating: 4.7 },
  ]

  return (
    <div className="min-h-screen pt-10">
      <div className="pt-18 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-accent font-medium tracking-widest uppercase mb-4 text-sm">New Collection 2025</p>

          <div className="text-sm text-foreground/60 mb-8">
            <Link to="/shop" className="hover:text-primary">
              Shop
            </Link>
            <span className="mx-2">/</span>
            <span>Premium Evening Dress</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="bg-secondary rounded-lg overflow-hidden h-96 md:h-full relative">
                <img src={images[selectedImage] || '/placeholder.svg'} alt="Product" className="w-full h-full object-cover" />
                <button
                  onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full hover:bg-background"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full hover:bg-background"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`rounded-lg overflow-hidden h-20 border-2 transition-colors ${selectedImage === i ? 'border-primary' : 'border-transparent'}`}
                  >
                    <img src={image || '/placeholder.svg'} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h1 className="font-serif text-4xl font-bold mb-2">Premium Evening Dress</h1>
              <p className="text-foreground/60 mb-6">by Luxury Brand Studio</p>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-foreground/60">(124 reviews)</span>
              </div>

              <div className="mb-8 pb-8 border-b border-border">
                <p className="font-serif text-3xl font-bold text-accent">$599</p>
                <p className="text-sm text-foreground/60 mt-2">Free shipping on orders over $200</p>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold mb-4">Select Size</h3>
                <div className="grid grid-cols-3 gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 border-2 rounded-md font-medium transition-colors ${selectedSize === size ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button className="text-sm text-accent hover:underline mt-4">Size Guide</button>
              </div>

              <div className="mb-8 pb-8 border-b border-border">
                <h3 className="font-semibold mb-4">Quantity</h3>
                <div className="flex items-center gap-4 w-max">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border border-border rounded-md hover:bg-secondary">
                    −
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 border border-border rounded-md hover:bg-secondary">
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <button className="w-full bg-primary text-primary-foreground py-4 rounded-md font-semibold hover:bg-primary/90 transition-colors">
                  Add to Cart
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`flex-1 py-3 border-2 border-border rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${isWishlisted ? 'bg-accent border-accent text-accent-foreground' : 'hover:bg-secondary'}`}
                  >
                    <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                    Wishlist
                  </button>
                  <button className="flex-1 py-3 border-2 border-border rounded-md font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2">
                    <Share2 size={20} />
                    Share
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-foreground/70 leading-relaxed">
                    An elegant evening dress crafted from premium silk blend fabric. Features a timeless silhouette with intricate detailing and a flowing design that captures movement beautifully.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Details</h3>
                  <ul className="text-sm text-foreground/70 space-y-2">
                    <li>Fabric: 95% Silk, 5% Elastane</li>
                    <li>Care: Dry clean only</li>
                    <li>Made in Italy</li>
                    <li>Model height: 5'10" wearing size S</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-16 border-t border-border">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <h2 className="font-serif text-2xl font-bold mb-8">Customer Reviews</h2>
                <div className="bg-secondary rounded-lg p-8">
                  <div className="mb-4">
                    <p className="font-serif text-4xl font-bold mb-2">{averageRating}</p>
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.round(Number(averageRating)) ? 'text-lg' : 'text-lg text-foreground/20'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-foreground/60">{reviews.length} verified purchases</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                <div className="border border-border rounded-lg p-8">
                  <h3 className="font-semibold text-lg mb-6">Share Your Review</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-medium mb-3">Your Rating</p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="text-3xl transition-colors hover:text-accent"
                            style={{ color: star <= rating ? '#d4af37' : '#e8e6e3' }}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Your Review</label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your thoughts about this product..."
                        className="w-full p-3 border border-border rounded-md bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={4}
                      />
                    </div>
                    <button
                      onClick={handleSubmitReview}
                      disabled={rating === 0 || !reviewText.trim()}
                      className="w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Send size={18} />
                      Submit Review
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-semibold text-lg">All Reviews</h3>
                  {reviews.map((review) => (
                    <div key={review.id} className="pb-6 border-b border-border last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium">{review.author}</p>
                          <p className="text-sm text-foreground/60">{review.date}</p>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-sm' : 'text-sm text-foreground/20'}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      {review.title && <p className="font-medium mb-2">{review.title}</p>}
                      <p className="text-foreground/70 leading-relaxed">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-16 border-t border-border">
            <h2 className="font-serif text-3xl font-bold mb-12">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommendedProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group">
                  <div className="bg-secondary rounded-lg overflow-hidden mb-4 h-64 relative">
                    <img
                      src={product.image || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button className="absolute top-3 right-3 bg-background/80 p-2 rounded-full hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart size={18} />
                    </button>
                  </div>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="font-serif text-lg font-bold text-accent">{product.price}</p>
                    <div className="flex gap-0.5">
                      <span className="text-sm">★</span>
                      <span className="text-sm text-foreground/60">{product.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
