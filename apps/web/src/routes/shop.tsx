import { useState, useMemo } from 'react'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { Grid3X3, List, SlidersHorizontal, X } from 'lucide-react'
import { useProducts, useCategories, useBrands, useWishlistItems, useToggleWishlist } from '@nuur-fashion-commerce/api'
import { z } from 'zod'
import { toast } from 'sonner'
import { authClient } from '../lib/auth-client'
import { FilterSection, ProductCard } from '../components/shop'

// Define search params schema for filters
const shopSearchSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['price-asc', 'price-desc', 'newest', 'popular', 'name-asc', 'name-desc']).optional(),
})

export const Route = createFileRoute('/shop')({
  validateSearch: shopSearchSchema,
  component: ShopPage,
})

function ShopPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/shop' })
  const { data: session } = authClient.useSession()

  // Local UI state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [showAllBrands, setShowAllBrands] = useState(false)
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    search.minPrice || 0,
    search.maxPrice || 1000,
  ])

  // Build filter object from URL search params
  const filters = useMemo(() => ({
    categoryId: search.category,
    brandId: search.brand,
    minPrice: search.minPrice,
    maxPrice: search.maxPrice,
    search: search.search,
    sortBy: search.sortBy,
  }), [search])

  // Fetch data
  const { data: productsData, isLoading, error } = useProducts(filters)
  const { data: categoriesData } = useCategories()
  const { data: brandsData } = useBrands()
  const { data: wishlistData } = useWishlistItems()
  const toggleWishlist = useToggleWishlist()

  const products = productsData?.data || productsData || []
  const categories = categoriesData?.data || categoriesData || []
  const brands = brandsData?.data || brandsData || []
  // Wishlist data is an object with .items array, not a direct array
  const wishlistItems = wishlistData?.items || wishlistData?.data?.items || []
  const wishlistIds = new Set(Array.isArray(wishlistItems) ? wishlistItems.map((item: any) => item.productId) : [])

  // Update URL with new filter values
  const updateFilters = (newFilters: Partial<typeof search>) => {
    navigate({
      to: '/shop',
      search: (prev) => ({ ...prev, ...newFilters }),
      replace: true,
    })
  }

  // Clear all filters
  const clearFilters = () => {
    navigate({ to: '/shop', search: {}, replace: true })
    setLocalPriceRange([0, 1000])
  }

  const hasActiveFilters = search.category || search.brand || search.minPrice || search.maxPrice || search.search

  // Handle wishlist toggle
  const handleToggleWishlist = (productId: string, isCurrentlyWishlisted: boolean) => {
    if (!session?.user) {
      toast.error('Please login to add items to wishlist')
      return
    }
    toggleWishlist.mutate(
      { productId, isCurrentlyWishlisted },
      {
        onSuccess: () => toast.success(isCurrentlyWishlisted ? 'Removed from wishlist' : 'Added to wishlist!'),
        onError: () => toast.error('Failed to update wishlist'),
      }
    )
  }

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 6)
  const displayedBrands = showAllBrands ? brands : brands.slice(0, 6)

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Popular' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
  ]

  // Filter sidebar content (shared between mobile and desktop)
  const FilterSidebar = () => (
    <div className="space-y-4">
      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="pb-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Active Filters</span>
            <button onClick={clearFilters} className="text-xs text-accent hover:underline">Clear All</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {search.category && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-full text-xs">
                {categories.find((c: any) => c.id === search.category)?.name || 'Category'}
                <button onClick={() => updateFilters({ category: undefined })}><X size={12} /></button>
              </span>
            )}
            {search.brand && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-full text-xs">
                {brands.find((b: any) => b.id === search.brand)?.name || 'Brand'}
                <button onClick={() => updateFilters({ brand: undefined })}><X size={12} /></button>
              </span>
            )}
            {(search.minPrice || search.maxPrice) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-full text-xs">
                ${search.minPrice || 0} - ${search.maxPrice || 1000}
                <button onClick={() => updateFilters({ minPrice: undefined, maxPrice: undefined })}><X size={12} /></button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <FilterSection title="Category" defaultOpen={true}>
        <div className="space-y-1">
          <button
            onClick={() => updateFilters({ category: undefined })}
            className={`block w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${!search.category ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary'}`}
          >
            All Categories
          </button>
          {displayedCategories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => updateFilters({ category: cat.id })}
              className={`block w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${search.category === cat.id ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary'}`}
            >
              {cat.name}
            </button>
          ))}
          {categories.length > 6 && (
            <button onClick={() => setShowAllCategories(!showAllCategories)} className="text-xs text-accent hover:underline mt-2 px-3">
              {showAllCategories ? 'Show Less' : `Show All (${categories.length})`}
            </button>
          )}
        </div>
      </FilterSection>

      {/* Brand Filter */}
      <FilterSection title="Brand" defaultOpen={false}>
        <div className="space-y-1">
          <button
            onClick={() => updateFilters({ brand: undefined })}
            className={`block w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${!search.brand ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary'}`}
          >
            All Brands
          </button>
          {displayedBrands.map((brand: any) => (
            <button
              key={brand.id}
              onClick={() => updateFilters({ brand: brand.id })}
              className={`block w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${search.brand === brand.id ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary'}`}
            >
              {brand.name}
            </button>
          ))}
          {brands.length > 6 && (
            <button onClick={() => setShowAllBrands(!showAllBrands)} className="text-xs text-accent hover:underline mt-2 px-3">
              {showAllBrands ? 'Show Less' : `Show All (${brands.length})`}
            </button>
          )}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection title="Price Range" defaultOpen={true}>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-foreground/60 mb-1 block">Min</label>
              <input
                type="number"
                value={localPriceRange[0]}
                onChange={(e) => setLocalPriceRange([parseInt(e.target.value) || 0, localPriceRange[1]])}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-sm"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-foreground/60 mb-1 block">Max</label>
              <input
                type="number"
                value={localPriceRange[1]}
                onChange={(e) => setLocalPriceRange([localPriceRange[0], parseInt(e.target.value) || 1000])}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-sm"
                placeholder="1000"
              />
            </div>
          </div>
          <button
            onClick={() => updateFilters({ minPrice: localPriceRange[0], maxPrice: localPriceRange[1] })}
            className="w-full py-2 bg-secondary hover:bg-secondary/80 rounded-md text-sm font-medium transition-colors"
          >
            Apply Price Filter
          </button>
        </div>
      </FilterSection>
    </div>
  )

  return (
    <div className="min-h-screen pt-10">
      <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold mb-2">Shop</h1>
            <p className="text-foreground/60">Browse our complete collection of curated pieces</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-destructive">Failed to load products. Please try again.</p>
            </div>
          )}

          {/* Mobile filter button */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-md text-sm font-medium"
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasActiveFilters && <span className="w-2 h-2 bg-accent rounded-full" />}
            </button>
          </div>

          {/* Mobile filters drawer */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
              <div className="fixed inset-y-0 left-0 w-80 bg-background border-r border-border p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-lg">Filters</h2>
                  <button onClick={() => setMobileFiltersOpen(false)}><X size={20} /></button>
                </div>
                <FilterSidebar />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block md:col-span-1">
              <div className="sticky top-24"><FilterSidebar /></div>
            </aside>

            {/* Products Grid */}
            <div className="md:col-span-3">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
                <p className="text-sm text-foreground/60">
                  {isLoading ? 'Loading...' : `Showing ${Array.isArray(products) ? products.length : 0} products`}
                </p>

                <div className="flex items-center gap-4">
                  <select
                    value={search.sortBy || 'newest'}
                    onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
                    className="px-3 py-2 bg-secondary border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>

                  <div className="flex border border-border rounded-md overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary'}`}
                    >
                      <Grid3X3 size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary'}`}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products */}
              {isLoading ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-secondary rounded-lg h-80 mb-4" />
                      <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                      <div className="h-4 bg-secondary rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : Array.isArray(products) && products.length > 0 ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {products.map((product: any) => {
                    const isWishlisted = wishlistIds.has(product.id)
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        viewMode={viewMode}
                        isWishlisted={isWishlisted}
                        onToggleWishlist={() => handleToggleWishlist(product.id, isWishlisted)}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-foreground/60 mb-4">No products found</p>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-accent hover:underline text-sm">Clear all filters</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
