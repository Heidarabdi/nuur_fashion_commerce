import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { AdminShell } from '../../../components/AdminShell'
import { useCategories, useBrands, useCreateProduct } from '@nuur-fashion-commerce/api'
import { toast } from 'sonner'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { getFieldError } from '../../../lib/form-utils'
import { ImageUploader } from '../../../components/ImageUploader'

export const Route = createFileRoute('/admin/products/new')({
    component: NewProductPage,
})

const productSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().min(1, 'Description is required'),
    price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
    compareAtPrice: z.coerce.number().min(0).optional(),
    categoryId: z.string().optional(),
    brandId: z.string().optional(),
    status: z.enum(['active', 'draft', 'archived']),
})

type ProductFormValues = z.infer<typeof productSchema>

function NewProductPage() {
    const navigate = useNavigate()
    const createProduct = useCreateProduct()
    const { data: categories } = useCategories()
    const { data: brands } = useBrands()
    const [imageUrls, setImageUrls] = useState<string[]>([])

    const form = useForm({
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            compareAtPrice: undefined,
            categoryId: undefined,
            brandId: undefined,
            status: 'draft',
        } as ProductFormValues,
        validators: {
            onChange: productSchema as any,
        },
        onSubmit: async ({ value }) => {
            try {
                await createProduct.mutateAsync({
                    ...value,
                    categoryId: value.categoryId || undefined,
                    brandId: value.brandId || undefined,
                    images: imageUrls,
                })
                toast.success('Product created', { description: `${value.name} has been added.` })
                navigate({ to: '/admin/products' })
            } catch (err) {
                toast.error('Failed to create product', { description: (err as Error).message })
            }
        },
    })

    return (
        <AdminShell>
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        to="/admin/products"
                        className="p-2 hover:bg-secondary rounded-md transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl lg:text-4xl font-serif font-bold text-foreground">New Product</h1>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="space-y-6"
                >
                    {/* Basic Info Card */}
                    <div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>

                        <form.Field name="name">
                            {(field) => (
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        placeholder="Enter product name"
                                        className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                        <p className="text-destructive text-sm mt-1">{getFieldError(field.state.meta.errors)}</p>
                                    )}
                                </div>
                            )}
                        </form.Field>

                        <form.Field name="description">
                            {(field) => (
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground">
                                        Description *
                                    </label>
                                    <textarea
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        placeholder="Enter product description"
                                        rows={4}
                                        className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                    />
                                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                        <p className="text-destructive text-sm mt-1">{getFieldError(field.state.meta.errors)}</p>
                                    )}
                                </div>
                            )}
                        </form.Field>
                    </div>

                    {/* Pricing Card */}
                    <div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-foreground">Pricing</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <form.Field name="price">
                                {(field) => (
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-foreground">
                                            Price *
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={field.state.value || ''}
                                                onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
                                                onBlur={field.handleBlur}
                                                placeholder="0.00"
                                                className="w-full pl-8 pr-4 py-3 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                            <p className="text-destructive text-sm mt-1">{getFieldError(field.state.meta.errors)}</p>
                                        )}
                                    </div>
                                )}
                            </form.Field>

                            <form.Field name="compareAtPrice">
                                {(field) => (
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-foreground">
                                            Compare at Price
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={field.state.value || ''}
                                                onChange={(e) => field.handleChange(parseFloat(e.target.value) || undefined)}
                                                onBlur={field.handleBlur}
                                                placeholder="0.00"
                                                className="w-full pl-8 pr-4 py-3 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                    </div>
                                )}
                            </form.Field>
                        </div>
                    </div>

                    {/* Organization Card */}
                    <div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-foreground">Organization</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <form.Field name="categoryId">
                                {(field) => (
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-foreground">
                                            Category
                                        </label>
                                        <select
                                            value={field.state.value || ''}
                                            onChange={(e) => field.handleChange(e.target.value || undefined)}
                                            className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            <option value="">Select a category</option>
                                            {categories?.map((cat: any) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </form.Field>

                            <form.Field name="brandId">
                                {(field) => (
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-foreground">
                                            Brand
                                        </label>
                                        <select
                                            value={field.state.value || ''}
                                            onChange={(e) => field.handleChange(e.target.value || undefined)}
                                            className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            <option value="">Select a brand</option>
                                            {brands?.map((brand: any) => (
                                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </form.Field>

                            <form.Field name="status">
                                {(field) => (
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-foreground">
                                            Status
                                        </label>
                                        <select
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value as ProductFormValues['status'])}
                                            className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="active">Active</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                    </div>
                                )}
                            </form.Field>
                        </div>
                    </div>

                    {/* Images Card */}
                    <div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-foreground">Images</h2>
                        <ImageUploader
                            images={imageUrls}
                            onImagesChange={setImageUrls}
                            maxImages={10}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Link
                            to="/admin/products"
                            className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-secondary transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={createProduct.isPending}
                            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {createProduct.isPending && <Loader2 className="animate-spin" size={18} />}
                            Create Product
                        </button>
                    </div>
                </form>
            </div>
        </AdminShell>
    )
}
