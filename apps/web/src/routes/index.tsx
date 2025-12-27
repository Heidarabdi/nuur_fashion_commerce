import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useProducts } from '@nuur-fashion-commerce/api'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  // Fetch featured products
  const { data: productsData, isLoading } = useProducts({ isFeatured: true })
  const products = productsData?.data || productsData || []
  const featuredProducts = Array.isArray(products) ? products.slice(0, 4) : []

  // Newsletter form
  const newsletterForm = useForm({
    defaultValues: { email: '' },
    validators: {
      onChange: z.object({
        email: z.email('Please enter a valid email'),
      }),
    },
    onSubmit: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast.success('Subscribed!', {
        description: 'Thank you for joining our newsletter.',
      })
      newsletterForm.reset()
    },
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 md:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/luxury-fashion-hero-background-with-models.jpg')] bg-cover bg-center opacity-30 -z-10" />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/70 to-background/40 -z-10" />

        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-accent font-medium tracking-widest uppercase mb-4 text-sm">New Collection 2025</p>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight text-balance leading-snug sm:leading-tight">
                Timeless Elegance Meets Contemporary Style
              </h1>
              <p className="text-lg text-foreground/70 mb-6 max-w-xl leading-relaxed">
                Explore our carefully curated selection of premium fashion pieces from emerging and established designers. Each item is chosen for its craftsmanship and enduring appeal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300 group"
                >
                  Explore Collection
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#featured"
                  className="inline-flex items-center justify-center px-8 py-4 border border-primary text-primary font-medium hover:bg-primary/5 transition-colors"
                >
                  View Highlights
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <img
                  src="/luxury-fashion-model-wearing-elegant-designer-outf.jpg"
                  alt="Hero Fashion"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 md:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-4xl font-bold text-accent mb-3">500+</div>
              <p className="text-foreground/70">Premium designers curated</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-3">10K+</div>
              <p className="text-foreground/70">Satisfied customers worldwide</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-3">100%</div>
              <p className="text-foreground/70">Authentic quality guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold">Featured Collections</h2>
            <Link
              to="/shop"
              className="text-accent font-medium flex items-center hover:translate-x-1 transition-transform"
            >
              View All <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{ name: 'Evening Wear', image: '/elegant-evening-dresses-luxury-fashion.jpg' }, { name: 'Casual Chic', image: '/stylish-casual-outfits-contemporary-fashion.jpg' }, { name: 'Premium Accessories', image: '/luxury-fashion-accessories-bags-jewelry.jpg' }].map((category) => (
              <Link key={category.name} to="/shop" search={{ category: category.name.toLowerCase() }} className="group cursor-pointer">
                <div className="bg-secondary rounded-lg overflow-hidden h-80 mb-6 relative">
                  <img
                    src={category.image || '/placeholder.svg'}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                </div>
                <h3 className="font-serif text-2xl font-bold group-hover:text-accent transition-colors">{category.name}</h3>
                <p className="text-foreground/60 mt-2">Discover our selection</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="featured" className="py-20 px-4 md:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <div>
              <p className="text-accent font-medium tracking-widest uppercase mb-2 text-sm">Highlighted Pieces</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold">Bestsellers</h2>
            </div>
            <Link
              to="/shop"
              className="text-accent font-medium flex items-center hover:translate-x-1 transition-transform"
            >
              Shop All <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-secondary rounded-lg h-80 mb-6" />
                  <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                  <div className="h-4 bg-secondary rounded w-1/2 mb-3" />
                  <div className="h-6 bg-secondary rounded w-1/3" />
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product: any) => (
                <Link key={product.id} to="/product/$id" params={{ id: product.id }} className="group">
                  <div className="relative bg-background rounded-lg overflow-hidden h-80 mb-6">
                    <img
                      src={product.images?.[0]?.url || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.isNew && (
                      <div className="absolute top-4 right-4 bg-accent text-background px-3 py-1 rounded text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        New
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-lg mb-2 group-hover:text-accent transition-colors">{product.name}</h3>
                  <p className="text-sm text-foreground/60 mb-3">{product.brand?.name || 'Designer Studio'}</p>
                  <p className="font-serif text-xl font-bold text-accent">${product.price}</p>
                </Link>
              ))
            ) : (
              <div className="col-span-4 text-center py-12">
                <p className="text-foreground/60">No featured products available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 md:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Exclusive Member Benefits</h2>
          <p className="text-lg mb-8 text-primary-foreground/90">
            Join our community and receive early access to new collections, exclusive discounts, and personalized style recommendations.
          </p>
          <Link
            to="/auth/signup"
            className="inline-flex items-center px-8 py-4 bg-primary-foreground text-primary font-medium hover:bg-primary-foreground/90 transition-colors"
          >
            Sign Up Now
            <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-foreground/70 mb-8">
            Subscribe to our newsletter for style tips, new arrivals, and exclusive offers.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              newsletterForm.handleSubmit()
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <newsletterForm.Field name="email">
              {(field) => (
                <div className="flex-1">
                  <input
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter your email"
                    className={`w-full px-4 py-3 border rounded bg-background focus:outline-none focus:border-accent ${field.state.meta.errorMap['onChange'] ? 'border-destructive' : 'border-foreground/20'
                      }`}
                  />
                  {field.state.meta.errorMap['onChange'] && (
                    <p className="text-sm text-destructive mt-1 text-left">{String(field.state.meta.errorMap['onChange'])}</p>
                  )}
                </div>
              )}
            </newsletterForm.Field>
            <newsletterForm.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-accent text-background font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              )}
            </newsletterForm.Subscribe>
          </form>
        </div>
      </section>
    </div>
  )
}

