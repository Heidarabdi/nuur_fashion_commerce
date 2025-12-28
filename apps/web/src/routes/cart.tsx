import { Link, createFileRoute } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useCart, useRemoveFromCart, useUpdateCartItem } from '@nuur-fashion-commerce/api'
import { toast } from 'sonner'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function CartPage() {
  const { data: cartData, isLoading, error } = useCart()
  const removeFromCart = useRemoveFromCart()
  const updateCartItem = useUpdateCartItem()

  const cart = cartData?.data || cartData
  const items = cart?.items || []

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart.mutateAsync(itemId)
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId)
      return
    }
    try {
      await updateCartItem.mutateAsync({ itemId, quantity })
    } catch (error) {
      toast.error('Failed to update quantity')
    }
  }

  const subtotal = items.reduce((sum: number, item: any) => {
    const price = item.product?.price || item.unitPrice || 0
    const qty = item.quantity || 1
    return sum + price * qty
  }, 0)
  const shipping = subtotal > 200 ? 0 : 20
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + shipping + tax

  if (isLoading) {
    return (
      <div className="min-h-screen pt-10">
        <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-secondary rounded w-64 mb-12" />
              <div className="h-64 bg-secondary rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-10">
        <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-destructive">Failed to load cart. Please try again.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-10">
      <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl font-bold mb-12">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {items.length > 0 ? (
                <div className="space-y-4">
                  {items.map((item: any) => {
                    const product = item.product || {}
                    const imageUrl = product.images?.[0]?.url || '/placeholder.svg'
                    const price = product.price || item.unitPrice || 0
                    const quantity = item.quantity || 1

                    return (
                      <div key={item.id} className="flex gap-4 pb-4 border-b border-border">
                        <img src={imageUrl} alt={product.name || 'Product'} className="w-24 h-24 object-cover rounded-lg bg-secondary" />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{product.name || 'Product'}</h3>
                          {item.variant && (
                            <p className="text-sm text-foreground/60 mb-3">
                              Size: {item.variant.size || 'N/A'}
                            </p>
                          )}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-border rounded-md">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, quantity - 1)}
                                disabled={updateCartItem.isPending}
                                className="w-8 h-8 flex items-center justify-center hover:bg-secondary disabled:opacity-50"
                              >
                                −
                              </button>
                              <span className="w-8 text-center text-sm">{quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, quantity + 1)}
                                disabled={updateCartItem.isPending}
                                className="w-8 h-8 flex items-center justify-center hover:bg-secondary disabled:opacity-50"
                              >
                                +
                              </button>
                            </div>
                            <p className="font-semibold">${(price * quantity).toLocaleString()}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removeFromCart.isPending}
                          className="p-2 hover:bg-secondary rounded-md transition-colors disabled:opacity-50"
                          aria-label="Remove item"
                        >
                          {removeFromCart.isPending ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <X size={20} />
                          )}
                        </button>
                      </div>
                    )
                  })}
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
