import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { AdminShell } from '../../components/AdminShell'
import { useAdminOrders, useUpdateOrderStatus } from '@nuur-fashion-commerce/api'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/orders')({
  component: OrdersPage,
})

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

function OrdersPage() {
  const { data: orders, isLoading, error } = useAdminOrders()
  const updateStatus = useUpdateOrderStatus()
  const [filter, setFilter] = useState<string>('all')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700'
      case 'processing':
        return 'bg-amber-100 text-amber-700'
      case 'shipped':
        return 'bg-blue-100 text-blue-700'
      case 'pending':
        return 'bg-gray-100 text-gray-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status: newStatus })
      toast.success('Order updated', { description: `Status changed to ${newStatus}` })
    } catch (err) {
      toast.error('Failed to update order', { description: (err as Error).message })
    }
  }

  const filteredOrders = filter === 'all'
    ? orders
    : orders?.filter((order: any) => order.status === filter)

  if (isLoading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  if (error) {
    return (
      <AdminShell>
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load orders</p>
          <p className="text-muted-foreground text-sm mt-2">{error.message}</p>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl lg:text-4xl font-serif font-bold text-foreground">Orders</h1>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 lg:px-4 py-2 bg-card border border-border rounded-lg text-xs lg:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="bg-card p-4 lg:p-6 rounded-lg border border-border shadow-sm">
          <div className="overflow-x-auto -mx-4 lg:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Order ID</th>
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Customer</th>
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Date</th>
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Total</th>
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders?.length ? (
                    filteredOrders.map((order: any) => (
                      <tr key={order.id} className="border-b border-border/50">
                        <td className="py-3 px-4 text-sm lg:text-base text-foreground whitespace-nowrap">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="py-3 px-4 text-sm lg:text-base text-foreground whitespace-nowrap">
                          {order.user?.name || order.email || 'Guest'}
                        </td>
                        <td className="py-3 px-4 text-sm lg:text-base text-muted-foreground whitespace-nowrap">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-3 px-4 text-sm lg:text-base font-serif font-semibold text-foreground whitespace-nowrap">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            disabled={updateStatus.isPending}
                            className={`${getStatusClass(order.status)} dark:bg-opacity-30 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium capitalize border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring`}
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status} value={status} className="bg-background text-foreground">
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
