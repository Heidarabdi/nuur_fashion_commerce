import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { AdminShell } from '../../components/AdminShell'
import { useAdminCustomers } from '@nuur-fashion-commerce/api'

export const Route = createFileRoute('/admin/customers')({
  component: CustomersPage,
})

function CustomersPage() {
  const { data: customers, isLoading, error } = useAdminCustomers()

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
          <p className="text-destructive">Failed to load customers</p>
          <p className="text-muted-foreground text-sm mt-2">{error.message}</p>
        </div>
      </AdminShell>
    )
  }

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
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Customer</th>
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Email</th>
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Joined</th>
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Orders</th>
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {customers?.length ? (
                    customers.map((customer: any) => (
                      <tr key={customer.id} className="border-b border-border/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {customer.image ? (
                              <img
                                src={customer.image}
                                alt={customer.name}
                                className="w-8 h-8 object-cover rounded-full"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-muted-foreground">
                                  {customer.name?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                              </div>
                            )}
                            <span className="text-sm lg:text-base text-foreground font-medium whitespace-nowrap">
                              {customer.name || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm lg:text-base text-muted-foreground whitespace-nowrap">
                          {customer.email}
                        </td>
                        <td className="py-3 px-4 text-sm lg:text-base text-muted-foreground whitespace-nowrap">
                          {formatDate(customer.createdAt)}
                        </td>
                        <td className="py-3 px-4 text-sm lg:text-base text-foreground whitespace-nowrap">
                          {customer.orderCount}
                        </td>
                        <td className="py-3 px-4 text-sm lg:text-base font-serif font-semibold text-foreground whitespace-nowrap">
                          {formatCurrency(customer.totalSpent)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No customers found
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
