import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { AdminShell } from '../../components/AdminShell'
import { DataTable } from '../../components/admin/DataTable'
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

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      sortable: true,
      primary: true,
      render: (customer: any) => (
        <div className="flex items-center gap-3">
          {customer.image ? (
            <img
              src={customer.image}
              alt={customer.name}
              className="w-8 h-8 object-cover rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-primary">
                {customer.name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
          )}
          <span className="font-medium text-foreground whitespace-nowrap">
            {customer.name || 'Unknown'}
          </span>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (customer: any) => (
        <span className="text-muted-foreground">{customer.email}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      sortable: true,
      render: (customer: any) => (
        <span className="text-muted-foreground">{formatDate(customer.createdAt)}</span>
      ),
    },
    {
      key: 'orderCount',
      label: 'Orders',
      sortable: true,
      render: (customer: any) => (
        <span className="text-foreground">{customer.orderCount}</span>
      ),
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      sortable: true,
      render: (customer: any) => (
        <span className="font-serif font-semibold text-foreground">{formatCurrency(customer.totalSpent)}</span>
      ),
    },
  ]

  return (
    <AdminShell>
      <div className="space-y-6">
        <h1 className="text-2xl lg:text-4xl font-serif font-bold text-foreground">Customers</h1>

        <DataTable
          data={customers || []}
          columns={columns}
          searchKeys={['name', 'email']}
          searchPlaceholder="Search customers..."
          pageSize={10}
          emptyMessage="No customers found"
        />
      </div>
    </AdminShell>
  )
}
