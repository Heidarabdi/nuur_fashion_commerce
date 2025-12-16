import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/shop')({
  component: ShopPage,
})

function ShopPage() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'dresses', 'outerwear', 'accessories', 'shoes']

  return (
    <div className="min-h-screen pt-10">
      <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="font-serif text-4xl font-bold mb-4">Shop</h1>
            <p className="text-foreground/60">Browse our complete collection of curated pieces</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside className="md:col-span-1">
              <div className="sticky top-24 space-y-8">
                <div>
                  <h3 className="font-semibold mb-4">Category</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === cat ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary'}`}
                      >
                        <span className="capitalize text-sm">{cat}</span>
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
                <p className="text-sm text-foreground/60">Showing 24 results</p>
                <button className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors">
                  Sort By <ChevronDown size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Link key={i} to={`/product/${i + 1}`} className="group">
                    <div className="bg-secondary rounded-lg overflow-hidden h-80 mb-4 relative">
                      <img
                        src={`/stylish-scarf.png?height=400&width=300&query=fashion item ${i + 1}`}
                        alt={`Product ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {i % 3 === 0 && (
                        <span className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 text-xs font-semibold rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium mb-2 group-hover:text-accent transition-colors">Product Name</h3>
                    <p className="text-sm text-foreground/60 mb-2">Designer Studio</p>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-accent">$299</p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, star) => (
                          <span key={star} className="text-xs">
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
