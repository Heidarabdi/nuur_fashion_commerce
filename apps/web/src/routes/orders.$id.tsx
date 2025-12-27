import { Link, createFileRoute } from '@tanstack/react-router'
import { Package, ArrowLeft, Truck, CheckCircle, Clock, MapPin } from 'lucide-react'
import { useOrder } from '@nuur-fashion-commerce/api'
import { authClient } from '../lib/auth-client'

export const Route = createFileRoute('/orders/$id')({
    component: OrderDetailsPage,
})

function OrderDetailsPage() {
    const { id } = Route.useParams()
    const { data: session, isPending: isSessionLoading } = authClient.useSession()
    const { data: orderData, isLoading, error } = useOrder(id)

    const user = session?.user
    const order = orderData

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return <CheckCircle className="w-5 h-5 text-green-500" />
            case 'shipped':
                return <Truck className="w-5 h-5 text-blue-500" />
            default:
                return <Clock className="w-5 h-5 text-amber-500" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-green-500/10 text-green-600'
            case 'shipped':
                return 'bg-blue-500/10 text-blue-600'
            case 'processing':
                return 'bg-amber-500/10 text-amber-600'
            case 'cancelled':
                return 'bg-red-500/10 text-red-600'
            default:
                return 'bg-secondary text-foreground/70'
        }
    }

    if (isSessionLoading || isLoading) {
        return (
            <div className="min-h-screen pt-10">
                <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-pulse space-y-6">
                            <div className="h-6 bg-secondary rounded w-32" />
                            <div className="h-10 bg-secondary rounded w-64" />
                            <div className="h-64 bg-secondary rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen pt-10">
                <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center py-20">
                        <Package className="w-16 h-16 mx-auto mb-6 text-foreground/30" />
                        <h1 className="text-2xl font-serif font-semibold mb-3">Sign in to view order details</h1>
                        <Link
                            to="/auth/login"
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="min-h-screen pt-10">
                <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <Link to="/orders" className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8">
                            <ArrowLeft className="w-4 h-4" />
                            Back to orders
                        </Link>
                        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                            <p className="text-destructive">Order not found or failed to load.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const items = order.items || []

    return (
        <div className="min-h-screen pt-10">
            <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Link to="/orders" className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8">
                        <ArrowLeft className="w-4 h-4" />
                        Back to orders
                    </Link>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="font-serif text-3xl font-bold mb-2">
                                Order #{order.orderNumber || order.id.slice(0, 8)}
                            </h1>
                            <p className="text-foreground/60">
                                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {order.status || 'Pending'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Order Items */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="font-semibold text-lg mb-4">Items</h2>
                            <div className="bg-card rounded-xl border border-border divide-y divide-border">
                                {items.map((item: any, index: number) => {
                                    const product = item.product || {}
                                    const imageUrl = product.images?.[0]?.url || '/placeholder.svg'

                                    return (
                                        <div key={item.id || index} className="flex gap-4 p-4">
                                            <img
                                                src={imageUrl}
                                                alt={item.name || product.name}
                                                className="w-20 h-20 object-cover rounded-lg bg-secondary"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium">{item.name || product.name}</h3>
                                                {item.sku && (
                                                    <p className="text-sm text-foreground/60">SKU: {item.sku}</p>
                                                )}
                                                <p className="text-sm text-foreground/60">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">${item.totalPrice?.toFixed(2) || (item.unitPrice * item.quantity).toFixed(2)}</p>
                                                <p className="text-sm text-foreground/60">${item.unitPrice?.toFixed(2)} each</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Order Summary & Shipping */}
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <div className="bg-card rounded-xl border border-border p-6">
                                <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-foreground/60">Subtotal</span>
                                        <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    {order.discountAmount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span>-${order.discountAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-foreground/60">Shipping</span>
                                        <span>{order.shippingAmount > 0 ? `$${order.shippingAmount.toFixed(2)}` : 'Free'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-foreground/60">Tax</span>
                                        <span>${order.taxAmount?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
                                        <span>Total</span>
                                        <span>${order.total?.toFixed(2) || '0.00'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            {order.shippingAddress && (
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        <h2 className="font-semibold text-lg">Shipping Address</h2>
                                    </div>
                                    <div className="text-sm space-y-1 text-foreground/80">
                                        <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                        <p>{order.shippingAddress.addressLine1}</p>
                                        {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                                        <p>{order.shippingAddress.country}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
