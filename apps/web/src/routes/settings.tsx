import { createFileRoute, Link } from '@tanstack/react-router'
import { Settings, User, Lock, MapPin, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { authClient } from '../lib/auth-client'
import { useAddresses, useCreateAddress, useDeleteAddress } from '@nuur-fashion-commerce/api'
import { getFieldError } from '../lib/form-utils'

export const Route = createFileRoute('/settings')({
    component: SettingsPage,
})

const addressSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    addressLine1: z.string().min(1, 'Address is required'),
    addressLine2: z.string(),
    city: z.string().min(1, 'City is required'),
    state: z.string(),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
    phone: z.string(),
})

const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
})

function SettingsPage() {
    const { data: session, isPending: isSessionLoading } = authClient.useSession()
    const { data: addressesData, isLoading: isAddressesLoading } = useAddresses()
    const createAddress = useCreateAddress()
    const deleteAddress = useDeleteAddress()

    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'addresses'>('profile')
    const [showAddressForm, setShowAddressForm] = useState(false)

    const user = session?.user
    const addresses = addressesData || []

    // Profile Form
    const profileForm = useForm({
        defaultValues: {
            name: user?.name || '',
        },
        validators: {
            onChange: z.object({
                name: z.string().min(1, 'Name is required'),
            }),
        },
        onSubmit: async ({ value }) => {
            try {
                await authClient.updateUser({ name: value.name })
                toast.success('Profile updated!', {
                    description: 'Your changes have been saved.',
                })
            } catch (err) {
                toast.error('Failed to update profile')
            }
        },
    })

    // Password Form
    const passwordForm = useForm({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validators: {
            onChange: passwordSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                await authClient.changePassword({
                    currentPassword: value.currentPassword,
                    newPassword: value.newPassword,
                })
                toast.success('Password updated!', {
                    description: 'Your password has been changed.',
                })
                passwordForm.reset()
            } catch (err) {
                toast.error('Failed to update password', {
                    description: (err as Error).message,
                })
            }
        },
    })

    // Address Form
    const addressForm = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
            phone: '',
        },
        validators: {
            onChange: addressSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                await createAddress.mutateAsync({
                    firstName: value.firstName,
                    lastName: value.lastName,
                    addressLine1: value.addressLine1,
                    addressLine2: value.addressLine2 || undefined,
                    city: value.city,
                    state: value.state || undefined,
                    postalCode: value.postalCode,
                    country: value.country,
                    phone: value.phone || undefined,
                    type: 'shipping',
                })
                toast.success('Address added!', {
                    description: 'Your new address has been saved.',
                })
                setShowAddressForm(false)
                addressForm.reset()
            } catch (err) {
                toast.error('Failed to add address')
            }
        },
    })

    const handleDeleteAddress = async (addressId: string) => {
        try {
            await deleteAddress.mutateAsync(addressId)
            toast.success('Address deleted')
        } catch (err) {
            toast.error('Failed to delete address')
        }
    }

    if (isSessionLoading) {
        return (
            <div className="min-h-screen pt-10">
                <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-pulse space-y-6">
                            <div className="h-10 bg-secondary rounded w-48" />
                            <div className="h-64 bg-secondary rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen pt-10">
                <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center py-20">
                        <Settings className="w-16 h-16 mx-auto mb-6 text-foreground/30" />
                        <h1 className="text-2xl font-serif font-semibold mb-3">Sign in to access settings</h1>
                        <Link
                            to="/auth/login"
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-10">
            <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Back Link */}
                    <Link to="/profile" className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8">
                        <ArrowLeft className="w-4 h-4" />
                        Back to profile
                    </Link>

                    <div className="flex items-center gap-3 mb-8">
                        <Settings className="w-8 h-8 text-primary" />
                        <h1 className="font-serif text-4xl font-bold">Settings</h1>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-8 border-b border-border">
                        {[
                            { id: 'profile', label: 'Profile', icon: User },
                            { id: 'security', label: 'Security', icon: Lock },
                            { id: 'addresses', label: 'Addresses', icon: MapPin },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-foreground/60 hover:text-foreground'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                profileForm.handleSubmit()
                            }}
                            className="bg-card rounded-xl border border-border p-6 space-y-6"
                        >
                            <profileForm.Field name="name">
                                {(field) => (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Display Name</label>
                                        <input
                                            type="text"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${field.state.meta.errorMap['onChange'] ? 'border-destructive' : 'border-border'
                                                }`}
                                            placeholder="Your name"
                                        />
                                        {field.state.meta.errorMap['onChange'] && (
                                            <p className="text-sm text-destructive mt-1">{getFieldError(field.state.meta.errorMap['onChange'])}</p>
                                        )}
                                    </div>
                                )}
                            </profileForm.Field>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={user.email || ''}
                                    disabled
                                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground/60"
                                />
                                <p className="text-sm text-foreground/50 mt-1">Email cannot be changed</p>
                            </div>
                            <profileForm.Subscribe selector={(state) => state.isSubmitting}>
                                {(isSubmitting) => (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </button>
                                )}
                            </profileForm.Subscribe>
                        </form>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                passwordForm.handleSubmit()
                            }}
                            className="bg-card rounded-xl border border-border p-6 space-y-6"
                        >
                            <passwordForm.Field name="currentPassword">
                                {(field) => (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${field.state.meta.errorMap['onChange'] ? 'border-destructive' : 'border-border'
                                                }`}
                                            placeholder="••••••••"
                                        />
                                        {field.state.meta.errorMap['onChange'] && (
                                            <p className="text-sm text-destructive mt-1">{getFieldError(field.state.meta.errorMap['onChange'])}</p>
                                        )}
                                    </div>
                                )}
                            </passwordForm.Field>
                            <passwordForm.Field name="newPassword">
                                {(field) => (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">New Password</label>
                                        <input
                                            type="password"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${field.state.meta.errorMap['onChange'] ? 'border-destructive' : 'border-border'
                                                }`}
                                            placeholder="••••••••"
                                        />
                                        {field.state.meta.errorMap['onChange'] && (
                                            <p className="text-sm text-destructive mt-1">{getFieldError(field.state.meta.errorMap['onChange'])}</p>
                                        )}
                                    </div>
                                )}
                            </passwordForm.Field>
                            <passwordForm.Field name="confirmPassword">
                                {(field) => (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${field.state.meta.errorMap['onChange'] ? 'border-destructive' : 'border-border'
                                                }`}
                                            placeholder="••••••••"
                                        />
                                        {field.state.meta.errorMap['onChange'] && (
                                            <p className="text-sm text-destructive mt-1">{getFieldError(field.state.meta.errorMap['onChange'])}</p>
                                        )}
                                    </div>
                                )}
                            </passwordForm.Field>
                            <passwordForm.Subscribe selector={(state) => state.isSubmitting}>
                                {(isSubmitting) => (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Updating...' : 'Update Password'}
                                    </button>
                                )}
                            </passwordForm.Subscribe>
                        </form>
                    )}

                    {/* Addresses Tab */}
                    {activeTab === 'addresses' && (
                        <div className="space-y-4">
                            {/* Add Address Button */}
                            {!showAddressForm && (
                                <button
                                    onClick={() => setShowAddressForm(true)}
                                    className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add new address
                                </button>
                            )}

                            {/* Add Address Form */}
                            {showAddressForm && (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        addressForm.handleSubmit()
                                    }}
                                    className="bg-card rounded-xl border border-border p-6 space-y-4"
                                >
                                    <h3 className="font-semibold mb-4">Add New Address</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <addressForm.Field name="firstName">
                                            {(field) => (
                                                <input
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    placeholder="First Name *"
                                                    className={`px-4 py-3 bg-background border rounded-lg ${field.state.meta.errorMap['onChange'] ? 'border-destructive' : 'border-border'
                                                        }`}
                                                />
                                            )}
                                        </addressForm.Field>
                                        <addressForm.Field name="lastName">
                                            {(field) => (
                                                <input
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    placeholder="Last Name *"
                                                    className={`px-4 py-3 bg-background border rounded-lg ${field.state.meta.errorMap['onChange'] ? 'border-destructive' : 'border-border'
                                                        }`}
                                                />
                                            )}
                                        </addressForm.Field>
                                    </div>
                                    <addressForm.Field name="addressLine1">
                                        {(field) => (
                                            <input
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                placeholder="Address Line 1 *"
                                                className={`w-full px-4 py-3 bg-background border rounded-lg ${field.state.meta.errorMap['onChange'] ? 'border-destructive' : 'border-border'
                                                    }`}
                                            />
                                        )}
                                    </addressForm.Field>
                                    <addressForm.Field name="addressLine2">
                                        {(field) => (
                                            <input
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                placeholder="Address Line 2 (optional)"
                                                className="w-full px-4 py-3 bg-background border border-border rounded-lg"
                                            />
                                        )}
                                    </addressForm.Field>
                                    <div className="grid grid-cols-2 gap-4">
                                        <addressForm.Field name="city">
                                            {(field) => (
                                                <input
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    placeholder="City *"
                                                    className={`px-4 py-3 bg-background border rounded-lg ${field.state.meta.errorMap['onChange'] ? 'border-destructive' : 'border-border'
                                                        }`}
                                                />
                                            )}
                                        </addressForm.Field>
                                        <addressForm.Field name="state">
                                            {(field) => (
                                                <input
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    placeholder="State/Province"
                                                    className="px-4 py-3 bg-background border border-border rounded-lg"
                                                />
                                            )}
                                        </addressForm.Field>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <addressForm.Field name="postalCode">
                                            {(field) => (
                                                <input
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    placeholder="Postal Code *"
                                                    className={`px-4 py-3 bg-background border rounded-lg ${field.state.meta.errorMap['onChange'] ? 'border-destructive' : 'border-border'
                                                        }`}
                                                />
                                            )}
                                        </addressForm.Field>
                                        <addressForm.Field name="country">
                                            {(field) => (
                                                <input
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    placeholder="Country *"
                                                    className={`px-4 py-3 bg-background border rounded-lg ${field.state.meta.errorMap['onChange'] ? 'border-destructive' : 'border-border'
                                                        }`}
                                                />
                                            )}
                                        </addressForm.Field>
                                    </div>
                                    <addressForm.Field name="phone">
                                        {(field) => (
                                            <input
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                placeholder="Phone (optional)"
                                                className="w-full px-4 py-3 bg-background border border-border rounded-lg"
                                            />
                                        )}
                                    </addressForm.Field>
                                    <div className="flex gap-3">
                                        <addressForm.Subscribe selector={(state) => state.isSubmitting}>
                                            {(isSubmitting) => (
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting || createAddress.isPending}
                                                    className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                                >
                                                    {isSubmitting || createAddress.isPending ? 'Saving...' : 'Save Address'}
                                                </button>
                                            )}
                                        </addressForm.Subscribe>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddressForm(false)
                                                addressForm.reset()
                                            }}
                                            className="px-6 py-3 text-foreground/60 hover:text-foreground"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Address List */}
                            {isAddressesLoading ? (
                                <div className="animate-pulse space-y-4">
                                    {[1, 2].map((i) => <div key={i} className="h-32 bg-secondary rounded-xl" />)}
                                </div>
                            ) : addresses.length === 0 ? (
                                <div className="text-center py-12 bg-secondary/20 rounded-xl border border-border">
                                    <MapPin className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
                                    <p className="text-foreground/60">No saved addresses yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {addresses.map((address: any) => (
                                        <div key={address.id} className="bg-card rounded-xl border border-border p-6 flex justify-between items-start">
                                            <div className="space-y-1">
                                                <p className="font-medium">{address.firstName} {address.lastName}</p>
                                                <p className="text-foreground/70 text-sm">{address.addressLine1}</p>
                                                {address.addressLine2 && <p className="text-foreground/70 text-sm">{address.addressLine2}</p>}
                                                <p className="text-foreground/70 text-sm">{address.city}, {address.state} {address.postalCode}</p>
                                                <p className="text-foreground/70 text-sm">{address.country}</p>
                                                {address.isDefault && (
                                                    <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded">Default</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleDeleteAddress(address.id)}
                                                disabled={deleteAddress.isPending}
                                                className="p-2 text-foreground/40 hover:text-destructive transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
