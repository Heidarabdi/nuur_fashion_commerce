import { createFileRoute } from '@tanstack/react-router'
import { AdminShell } from '../../components/AdminShell'

export const Route = createFileRoute('/admin/orders')({
  component: OrdersPage,
})

function OrdersPage() {
  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl lg:text-4xl font-serif font-bold text-foreground">Orders</h1>
          <select className="px-3 lg:px-4 py-2 bg-card border border-border rounded-lg text-xs lg:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option>All Orders</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
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
                  <OrderRow id="#ORD-7352" customer="Sarah Johnson" date="Dec 15, 2024" total="$1,250" status="Delivered" statusClass="bg-emerald-100 text-emerald-700" />
                  <OrderRow id="#ORD-7351" customer="Emily Davis" date="Dec 14, 2024" total="$850" status="Processing" statusClass="bg-amber-100 text-amber-700" />
                  <OrderRow id="#ORD-7350" customer="Jessica Martinez" date="Dec 13, 2024" total="$2,100" status="Shipped" statusClass="bg-blue-100 text-blue-700" />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

function OrderRow({ id, customer, date, total, status, statusClass }: { id: string; customer: string; date: string; total: string; status: string; statusClass: string }) {
  return (
    <tr className="border-b border-border/50">
      <td className="py-3 px-4 text-sm lg:text-base text-foreground whitespace-nowrap">{id}</td>
      <td className="py-3 px-4 text-sm lg:text-base text-foreground whitespace-nowrap">{customer}</td>
      <td className="py-3 px-4 text-sm lg:text-base text-muted-foreground whitespace-nowrap">{date}</td>
      <td className="py-3 px-4 text-sm lg:text-base font-serif font-semibold text-foreground whitespace-nowrap">{total}</td>
      <td className="py-3 px-4 whitespace-nowrap">
        <span className={`${statusClass} dark:bg-opacity-30 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium`}>{status}</span>
      </td>
    </tr>
  )
}
