import { createFileRoute } from '@tanstack/react-router'
import { Heart, Star, Truck, Shield } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-linear-to-br from-primary/5 to-primary/20">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-10" />
        <div className="relative text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Our Story</h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Since 2020, Nuur has been dedicated to bringing you carefully curated fashion that celebrates elegance, quality, and timeless style.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-foreground/70 mb-4 leading-relaxed">
                At Nuur, we believe that fashion is more than just clothing—it's a form of self-expression. Our mission is to empower individuals to express their unique style with confidence.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                We carefully source and curate pieces from around the world, ensuring each item meets our high standards for quality, design, and sustainability.
              </p>
            </div>
            <div className="aspect-square bg-linear-to-br from-secondary to-secondary/50 rounded-2xl" />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl font-bold text-center mb-16">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: 'Quality First',
                description: 'Every piece is crafted with attention to detail and premium materials.',
              },
              {
                icon: Star,
                title: 'Timeless Design',
                description: 'We curate pieces that transcend trends and remain stylish for years.',
              },
              {
                icon: Truck,
                title: 'Fast Delivery',
                description: 'Swift and reliable shipping to get your items to you quickly.',
              },
              {
                icon: Shield,
                title: 'Sustainability',
                description: 'Committed to ethical practices and environmental responsibility.',
              },
            ].map((value, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-foreground/60 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '50K+', label: 'Happy Customers' },
              { number: '200+', label: 'Premium Brands' },
              { number: '5K+', label: 'Products' },
              { number: '99%', label: 'Satisfaction Rate' },
            ].map((stat, index) => (
              <div key={index}>
                <p className="font-serif text-4xl font-bold text-primary mb-2">{stat.number}</p>
                <p className="text-foreground/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
