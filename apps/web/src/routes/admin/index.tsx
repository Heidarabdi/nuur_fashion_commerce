import { TrendingUp, TrendingDown, Package, Loader2, ShoppingCart, Users, DollarSign, ArrowRight, AlertCircle } from 'lucide-react'
import { createFileRoute, Link } from '@tanstack/react-router'
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  // Calculate some derived metrics
  const avgOrderValue = stats?.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0
  const pendingOrders = stats?.recentOrders?.filter((o: any) => o.status === 'pending')?.length || 0

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header with quick actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl lg:text-4xl font-serif font-bold text-foreground">Dashboard</h1>
          <div className="flex gap-2">
            <Link
              to="/admin/products/new"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              + New Product
            </Link>
            <Link
              to="/admin/orders"
              className="border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
            >
              View Orders
            </Link>
          </div>
        </div>

        {/* Alert for pending orders */}
        {pendingOrders > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-amber-600 dark:text-amber-400 shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-amber-800 dark:text-amber-200 font-medium">
                {pendingOrders} order{pendingOrders > 1 ? 's' : ''} pending review
              </p>
              <p className="text-amber-600 dark:text-amber-400 text-sm">
                New orders need to be processed
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="text-amber-700 dark:text-amber-300 text-sm font-medium hover:underline flex items-center gap-1"
            >
              View <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            label="Total Revenue"
            value={formatCurrency(stats?.totalRevenue || 0)}
            icon={<DollarSign size={20} />}
            iconBg="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            trend="+12.5%"
            trendUp={true}
          />
          <StatCard
            label="Total Orders"
            value={String(stats?.totalOrders || 0)}
            icon={<ShoppingCart size={20} />}
            iconBg="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            trend="+8.2%"
            trendUp={true}
          />
          <StatCard
            label="Customers"
            value={String(stats?.totalCustomers || 0)}
            icon={<Users size={20} />}
            iconBg="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            trend="+5.7%"
            trendUp={true}
          />
          <StatCard
            label="Avg Order Value"
            value={formatCurrency(avgOrderValue)}
            icon={<Package size={20} />}
            iconBg="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
            trend="-2.1%"
            trendUp={false}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-card p-4 lg:p-6 rounded-lg border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h2 className="text-xl font-serif font-bold text-foreground">Recent Orders</h2>
              <Link
                to="/admin/orders"
                className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="overflow-x-auto -mx-4 lg:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Order</th>
                      <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Customer</th>
                      <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Date</th>
                      <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Amount</th>
                      <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentOrders?.length ? (
                      stats.recentOrders.slice(0, 5).map((order: any) => (
                        <tr
                          key={order.id}
                          className="border-b border-border/50 hover:bg-secondary/50 cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-4 text-sm text-foreground font-medium whitespace-nowrap">
                            <Link to="/admin/orders/$id" params={{ id: order.id }} className="hover:text-primary">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </Link>
                          </td>
                          <td className="py-3 px-4 text-sm text-foreground whitespace-nowrap">
                            {order.user?.name || 'Guest'}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground whitespace-nowrap">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="py-3 px-4 text-sm font-serif font-semibold text-foreground whitespace-nowrap">
                            {formatCurrency(order.totalAmount)}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`${getStatusClass(order.status)} px-2 lg:px-3 py-1 rounded-full text-xs font-medium capitalize`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          No recent orders
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
            {/* Products Overview */}
            <div className="bg-card p-4 lg:p-6 rounded-lg border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-serif font-bold text-foreground">Products</h2>
                <Link
                  to="/admin/products"
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Manage
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Products</span>
                  <span className="font-semibold text-foreground">{stats?.totalProducts || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active</span>
                  <span className="font-semibold text-emerald-600">{stats?.activeProducts || stats?.totalProducts || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Draft</span>
                  <span className="font-semibold text-amber-600">{stats?.draftProducts || 0}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-card p-4 lg:p-6 rounded-lg border border-border shadow-sm">
              <h2 className="text-lg font-serif font-bold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  to="/admin/products/new"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Package size={16} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Add New Product</span>
                </Link>
                <Link
                  to="/admin/categories"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Package size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Manage Categories</span>
                </Link>
                <Link
                  to="/admin/customers"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Users size={16} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm font-medium text-foreground">View Customers</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

function StatCard({
  label,
  value,
  icon,
  iconBg,
  trend,
  trendUp,
}: {
  label: string
  value: string
  icon: React.ReactNode
  iconBg: string
  trend?: string
  trendUp?: boolean
}) {
  return (
    <div className="bg-card p-4 lg:p-6 rounded-lg border border-border shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-xs lg:text-sm font-medium">{label}</p>
          <p className="text-2xl lg:text-3xl font-serif font-bold mt-2 text-foreground">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-destructive'}`}>
              {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend} vs last month
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
