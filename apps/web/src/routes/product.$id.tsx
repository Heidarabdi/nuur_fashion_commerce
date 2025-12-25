import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useProduct, useAddToCart } from '@nuur-fashion-commerce/api'

export const Route = createFileRoute('/product/$id')({
  component: ProductPage,
})

function ProductPage() {
  const { id } = Route.useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const { data: productData, isLoading, error } = useProduct(id)
  const addToCart = useAddToCart()

  const product = productData?.data || productData
  const images = product?.images?.map((img: any) => img.url) || ['/placeholder.svg']
  const sizes = product?.variants?.map((v: any) => v.size).filter(Boolean) || ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size')
      return
    }
    try {
      await addToCart.mutateAsync({
        productId: id,
        quantity,
        variantId: product?.variants?.find((v: any) => v.size === selectedSize)?.id,
      })
      alert('Added to cart!')
    } catch (error) {
      alert('Failed to add to cart')
    }
  }


  if (isLoading) {
    return (
      <div className="min-h-screen pt-10 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-secondary rounded w-64 mb-4 mx-auto" />
          <div className="h-4 bg-secondary rounded w-48 mx-auto" />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/shop" className="text-accent hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

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
            <span>{product.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="bg-secondary rounded-lg overflow-hidden h-96 md:h-full relative">
                <img src={images[selectedImage] || '/placeholder.svg'} alt={product.name} className="w-full h-full object-cover" />
                {images.length > 1 && (
                  <>
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
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`rounded-lg overflow-hidden h-20 border-2 transition-colors ${selectedImage === i ? 'border-primary' : 'border-transparent'}`}
                    >
                      <img src={image || '/placeholder.svg'} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className="font-serif text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-foreground/60 mb-6">{product.brand?.name || 'Luxury Brand Studio'}</p>

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
                <p className="font-serif text-3xl font-bold text-accent">${product.price}</p>
                {product.compareAtPrice && (
                  <p className="text-sm text-foreground/60 line-through mt-1">${product.compareAtPrice}</p>
                )}
                <p className="text-sm text-foreground/60 mt-2">Free shipping on orders over $200</p>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold mb-4">Select Size</h3>
                <div className="grid grid-cols-3 gap-3">
                  {sizes.map((size: string) => (
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
                <button
                  onClick={handleAddToCart}
                  disabled={addToCart.isPending || !selectedSize}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
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
                    {product.description || 'An elegant piece crafted from premium materials. Features timeless design with attention to detail.'}
                  </p>
                </div>
                {product.shortDescription && (
                  <div>
                    <h3 className="font-semibold mb-2">Details</h3>
                    <p className="text-sm text-foreground/70">{product.shortDescription}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
