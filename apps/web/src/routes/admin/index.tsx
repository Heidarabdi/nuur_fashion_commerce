import { TrendingUp, TrendingDown } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import { AdminShell } from './layout'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  return (
    <AdminShell>
      <div className="space-y-6">
        <h1 className="text-2xl lg:text-4xl font-serif font-bold text-foreground">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard label="Total Revenue" value="$48,250" trend="+12.5% this month" trendIcon={<TrendingUp size={14} />} trendClass="text-emerald-600" />
          <StatCard label="Total Orders" value="1,284" trend="+8.2% this month" trendIcon={<TrendingUp size={14} />} trendClass="text-emerald-600" />
          <StatCard label="Customers" value="3,456" trend="+5.4% this month" trendIcon={<TrendingUp size={14} />} trendClass="text-emerald-600" />
          <StatCard label="Products Sold" value="2,847" trend="-2.1% this month" trendIcon={<TrendingDown size={14} />} trendClass="text-destructive" />
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
                  <OrderRow id="#ORD-7352" customer="Sarah Johnson" amount="$1,250" status="Delivered" statusClass="bg-emerald-100 text-emerald-700" />
                  <OrderRow id="#ORD-7351" customer="Emily Davis" amount="$850" status="Processing" statusClass="bg-amber-100 text-amber-700" />
                  <OrderRow id="#ORD-7350" customer="Jessica Martinez" amount="$2,100" status="Shipped" statusClass="bg-blue-100 text-blue-700" />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

function StatCard({ label, value, trend, trendIcon, trendClass }: { label: string; value: string; trend: string; trendIcon: React.ReactNode; trendClass: string }) {
  return (
    <div className="bg-card p-4 lg:p-6 rounded-lg border border-border shadow-sm">
      <p className="text-muted-foreground text-xs lg:text-sm font-medium">{label}</p>
      <p className="text-2xl lg:text-3xl font-serif font-bold mt-2 text-foreground">{value}</p>
      <div className={`flex items-center gap-1 mt-2 text-xs lg:text-sm ${trendClass}`}>
        {trendIcon}
        <span>{trend}</span>
      </div>
    </div>
  )
}

function OrderRow({ id, customer, amount, status, statusClass }: { id: string; customer: string; amount: string; status: string; statusClass: string }) {
  return (
    <tr className="border-b border-border/50">
      <td className="py-3 px-4 text-sm lg:text-base text-foreground whitespace-nowrap">{id}</td>
      <td className="py-3 px-4 text-sm lg:text-base text-foreground whitespace-nowrap">{customer}</td>
      <td className="py-3 px-4 text-sm lg:text-base font-serif font-semibold text-foreground whitespace-nowrap">{amount}</td>
      <td className="py-3 px-4 whitespace-nowrap">
        <span className={`${statusClass} dark:bg-opacity-30 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium`}>{status}</span>
      </td>
    </tr>
  )
}
