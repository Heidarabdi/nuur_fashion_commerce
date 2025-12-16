import { createFileRoute } from '@tanstack/react-router'
import { AdminShell } from './layout'

export const Route = createFileRoute('/admin/customers')({
  component: CustomersPage,
})

function CustomersPage() {
  return (
    <AdminShell>
      <div className="space-y-6">
        <h1 className="text-2xl lg:text-4xl font-serif font-bold text-foreground">Customers</h1>

      <div className="bg-card p-4 lg:p-6 rounded-lg border border-border shadow-sm">
        <div className="overflow-x-auto -mx-4 lg:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Name</th>
                  <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Email</th>
                  <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Phone</th>
                  <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Orders</th>
                  <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                <CustomerRow name="Sarah Johnson" email="sarah@example.com" phone="+1 234 567 8900" orders="12" total="$15,480" />
                <CustomerRow name="Emily Davis" email="emily@example.com" phone="+1 234 567 8901" orders="8" total="$9,250" />
                <CustomerRow name="Jessica Martinez" email="jessica@example.com" phone="+1 234 567 8902" orders="15" total="$24,680" />
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    </AdminShell>
  )
}

function CustomerRow({ name, email, phone, orders, total }: { name: string; email: string; phone: string; orders: string; total: string }) {
  return (
    <tr className="border-b border-border/50">
      <td className="py-3 px-4 text-sm lg:text-base text-foreground font-medium whitespace-nowrap">{name}</td>
      <td className="py-3 px-4 text-sm lg:text-base text-muted-foreground whitespace-nowrap">{email}</td>
      <td className="py-3 px-4 text-sm lg:text-base text-muted-foreground whitespace-nowrap">{phone}</td>
      <td className="py-3 px-4 text-sm lg:text-base text-foreground whitespace-nowrap">{orders}</td>
      <td className="py-3 px-4 text-sm lg:text-base font-serif font-semibold text-foreground whitespace-nowrap">{total}</td>
    </tr>
  )
}
