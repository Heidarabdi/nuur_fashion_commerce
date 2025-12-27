import { createFileRoute } from '@tanstack/react-router'
import { Truck, Globe, Clock, Package } from 'lucide-react'

export const Route = createFileRoute('/shipping')({
  component: ShippingPage,
})

function ShippingPage() {
  const shippingOptions = [
    {
      icon: Truck,
      name: 'Standard Shipping',
      time: '5-7 business days',
      price: '$9.99',
      description: 'Free on orders over $200',
    },
    {
      icon: Clock,
      name: 'Express Shipping',
      time: '2-3 business days',
      price: '$19.99',
      description: 'Priority handling and delivery',
    },
    {
      icon: Package,
      name: 'Next Day Delivery',
      time: '1 business day',
      price: '$29.99',
      description: 'Order by 2pm for next day',
    },
  ]

  return (
    <div className="min-h-screen pt-10">
      <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl font-bold mb-4">Shipping Information</h1>
          <p className="text-foreground/60 mb-12">Everything you need to know about our shipping options and policies.</p>

          {/* Shipping Options */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Shipping Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shippingOptions.map((option, index) => (
                <div key={index} className="bg-card rounded-xl border border-border p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <option.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{option.name}</h3>
                  <p className="text-primary font-medium mb-1">{option.price}</p>
                  <p className="text-sm text-foreground/60 mb-2">{option.time}</p>
                  <p className="text-xs text-foreground/50">{option.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* International Shipping */}
          <section className="mb-12 bg-card rounded-xl border border-border p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center shrink-0">
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">International Shipping</h2>
                <p className="text-foreground/70 leading-relaxed mb-4">
                  We ship to over 100 countries worldwide. International shipping rates and delivery times vary by location and are calculated at checkout.
                </p>
                <ul className="list-disc pl-6 text-foreground/70 space-y-2 text-sm">
                  <li>Delivery typically takes 7-21 business days</li>
                  <li>Customs duties and taxes may apply and are the customer's responsibility</li>
                  <li>Tracking available for all international shipments</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'How can I track my order?',
                  a: 'Once your order ships, you\'ll receive an email with a tracking number. You can also track your order in your account under "My Orders".',
                },
                {
                  q: 'What if my package is lost or damaged?',
                  a: 'Contact our customer service team immediately. We\'ll work with the carrier to locate your package or arrange a replacement.',
                },
                {
                  q: 'Do you offer free shipping?',
                  a: 'Yes! We offer free standard shipping on all orders over $200 within the continental United States.',
                },
                {
                  q: 'Can I change my shipping address after ordering?',
                  a: 'Contact us as soon as possible. We can update the address if the order hasn\'t shipped yet.',
                },
              ].map((faq, index) => (
                <div key={index} className="bg-secondary/30 rounded-lg p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-foreground/70 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
