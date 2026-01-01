import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { AdminShell } from '../../components/AdminShell'
import { DataTable } from '../../components/admin/DataTable'
import { useAdminOrders, useUpdateOrderStatus } from '@nuur-fashion-commerce/api'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/orders')({
  component: OrdersPage,
})

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

function OrdersPage() {
  const navigate = useNavigate()
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

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>, orderId: string) => {
    e.stopPropagation()
    const newStatus = e.target.value
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

  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      sortable: true,
      render: (order: any) => (
        <span className="font-medium text-foreground">#{order.id.slice(0, 8).toUpperCase()}</span>
      ),
    },
    {
      key: 'user.name',
      label: 'Customer',
      sortable: true,
      render: (order: any) => (
        <span className="text-foreground">{order.user?.name || order.email || 'Guest'}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (order: any) => (
        <span className="text-muted-foreground">{formatDate(order.createdAt)}</span>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Total',
      sortable: true,
      render: (order: any) => (
        <span className="font-serif font-semibold text-foreground">{formatCurrency(order.totalAmount)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (order: any) => (
        <select
          value={order.status}
          onChange={(e) => handleStatusChange(e, order.id)}
          onClick={(e) => e.stopPropagation()}
          disabled={updateStatus.isPending}
          className={`${getStatusClass(order.status)} px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium capitalize border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring`}
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status} className="bg-background text-foreground">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      ),
    },
  ]

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

        <DataTable
          data={filteredOrders || []}
          columns={columns}
          searchKeys={['id', 'user.name', 'user.email']}
          searchPlaceholder="Search orders..."
          pageSize={10}
          emptyMessage="No orders found"
          onRowClick={(order: any) => navigate({ to: '/admin/orders/$id', params: { id: order.id } })}
        />
      </div>
    </AdminShell>
  )
}
