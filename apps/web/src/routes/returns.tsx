import { createFileRoute, Link } from '@tanstack/react-router'
import { RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react'

export const Route = createFileRoute('/returns')({
  component: ReturnsPage,
})

function ReturnsPage() {
  return (
    <div className="min-h-screen pt-10">
      <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl font-bold mb-4">Returns & Exchanges</h1>
          <p className="text-foreground/60 mb-12">We want you to love your purchase. Here's our hassle-free return policy.</p>

          {/* Return Policy Highlights */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 text-center">
              <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">30-Day Returns</h3>
              <p className="text-sm text-foreground/60">Return within 30 days of delivery</p>
            </div>
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 text-center">
              <RotateCcw className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Free Exchanges</h3>
              <p className="text-sm text-foreground/60">Exchange for a different size or color</p>
            </div>
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 text-center">
              <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Easy Process</h3>
              <p className="text-sm text-foreground/60">Simple online return request</p>
            </div>
          </section>

          {/* Eligibility */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Return Eligibility</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Eligible for Return</h3>
                </div>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>• Items in original condition with tags attached</li>
                  <li>• Unworn, unwashed, and unaltered items</li>
                  <li>• Items in original packaging</li>
                  <li>• Purchases made within the last 30 days</li>
                </ul>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-destructive" />
                  <h3 className="font-semibold">Not Eligible</h3>
                </div>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>• Final sale items</li>
                  <li>• Swimwear and intimate apparel</li>
                  <li>• Personalized or customized items</li>
                  <li>• Items purchased more than 30 days ago</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How to Return */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">How to Return</h2>
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: 'Start Your Return',
                  description: 'Log into your account and go to "My Orders". Select the item you wish to return.',
                },
                {
                  step: 2,
                  title: 'Print Label',
                  description: 'Print the prepaid shipping label and return form provided.',
                },
                {
                  step: 3,
                  title: 'Pack & Ship',
                  description: 'Pack items securely in original packaging and drop off at any authorized carrier location.',
                },
                {
                  step: 4,
                  title: 'Receive Refund',
                  description: 'Once we receive and inspect your return, we\'ll process your refund within 5-7 business days.',
                },
              ].map((step) => (
                <div key={step.step} className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-foreground/70 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Refund Info */}
          <section className="bg-secondary/30 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-4">Refund Information</h2>
            <div className="space-y-4 text-foreground/70">
              <p>Refunds will be issued to the original payment method within 5-7 business days after we receive your return.</p>
              <p>Original shipping charges are non-refundable unless the return is due to our error or a defective item.</p>
              <p>For exchanges, the new item will be shipped once we receive your return.</p>
            </div>
          </section>

          {/* Contact */}
          <section className="text-center">
            <h2 className="text-xl font-semibold mb-2">Need Help?</h2>
            <p className="text-foreground/60 mb-4">Our customer service team is here to assist you.</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Contact Support
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
