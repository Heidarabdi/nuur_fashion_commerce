import { useState } from 'react'
import { Link, createFileRoute, useSearch } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import { useProducts, useCategories } from '@nuur-fashion-commerce/api'
import { z } from 'zod'

// Define search params schema for filters
const shopSearchSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sortBy: z.enum(['price-asc', 'price-desc', 'newest', 'popular']).optional(),
})

export const Route = createFileRoute('/shop')({
  validateSearch: shopSearchSchema,
  component: ShopPage,
})

function ShopPage() {
  const search = useSearch({ from: '/shop' })
  const [selectedCategory, setSelectedCategory] = useState(search.category || 'all')
  const [priceRange, setPriceRange] = useState<[number, number]>([
    search.minPrice || 0,
    search.maxPrice || 1000,
  ])

  // Fetch products with filters
  const { data: productsData, isLoading: productsLoading, error: productsError } = useProducts(search)
  const { data: categoriesData } = useCategories()

  const products = productsData?.data || productsData || []
  const categories = categoriesData?.data || categoriesData || []

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    // Update URL search params (would need router navigation)
  }

  return (
    <div className="min-h-screen pt-10">
      <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="font-serif text-4xl font-bold mb-4">Shop</h1>
            <p className="text-foreground/60">Browse our complete collection of curated pieces</p>
          </div>

          {productsError && (
            <div className="mb-8 p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-destructive">Failed to load products. Please try again.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside className="md:col-span-1">
              <div className="sticky top-24 space-y-8">
                <div>
                  <h3 className="font-semibold mb-4">Category</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === 'all' ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary'}`}
                    >
                      <span className="capitalize text-sm">All</span>
                    </button>
                    {categories.map((cat: any) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === cat.id ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary'}`}
                      >
                        <span className="capitalize text-sm">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Price</h3>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="mt-3 text-sm text-foreground/60">$0 - ${priceRange[1]}</div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Size</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button key={size} className="py-2 border border-border rounded-md hover:border-primary text-xs font-medium transition-colors">
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Color</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['Black', 'White', 'Beige', 'Navy', 'Gold', 'Grey'].map((color) => (
                      <button key={color} className="py-2 border border-border rounded-md hover:border-primary text-xs font-medium transition-colors">
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div className="md:col-span-3">
              <div className="flex justify-between items-center mb-8">
                <p className="text-sm text-foreground/60">
                  {productsLoading ? 'Loading...' : `Showing ${Array.isArray(products) ? products.length : 0} results`}
                </p>
                <button className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors">
                  Sort By <ChevronDown size={16} />
                </button>
              </div>

              {productsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-secondary rounded-lg h-80 mb-4" />
                      <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                      <div className="h-4 bg-secondary rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : Array.isArray(products) && products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product: any) => (
                    <Link key={product.id} to="/product/$id" params={{ id: product.id }} className="group">
                      <div className="bg-secondary rounded-lg overflow-hidden h-80 mb-4 relative">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0].url || '/placeholder.svg'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-secondary flex items-center justify-center">
                            <span className="text-foreground/40">No image</span>
                          </div>
                        )}
                        {product.isNew && (
                          <span className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 text-xs font-semibold rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium mb-2 group-hover:text-accent transition-colors">{product.name}</h3>
                      <p className="text-sm text-foreground/60 mb-2">
                        {product.brand?.name || 'Designer Studio'}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-accent">${product.price}</p>
                        {product.rating && (
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, star) => (
                              <span key={star} className="text-xs">
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-foreground/60">No products found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
