import { Link, createFileRoute } from '@tanstack/react-router'
import { Tag, Timer, Percent } from 'lucide-react'
import { useProducts } from '@nuur-fashion-commerce/api'

export const Route = createFileRoute('/sale')({
  component: SalePage,
})

function SalePage() {
  const { data: productsData, isLoading } = useProducts()

  // Filter products that have a compareAtPrice greater than price (on sale)
  const allProducts = productsData?.data || productsData || []
  const saleProducts = allProducts.filter((product: any) =>
    product.compareAtPrice && product.compareAtPrice > product.price
  )

  const calculateDiscount = (price: number, comparePrice: number) => {
    return Math.round(((comparePrice - price) / comparePrice) * 100)
  }

  return (
    <div className="min-h-screen pt-10">
      {/* Hero Banner */}
      <section className="bg-linear-to-r from-rose-500/10 via-primary/10 to-amber-500/10 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Timer className="w-4 h-4" />
            Limited Time Offer
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            Season Sale
          </h1>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto mb-8">
            Enjoy up to 50% off on selected items. Don't miss out on our biggest sale of the season!
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-card px-6 py-3 rounded-full border border-border">
              <Percent className="w-5 h-5 text-primary" />
              <span className="font-semibold">Up to 50% Off</span>
            </div>
            <div className="flex items-center gap-2 bg-card px-6 py-3 rounded-full border border-border">
              <Tag className="w-5 h-5 text-primary" />
              <span className="font-semibold">{saleProducts.length} Items on Sale</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sale Products */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-3/4 bg-secondary rounded-xl mb-3" />
                  <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                  <div className="h-4 bg-secondary rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : saleProducts.length === 0 ? (
            <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-border">
              <Tag className="w-16 h-16 mx-auto mb-6 text-foreground/30" />
              <h2 className="text-2xl font-serif font-semibold mb-3">No Sale Items Yet</h2>
              <p className="text-foreground/60 mb-8 max-w-md mx-auto">
                Check back soon for amazing deals and discounts!
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {saleProducts.map((product: any) => {
                const imageUrl = product.images?.[0]?.url || '/placeholder.svg'
                const discount = calculateDiscount(product.price, product.compareAtPrice)

                return (
                  <Link
                    key={product.id}
                    to="/product/$id"
                    params={{ id: product.id }}
                    className="group"
                  >
                    <div className="relative aspect-3/4 bg-secondary rounded-xl overflow-hidden mb-3">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Sale Badge */}
                      <div className="absolute top-3 left-3 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        -{discount}%
                      </div>
                    </div>
                    <h3 className="font-medium line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-rose-500">${product.price.toFixed(2)}</span>
                      <span className="text-sm text-foreground/50 line-through">
                        ${product.compareAtPrice.toFixed(2)}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
