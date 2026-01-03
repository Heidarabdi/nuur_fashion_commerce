import { createFileRoute, Link } from '@tanstack/react-router'
import { Loader2, Pencil, Trash2, Plus } from 'lucide-react'
import { AdminShell } from '../../../components/AdminShell'
import { DataTable } from '../../../components/admin/DataTable'
import { useAdminProducts, useDeleteProduct } from '@nuur-fashion-commerce/api'
import { toast } from 'sonner'

import { useState } from 'react'
import { ConfirmationModal } from '../../../components/ui/confirmation-modal'

export const Route = createFileRoute('/admin/products/')({
  component: ProductsPage,
})

function ProductsPage() {
  const { data: products, isLoading, error } = useAdminProducts()
  const deleteProduct = useDeleteProduct()

  // Confirmation Modal State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; productId: string | null; productName: string }>({
    isOpen: false,
    productId: null,
    productName: '',
  })

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
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
      case 'draft':
        return 'bg-secondary text-muted-foreground'
      case 'archived':
        return 'bg-destructive/10 text-destructive'
      default:
        return 'bg-secondary text-muted-foreground'
    }
  }

  const handleDeleteClick = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation()
    setDeleteConfirmation({
      isOpen: true,
      productId: id,
      productName: name,
    })
  }

  const confirmDelete = async () => {
    if (!deleteConfirmation.productId) return

    try {
      await deleteProduct.mutateAsync(deleteConfirmation.productId)
      toast.success('Product deleted', { description: `${deleteConfirmation.productName} has been removed.` })
      setDeleteConfirmation({ isOpen: false, productId: null, productName: '' })
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

  const columns = [
    {
      key: 'name',
      label: 'Product',
      sortable: true,
      primary: true, // Shows as title on mobile card view
      render: (product: any) => (
        <div className="flex items-center gap-3">
          {product.images?.[0] && (
            <img
              src={product.images[0].url || product.images[0]}
              alt={product.name}
              className="w-10 h-10 object-cover rounded"
            />
          )}
          <div>
            <p className="font-medium text-foreground">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category.name',
      label: 'Category',
      sortable: true,
      render: (product: any) => (
        <span className="text-muted-foreground">{product.category?.name || '-'}</span>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (product: any) => (
        <span className="font-serif font-semibold text-foreground">{formatCurrency(product.price)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (product: any) => (
        <span className={`${getStatusClass(product.status)} px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium capitalize`}>
          {product.status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (product: any) => (
        <div className="flex items-center gap-2">
          <Link
            to="/admin/products/$id"
            params={{ id: product.id }}
            className="p-2 hover:bg-secondary rounded-md transition-colors"
            title="Edit"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <Pencil size={16} className="text-muted-foreground" />
          </Link>
          <button
            onClick={(e) => handleDeleteClick(e, product.id, product.name)}
            className="p-2 hover:bg-destructive/10 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 size={16} className="text-destructive" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl lg:text-4xl font-serif font-bold text-foreground">Products</h1>
          <Link
            to="/admin/products/new"
            className="bg-primary text-primary-foreground px-4 lg:px-6 py-2 lg:py-3 rounded-lg text-sm lg:text-base font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>

        <DataTable
          data={products || []}
          columns={columns}
          searchKeys={['name', 'slug', 'category.name']}
          searchPlaceholder="Search products..."
          pageSize={10}
          emptyMessage="No products found"
        />

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteConfirmation.isOpen}
          onClose={() => setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })}
          onConfirm={confirmDelete}
          title="Delete Product"
          description={`Are you sure you want to delete "${deleteConfirmation.productName}"? This action cannot be undone.`}
          confirmText="Delete Product"
          variant="danger"
          isLoading={deleteProduct.isPending}
        />
      </div>
    </AdminShell>
  )
}
