import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Loader2, Package, MapPin, CreditCard, User } from 'lucide-react'
import { AdminShell } from '../../../components/AdminShell'
import { useOrder, useUpdateOrderStatus } from '@nuur-fashion-commerce/api'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/orders/$id')({
  component: OrderDetailPage,
})

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

function OrderDetailPage() {
  const { id } = Route.useParams()
  const { data: order, isLoading, error } = useOrder(id)
  const updateStatus = useUpdateOrderStatus()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
      case 'processing':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      case 'shipped':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'pending':
        return 'bg-secondary text-muted-foreground'
      case 'cancelled':
        return 'bg-destructive/10 text-destructive'
      default:
        return 'bg-secondary text-muted-foreground'
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id, status: newStatus })
      toast.success('Order updated', { description: `Status changed to ${newStatus}` })
    } catch (err) {
      toast.error('Failed to update order', { description: (err as Error).message })
    }
  }

  if (isLoading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  if (error || !order) {
    return (
      <AdminShell>
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load order</p>
          <p className="text-muted-foreground text-sm mt-2">{error?.message || 'Order not found'}</p>
          <Link to="/admin/orders" className="text-primary hover:underline mt-4 inline-block">
            ← Back to Orders
          </Link>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            to="/admin/orders"
            className="p-2 hover:bg-secondary rounded-md transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <span className={`${getStatusClass(order.status)} px-4 py-2 rounded-full text-sm font-medium capitalize`}>
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 bg-card p-6 rounded-lg border border-border shadow-sm">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Package size={20} />
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                  {item.product?.images?.[0] && (
                    <img
                      src={item.product.images[0].url || item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.product?.name || 'Product'}</p>
                    {item.variant && (
                      <p className="text-sm text-muted-foreground">
                        {item.variant.size && `Size: ${item.variant.size}`}
                        {item.variant.size && item.variant.color && ' / '}
                        {item.variant.color && `Color: ${item.variant.color}`}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-serif font-semibold text-foreground">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-4 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatCurrency(order.totalAmount - (order.shippingCost || 0))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">{formatCurrency(order.shippingCost || 0)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span className="text-foreground">Total</span>
                <span className="font-serif text-foreground">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <User size={20} />
                Customer
              </h2>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-foreground">{order.customerName || order.user?.name || 'Guest'}</p>
                <p className="text-muted-foreground">{order.customerEmail || order.user?.email}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <MapPin size={20} />
                Shipping Address
              </h2>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{order.shippingStreet}</p>
                <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                <p>{order.shippingCountry}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <CreditCard size={20} />
                Payment
              </h2>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="text-foreground capitalize">{order.paymentMethod || 'Card'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-emerald-600 dark:text-emerald-400 capitalize">{order.paymentStatus || 'Paid'}</span>
                </div>
              </div>
            </div>

            {/* Update Status */}
            <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">Update Status</h2>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updateStatus.isPending}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
