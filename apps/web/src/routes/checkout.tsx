import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})

function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const steps = ['Shipping', 'Payment', 'Review']

  return (
    <div className="min-h-screen">
      <div className="pt-24 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl font-bold mb-12">Checkout</h1>

          <div className="flex items-center gap-4 mb-12">
            {steps.map((stepName, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step > index + 1
                      ? 'bg-accent text-accent-foreground'
                      : step === index + 1
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground/60'
                  }`}
                >
                  {step > index + 1 ? '✓' : index + 1}
                </div>
                <span className={`text-sm font-medium ${step >= index + 1 ? 'text-foreground' : 'text-foreground/60'}`}>
                  {stepName}
                </span>
                {index < steps.length - 1 && <ChevronRight className="text-border" size={20} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="you@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="NY"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">ZIP Code</label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="10001"
                />
              </div>

              <div className="flex gap-4 pt-8">
                <Link
                  to="/cart"
                  className="flex-1 py-3 border border-border rounded-lg text-center font-semibold hover:bg-secondary transition-colors"
                >
                  Back to Cart
                </Link>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="4242 4242 4242 4242"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Expiry Date</label>
                  <input
                    type="text"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">CVC</label>
                  <input
                    type="text"
                    name="cardCVC"
                    value={formData.cardCVC}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="123"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-border rounded-lg text-center font-semibold hover:bg-secondary transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-secondary rounded-lg p-6">
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <p>2 items • $1,197</p>
                  <p>Shipping: Free</p>
                  <p>Tax: $120</p>
                  <p className="font-semibold text-lg text-accent border-t border-border pt-2 mt-2">Total: $1,317</p>
                </div>
              </div>

              <div className="bg-secondary rounded-lg p-6">
                <h3 className="font-semibold mb-4">Shipping Address</h3>
                <p className="text-sm text-foreground/70">
                  {formData.firstName} {formData.lastName}
                  <br />
                  {formData.address}
                  <br />
                  {formData.city}, {formData.state} {formData.zip}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-border rounded-lg text-center font-semibold hover:bg-secondary transition-colors"
                >
                  Edit Payment
                </button>
                <button className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
