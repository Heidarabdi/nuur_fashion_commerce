import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/collections')({
  component: CollectionsPage,
})

// Mock collections data - in production this would come from API
const collections = [
  {
    id: '1',
    name: 'Winter Essentials',
    slug: 'winter-essentials',
    description: 'Stay warm in style with our cozy winter collection',
    image: '/placeholder.svg',
    itemCount: 48,
  },
  {
    id: '2',
    name: 'Minimalist Edit',
    slug: 'minimalist-edit',
    description: 'Clean lines and timeless pieces for the modern wardrobe',
    image: '/placeholder.svg',
    itemCount: 32,
  },
  {
    id: '3',
    name: 'Evening Glamour',
    slug: 'evening-glamour',
    description: 'Make an entrance with our stunning evening wear',
    image: '/placeholder.svg',
    itemCount: 24,
  },
  {
    id: '4',
    name: 'Sustainable Style',
    slug: 'sustainable-style',
    description: 'Eco-conscious fashion that doesn\'t compromise on style',
    image: '/placeholder.svg',
    itemCount: 56,
  },
  {
    id: '5',
    name: 'Office Edit',
    slug: 'office-edit',
    description: 'Professional pieces for the modern workplace',
    image: '/placeholder.svg',
    itemCount: 42,
  },
  {
    id: '6',
    name: 'Weekend Casual',
    slug: 'weekend-casual',
    description: 'Relaxed fits for your days off',
    image: '/placeholder.svg',
    itemCount: 38,
  },
]

function CollectionsPage() {
  return (
    <div className="min-h-screen pt-10">
      <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Our Collections</h1>
            <p className="text-foreground/70 text-lg">
              Discover our carefully curated collections, each telling a unique story through fashion.
            </p>
          </div>

          {/* Featured Collection */}
          <div className="relative rounded-3xl overflow-hidden mb-12 group">
            <div className="aspect-21/9 bg-linear-to-br from-primary/20 to-primary/40" />
            <div className="absolute inset-0 bg-linear-to-r from-background/90 via-background/50 to-transparent flex items-center">
              <div className="p-8 md:p-12 max-w-xl">
                <span className="text-primary font-medium mb-2 block">Featured Collection</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">New Arrivals 2025</h2>
                <p className="text-foreground/70 mb-6">
                  Be the first to discover our latest additions. Fresh styles, trending pieces, and exclusive drops.
                </p>
                <Link
                  to="/shop"
                  search={{ category: 'new-arrivals' }}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Collections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                to="/shop"
                search={{ category: collection.slug }}
                className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-colors"
              >
                {/* Image */}
                <div className="aspect-4/3 bg-linear-to-br from-secondary to-secondary/50 overflow-hidden">
                  <div className="w-full h-full bg-linear-to-br from-primary/10 to-primary/30 group-hover:scale-105 transition-transform duration-500" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {collection.name}
                  </h3>
                  <p className="text-foreground/60 text-sm mb-4 line-clamp-2">
                    {collection.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/50">{collection.itemCount} items</span>
                    <span className="flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
                      Explore
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
