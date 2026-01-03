import { createFileRoute } from '@tanstack/react-router'
import { Loader2, Plus, Pencil, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { AdminShell } from '../../components/AdminShell'
import { DataTable } from '../../components/admin/DataTable'
import { useBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from '@nuur-fashion-commerce/api'
import { toast } from 'sonner'

import { ConfirmationModal } from '../../components/ui/confirmation-modal'

export const Route = createFileRoute('/admin/brands')({
  component: BrandsPage,
})

interface Brand {
  id: string
  name: string
  slug: string
  description?: string
  logoUrl?: string
}

function BrandsPage() {
  const { data: brands, isLoading, error } = useBrands()
  const createBrand = useCreateBrand()
  const updateBrand = useUpdateBrand()
  const deleteBrand = useDeleteBrand()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', logoUrl: '' })

  // Confirmation Modal State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; brandId: string | null; brandName: string }>({
    isOpen: false,
    brandId: null,
    brandName: '',
  })

  const openCreateModal = () => {
    setEditingBrand(null)
    setFormData({ name: '', slug: '', description: '', logoUrl: '' })
    setIsModalOpen(true)
  }

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand)
    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || '',
      logoUrl: brand.logoUrl || '',
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingBrand) {
        await updateBrand.mutateAsync({ id: editingBrand.id, ...formData })
        toast.success('Brand updated', { description: `${formData.name} has been updated.` })
      } else {
        await createBrand.mutateAsync(formData)
        toast.success('Brand created', { description: `${formData.name} has been added.` })
      }
      setIsModalOpen(false)
    } catch (err) {
      toast.error('Failed to save brand', { description: (err as Error).message })
    }
  }

  const handleDeleteClick = (e: React.MouseEvent, brand: Brand) => {
    e.stopPropagation()
    setDeleteConfirmation({
      isOpen: true,
      brandId: brand.id,
      brandName: brand.name,
    })
  }

  const confirmDelete = async () => {
    if (!deleteConfirmation.brandId) return

    try {
      await deleteBrand.mutateAsync(deleteConfirmation.brandId)
      toast.success('Brand deleted', { description: `${deleteConfirmation.brandName} has been removed.` })
      setDeleteConfirmation({ isOpen: false, brandId: null, brandName: '' })
    } catch (err) {
      toast.error('Failed to delete brand', { description: (err as Error).message })
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
          <p className="text-destructive">Failed to load brands</p>
          <p className="text-muted-foreground text-sm mt-2">{error.message}</p>
        </div>
      </AdminShell>
    )
  }

  const columns = [
    {
      key: 'name',
      label: 'Brand',
      sortable: true,
      primary: true,
      render: (brand: Brand) => (
        <div className="flex items-center gap-3">
          {brand.logoUrl ? (
            <img src={brand.logoUrl} alt={brand.name} className="w-8 h-8 object-contain rounded" />
          ) : (
            <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{brand.name.charAt(0)}</span>
            </div>
          )}
          <span className="font-medium text-foreground">{brand.name}</span>
        </div>
      ),
    },
    {
      key: 'slug',
      label: 'Slug',
      render: (brand: Brand) => <span className="text-muted-foreground">{brand.slug}</span>,
    },
    {
      key: 'description',
      label: 'Description',
      render: (brand: Brand) => (
        <span className="text-muted-foreground text-sm">{brand.description || '-'}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (brand: Brand) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(brand)}
            className="p-2 hover:bg-secondary rounded-md transition-colors"
            title="Edit"
          >
            <Pencil size={16} className="text-muted-foreground" />
          </button>
          <button
            onClick={(e) => handleDeleteClick(e, brand)}
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
          <h1 className="text-2xl lg:text-4xl font-serif font-bold text-foreground">Brands</h1>
          <button
            onClick={openCreateModal}
            className="bg-primary text-primary-foreground px-4 lg:px-6 py-2 lg:py-3 rounded-lg text-sm lg:text-base font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Add Brand
          </button>
        </div>

        <DataTable
          data={brands || []}
          columns={columns}
          searchKeys={['name', 'slug']}
          searchPlaceholder="Search brands..."
          pageSize={10}
          emptyMessage="No brands found"
        />
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md mx-4 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-bold text-foreground">
                {editingBrand ? 'Edit Brand' : 'New Brand'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-secondary rounded">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Leave empty to auto-generate"
                  className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Logo URL</label>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createBrand.isPending || updateBrand.isPending}
                  className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {(createBrand.isPending || updateBrand.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingBrand ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })}
        onConfirm={confirmDelete}
        title="Delete Brand"
        description={`Are you sure you want to delete "${deleteConfirmation.brandName}"? This action cannot be undone.`}
        confirmText="Delete Brand"
        variant="danger"
        isLoading={deleteBrand.isPending}
      />
    </AdminShell>
  )
}
