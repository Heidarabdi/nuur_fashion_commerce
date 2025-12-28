import { TrendingUp, Package, Loader2 } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import { AdminShell } from '../../components/AdminShell'
import { useAdminStats } from '@nuur-fashion-commerce/api'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const { data: stats, isLoading, error } = useAdminStats()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
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
          <p className="text-destructive">Failed to load dashboard data</p>
          <p className="text-muted-foreground text-sm mt-2">{error.message}</p>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <h1 className="text-2xl lg:text-4xl font-serif font-bold text-foreground">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            label="Total Revenue"
            value={formatCurrency(stats?.totalRevenue || 0)}
            icon={<TrendingUp size={18} className="text-emerald-600" />}
          />
          <StatCard
            label="Total Orders"
            value={String(stats?.totalOrders || 0)}
            icon={<Package size={18} className="text-blue-600" />}
          />
          <StatCard
            label="Customers"
            value={String(stats?.totalCustomers || 0)}
            icon={<TrendingUp size={18} className="text-purple-600" />}
          />
          <StatCard
            label="Products"
            value={String(stats?.totalProducts || 0)}
            icon={<Package size={18} className="text-amber-600" />}
          />
        </div>

        <div className="bg-card p-4 lg:p-6 rounded-lg border border-border shadow-sm">
          <h2 className="text-xl lg:text-2xl font-serif font-bold mb-4 lg:mb-6 text-foreground">Recent Orders</h2>
          <div className="overflow-x-auto -mx-4 lg:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Order ID</th>
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Customer</th>
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Amount</th>
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.length ? (
                    stats.recentOrders.map((order: any) => (
                      <tr key={order.id} className="border-b border-border/50">
                        <td className="py-3 px-4 text-sm lg:text-base text-foreground whitespace-nowrap">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="py-3 px-4 text-sm lg:text-base text-foreground whitespace-nowrap">
                          {order.user?.name || 'Guest'}
                        </td>
                        <td className="py-3 px-4 text-sm lg:text-base font-serif font-semibold text-foreground whitespace-nowrap">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`${getStatusClass(order.status)} dark:bg-opacity-30 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium capitalize`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground">
                        No recent orders
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

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-card p-4 lg:p-6 rounded-lg border border-border shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs lg:text-sm font-medium">{label}</p>
        {icon}
      </div>
      <p className="text-2xl lg:text-3xl font-serif font-bold mt-2 text-foreground">{value}</p>
    </div>
  )
}
