import { createFileRoute } from '@tanstack/react-router'
import { Loader2, Plus, Pencil, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { AdminShell } from '../../components/AdminShell'
import { DataTable } from '../../components/admin/DataTable'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@nuur-fashion-commerce/api'
import { toast } from 'sonner'

import { ConfirmationModal } from '../../components/ui/confirmation-modal'

export const Route = createFileRoute('/admin/categories')({
  component: CategoriesPage,
})

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
}

function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', imageUrl: '' })

  // Confirmation Modal State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; categoryId: string | null; categoryName: string }>({
    isOpen: false,
    categoryId: null,
    categoryName: '',
  })

  const openCreateModal = () => {
    setEditingCategory(null)
    setFormData({ name: '', slug: '', description: '', imageUrl: '' })
    setIsModalOpen(true)
  }

  const openEditModal = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      imageUrl: category.imageUrl || '',
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, ...formData })
        toast.success('Category updated', { description: `${formData.name} has been updated.` })
      } else {
        await createCategory.mutateAsync(formData)
        toast.success('Category created', { description: `${formData.name} has been added.` })
      }
      setIsModalOpen(false)
    } catch (err) {
      toast.error('Failed to save category', { description: (err as Error).message })
    }
  }

  const handleDeleteClick = (e: React.MouseEvent, category: Category) => {
    e.stopPropagation()
    setDeleteConfirmation({
      isOpen: true,
      categoryId: category.id,
      categoryName: category.name,
    })
  }

  const confirmDelete = async () => {
    if (!deleteConfirmation.categoryId) return

    try {
      await deleteCategory.mutateAsync(deleteConfirmation.categoryId)
      toast.success('Category deleted', { description: `${deleteConfirmation.categoryName} has been removed.` })
      setDeleteConfirmation({ isOpen: false, categoryId: null, categoryName: '' })
    } catch (err) {
      toast.error('Failed to delete category', { description: (err as Error).message })
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
          <p className="text-destructive">Failed to load categories</p>
          <p className="text-muted-foreground text-sm mt-2">{error.message}</p>
        </div>
      </AdminShell>
    )
  }

  const columns = [
    {
      key: 'name',
      label: 'Category',
      sortable: true,
      primary: true,
      render: (category: Category) => (
        <div className="flex items-center gap-3">
          {category.imageUrl ? (
            <img src={category.imageUrl} alt={category.name} className="w-10 h-10 object-cover rounded" />
          ) : (
            <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{category.name.charAt(0)}</span>
            </div>
          )}
          <span className="font-medium text-foreground">{category.name}</span>
        </div>
      ),
    },
    {
      key: 'slug',
      label: 'Slug',
      render: (category: Category) => <span className="text-muted-foreground">{category.slug}</span>,
    },
    {
      key: 'description',
      label: 'Description',
      render: (category: Category) => (
        <span className="text-muted-foreground text-sm truncate max-w-xs block">
          {category.description || '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (category: Category) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(category)}
            className="p-2 hover:bg-secondary rounded-md transition-colors"
            title="Edit"
          >
            <Pencil size={16} className="text-muted-foreground" />
          </button>
          <button
            onClick={(e) => handleDeleteClick(e, category)}
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
          <h1 className="text-2xl lg:text-4xl font-serif font-bold text-foreground">Categories</h1>
          <button
            onClick={openCreateModal}
            className="bg-primary text-primary-foreground px-4 lg:px-6 py-2 lg:py-3 rounded-lg text-sm lg:text-base font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>

        <DataTable
          data={categories || []}
          columns={columns}
          searchKeys={['name', 'slug']}
          searchPlaceholder="Search categories..."
          pageSize={10}
          emptyMessage="No categories found"
        />
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md mx-4 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-bold text-foreground">
                {editingCategory ? 'Edit Category' : 'New Category'}
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
                <label className="block text-sm font-medium mb-2 text-foreground">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
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
                  disabled={createCategory.isPending || updateCategory.isPending}
                  className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {(createCategory.isPending || updateCategory.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingCategory ? 'Update' : 'Create'}
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
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteConfirmation.categoryName}"? This action cannot be undone.`}
        confirmText="Delete Category"
        variant="danger"
        isLoading={deleteCategory.isPending}
      />
    </AdminShell>
  )
}
