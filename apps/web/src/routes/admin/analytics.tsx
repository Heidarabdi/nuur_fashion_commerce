import { createFileRoute } from '@tanstack/react-router'
import { Loader2, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Calendar } from 'lucide-react'
import { AdminShell } from '../../components/AdminShell'
import { useAdminStats, useAdminOrders } from '@nuur-fashion-commerce/api'
import { useMemo } from 'react'

export const Route = createFileRoute('/admin/analytics')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats()
  const { data: orders, isLoading: ordersLoading } = useAdminOrders()

  const isLoading = statsLoading || ordersLoading

  // Calculate analytics from real data
  const analytics = useMemo(() => {
    if (!orders || !stats) return null

    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()

    // Filter orders by month
    const thisMonthOrders = orders.filter((o: any) => {
      const d = new Date(o.createdAt)
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear
    })

    const lastMonthOrders = orders.filter((o: any) => {
      const d = new Date(o.createdAt)
      const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
      const year = thisMonth === 0 ? thisYear - 1 : thisYear
      return d.getMonth() === lastMonth && d.getFullYear() === year
    })

    // Revenue calculations - ensure numeric values with Number() parsing
    const thisMonthRevenue = thisMonthOrders.reduce((sum: number, o: any) => sum + (Number(o.totalAmount) || 0), 0)
    const lastMonthRevenue = lastMonthOrders.reduce((sum: number, o: any) => sum + (Number(o.totalAmount) || 0), 0)
    const revenueGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

    // Order calculations
    const orderGrowth = lastMonthOrders.length > 0
      ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100
      : 0

    // Average order value
    const avgOrderValue = thisMonthOrders.length > 0 ? thisMonthRevenue / thisMonthOrders.length : 0
    const lastAvgOrderValue = lastMonthOrders.length > 0
      ? lastMonthRevenue / lastMonthOrders.length
      : 0
    const aovGrowth = lastAvgOrderValue > 0
      ? ((avgOrderValue - lastAvgOrderValue) / lastAvgOrderValue) * 100
      : 0

    // Order status breakdown
    const statusBreakdown = orders.reduce((acc: any, o: any) => {
      acc[o.status] = (acc[o.status] || 0) + 1
      return acc
    }, {})

    // Daily orders for the current month
    const dailyOrders: Record<string, number> = {}
    thisMonthOrders.forEach((o: any) => {
      const day = new Date(o.createdAt).getDate()
      dailyOrders[day] = (dailyOrders[day] || 0) + 1
    })

    return {
      thisMonthRevenue,
      lastMonthRevenue,
      revenueGrowth,
      thisMonthOrders: thisMonthOrders.length,
      lastMonthOrders: lastMonthOrders.length,
      orderGrowth,
      avgOrderValue,
      aovGrowth,
      statusBreakdown,
      dailyOrders,
      totalOrders: orders.length,
    }
  }, [orders, stats])

  const formatCurrency = (value: number) => {
    const safeValue = isNaN(value) ? 0 : value
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(safeValue)
  }

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
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

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl lg:text-4xl font-serif font-bold text-foreground">Analytics</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={16} />
            <span>This Month</span>
          </div>
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <MetricCard
            label="Monthly Revenue"
            value={formatCurrency(analytics?.thisMonthRevenue || 0)}
            icon={<DollarSign size={20} />}
            iconBg="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            trend={formatPercent(analytics?.revenueGrowth || 0)}
            trendUp={(analytics?.revenueGrowth || 0) >= 0}
          />
          <MetricCard
            label="Monthly Orders"
            value={String(analytics?.thisMonthOrders || 0)}
            icon={<ShoppingCart size={20} />}
            iconBg="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            trend={formatPercent(analytics?.orderGrowth || 0)}
            trendUp={(analytics?.orderGrowth || 0) >= 0}
          />
          <MetricCard
            label="Avg Order Value"
            value={formatCurrency(analytics?.avgOrderValue || 0)}
            icon={<Package size={20} />}
            iconBg="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            trend={formatPercent(analytics?.aovGrowth || 0)}
            trendUp={(analytics?.aovGrowth || 0) >= 0}
          />
          <MetricCard
            label="Total Customers"
            value={String(stats?.totalCustomers || 0)}
            icon={<Users size={20} />}
            iconBg="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status Breakdown */}
          <div className="bg-card p-4 lg:p-6 rounded-lg border border-border shadow-sm">
            <h2 className="text-xl font-serif font-bold mb-6 text-foreground">Order Status</h2>
            <div className="space-y-4">
              {Object.entries(analytics?.statusBreakdown || {}).map(([status, count]) => {
                const total = analytics?.totalOrders || 1
                const percent = ((count as number) / total) * 100
                return (
                  <StatusRow
                    key={status}
                    label={status}
                    count={count as number}
                    percent={percent}
                  />
                )
              })}
              {Object.keys(analytics?.statusBreakdown || {}).length === 0 && (
                <p className="text-muted-foreground text-center py-4">No orders yet</p>
              )}
            </div>
          </div>

          {/* Monthly Comparison */}
          <div className="bg-card p-4 lg:p-6 rounded-lg border border-border shadow-sm">
            <h2 className="text-xl font-serif font-bold mb-6 text-foreground">Month Comparison</h2>
            <div className="space-y-6">
              <ComparisonRow
                label="Revenue"
                current={formatCurrency(analytics?.thisMonthRevenue || 0)}
                previous={formatCurrency(analytics?.lastMonthRevenue || 0)}
                growth={analytics?.revenueGrowth || 0}
              />
              <ComparisonRow
                label="Orders"
                current={String(analytics?.thisMonthOrders || 0)}
                previous={String(analytics?.lastMonthOrders || 0)}
                growth={analytics?.orderGrowth || 0}
              />
              <ComparisonRow
                label="Avg Order Value"
                current={formatCurrency(analytics?.avgOrderValue || 0)}
                previous={formatCurrency(
                  analytics?.lastMonthOrders
                    ? (analytics?.lastMonthRevenue || 0) / analytics.lastMonthOrders
                    : 0
                )}
                growth={analytics?.aovGrowth || 0}
              />
            </div>
          </div>
        </div>

        {/* Top Products Placeholder */}
        <div className="bg-card p-4 lg:p-6 rounded-lg border border-border shadow-sm">
          <h2 className="text-xl font-serif font-bold mb-6 text-foreground">Store Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <p className="text-3xl font-serif font-bold text-foreground">{stats?.totalProducts || 0}</p>
              <p className="text-sm text-muted-foreground mt-1">Products</p>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <p className="text-3xl font-serif font-bold text-foreground">{stats?.totalOrders || 0}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Orders</p>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <p className="text-3xl font-serif font-bold text-foreground">{stats?.totalCustomers || 0}</p>
              <p className="text-sm text-muted-foreground mt-1">Customers</p>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <p className="text-3xl font-serif font-bold text-foreground">{formatCurrency(stats?.totalRevenue || 0)}</p>
              <p className="text-sm text-muted-foreground mt-1">All-Time Revenue</p>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

function MetricCard({
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

function StatusRow({ label, count, percent }: { label: string; count: number; percent: number }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-500'
      case 'processing':
        return 'bg-amber-500'
      case 'shipped':
        return 'bg-blue-500'
      case 'pending':
        return 'bg-gray-400'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground capitalize">{label}</span>
        <span className="text-sm text-muted-foreground">{count} ({percent.toFixed(1)}%)</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getStatusColor(label)}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function ComparisonRow({
  label,
  current,
  previous,
  growth,
}: {
  label: string
  current: string
  previous: string
  growth: number
}) {
  const isPositive = growth >= 0

  return (
    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-serif font-bold text-foreground mt-1">{current}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-muted-foreground">vs {previous}</p>
        <p className={`text-sm font-medium mt-1 flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-600' : 'text-destructive'}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {isPositive ? '+' : ''}{growth.toFixed(1)}%
        </p>
      </div>
    </div>
  )
}
