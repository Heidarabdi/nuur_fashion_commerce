import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function CartPage() {
  const [items, setItems] = useState([
    { id: 1, name: 'Premium Evening Dress', price: 599, quantity: 1, size: 'M', image: '/elegant-flowing-dress.png' },
    { id: 2, name: 'Silk Blouse', price: 299, quantity: 2, size: 'S', image: '/elegant-silk-blouse.png' },
  ])

  const removeItem = (id: number) => setItems(items.filter((item) => item.id !== id))
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity > 0) setItems(items.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 200 ? 0 : 20
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen pt-10">
      <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl font-bold mb-12">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {items.length > 0 ? (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-border">
                      <img src={item.image || '/placeholder.svg'} alt={item.name} className="w-24 h-24 object-cover rounded-lg bg-secondary" />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.name}</h3>
                        <p className="text-sm text-foreground/60 mb-3">Size: {item.size}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-border rounded-md">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-secondary">
                              −
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-secondary">
                              +
                            </button>
                          </div>
                          <p className="font-semibold">${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="p-2 hover:bg-secondary rounded-md transition-colors" aria-label="Remove item">
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-foreground/60 mb-4">Your cart is empty</p>
                  <Link to="/shop" className="text-accent hover:underline">
                    Continue Shopping
                  </Link>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="lg:col-span-1">
                <div className="bg-secondary rounded-lg p-6 sticky top-24">
                  <h2 className="font-serif text-2xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${tax}</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-accent">${total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Link
                    to="/checkout"
                    className="w-full block bg-primary text-primary-foreground py-3 rounded-md font-semibold text-center hover:bg-primary/90 transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    to="/shop"
                    className="w-full block mt-3 border border-border py-3 rounded-md font-semibold text-center hover:bg-background transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
