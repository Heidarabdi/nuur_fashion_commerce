import { Link, createFileRoute } from '@tanstack/react-router'
import { Package, ChevronRight, ShoppingBag } from 'lucide-react'
import { useOrders } from '@nuur-fashion-commerce/api'
import { authClient } from '../lib/auth-client'

export const Route = createFileRoute('/orders')({
    component: OrdersPage,
})

function OrdersPage() {
    const { data: session, isPending: isSessionLoading } = authClient.useSession()
    const { data: ordersData, isLoading, error } = useOrders()

    const user = session?.user
    const orders = ordersData || []

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
                        <div className="animate-pulse space-y-4">
                            <div className="h-10 bg-secondary rounded w-48 mb-8" />
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-32 bg-secondary rounded-xl" />
                            ))}
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
                        <h1 className="text-2xl font-serif font-semibold mb-3">Sign in to view your orders</h1>
                        <p className="text-foreground/60 mb-8">
                            Track your orders, view order history, and more.
                        </p>
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

    if (error) {
        return (
            <div className="min-h-screen pt-10">
                <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                            <p className="text-destructive">Failed to load orders. Please try again.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-10">
            <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-12">
                        <Package className="w-8 h-8 text-primary" />
                        <h1 className="font-serif text-4xl font-bold">My Orders</h1>
                    </div>

                    {orders.length === 0 ? (
                        <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-border">
                            <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-foreground/30" />
                            <h2 className="text-2xl font-serif font-semibold mb-3">No orders yet</h2>
                            <p className="text-foreground/60 mb-8 max-w-md mx-auto">
                                When you place your first order, it will appear here.
                            </p>
                            <Link
                                to="/shop"
                                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order: any) => (
                                <Link
                                    key={order.id}
                                    to="/orders/$id"
                                    params={{ id: order.id }}
                                    className="block bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <span className="font-semibold">Order #{order.orderNumber || order.id.slice(0, 8)}</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status || 'Pending'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-foreground/60">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-semibold">${order.total?.toFixed(2) || '0.00'}</p>
                                                <p className="text-sm text-foreground/60">
                                                    {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-foreground/40" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
