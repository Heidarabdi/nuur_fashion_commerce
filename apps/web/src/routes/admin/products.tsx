import { createFileRoute, Link } from '@tanstack/react-router'
import { Loader2, Pencil, Trash2, Plus } from 'lucide-react'
import { AdminShell } from '../../components/AdminShell'
import { useAdminProducts, useDeleteProduct } from '@nuur-fashion-commerce/api'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/products')({
  component: ProductsPage,
})

function ProductsPage() {
  const { data: products, isLoading, error } = useAdminProducts()
  const deleteProduct = useDeleteProduct()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700'
      case 'draft':
        return 'bg-gray-100 text-gray-700'
      case 'archived':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      await deleteProduct.mutateAsync(id)
      toast.success('Product deleted', { description: `${name} has been removed.` })
    } catch (err) {
      toast.error('Failed to delete product', { description: (err as Error).message })
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
          <p className="text-destructive">Failed to load products</p>
          <p className="text-muted-foreground text-sm mt-2">{error.message}</p>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl lg:text-4xl font-serif font-bold text-foreground">Products</h1>
          <button className="bg-accent text-accent-foreground px-4 lg:px-6 py-2 lg:py-3 rounded-lg text-sm lg:text-base font-medium hover:bg-accent/90 transition-colors flex items-center gap-2">
            <Plus size={18} />
            Add Product
          </button>
        </div>

        <div className="bg-card p-4 lg:p-6 rounded-lg border border-border shadow-sm">
          <div className="overflow-x-auto -mx-4 lg:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Product Name</th>
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Category</th>
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Price</th>
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Status</th>
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.length ? (
                    products.map((product: any) => (
                      <tr key={product.id} className="border-b border-border/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {product.images?.[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="text-sm lg:text-base text-foreground font-medium whitespace-nowrap">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm lg:text-base text-muted-foreground whitespace-nowrap">
                          {product.category?.name || '-'}
                        </td>
                        <td className="py-3 px-4 text-sm lg:text-base font-serif font-semibold text-foreground whitespace-nowrap">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`${getStatusClass(product.status)} dark:bg-opacity-30 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium capitalize`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Link
                              to="/product/$id"
                              params={{ id: product.id }}
                              className="p-2 hover:bg-secondary rounded-md transition-colors"
                              title="Edit"
                            >
                              <Pencil size={16} className="text-muted-foreground" />
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id, product.name)}
                              className="p-2 hover:bg-destructive/10 rounded-md transition-colors"
                              title="Delete"
                              disabled={deleteProduct.isPending}
                            >
                              <Trash2 size={16} className="text-destructive" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No products found
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
