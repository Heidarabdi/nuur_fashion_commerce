import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { authClient } from '../../lib/auth-client'
import { getFieldError } from '../../lib/form-utils'

export const Route = createFileRoute('/auth/reset-password')({
    component: ResetPasswordPage,
})

const resetPasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
})

function ResetPasswordPage() {
    const navigate = useNavigate()
    const searchParams = new URLSearchParams(window.location.search)
    const token = searchParams.get('token')

    const form = useForm({
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
        validators: {
            onChange: resetPasswordSchema,
        },
        onSubmit: async ({ value }) => {
            if (!token) {
                toast.error('Invalid reset link', {
                    description: 'Please request a new password reset.',
                })
                return
            }

            try {
                const { error } = await authClient.resetPassword({
                    newPassword: value.password,
                    token,
                })
                if (error) throw new Error(error.message || 'Failed to reset password')

                toast.success('Password reset successful!', {
                    description: 'You can now sign in with your new password.',
                })
                navigate({ to: '/auth/login' })
            } catch (err) {
                toast.error('Failed to reset password', {
                    description: (err as Error).message,
                })
            }
        },
    })

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                <div className="w-full max-w-md p-8 bg-background border border-border rounded-xl shadow-sm text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-serif font-bold mb-2">Invalid Reset Link</h1>
                    <p className="text-muted-foreground mb-6">
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <Link
                        to="/auth/forgot-password"
                        className="inline-block py-2 px-4 bg-black text-white rounded-md font-medium hover:bg-black/90 transition-colors"
                    >
                        Request New Link
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div className="w-full max-w-md p-8 bg-background border border-border rounded-xl shadow-sm">
                <h1 className="text-2xl font-serif font-bold text-center mb-2">Reset Password</h1>
                <p className="text-muted-foreground text-center mb-6">
                    Enter your new password below.
                </p>

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="space-y-4"
                >
                    {/* field names: password, confirmPassword */}

                    {/* Password Field */}
                    <form.Field name="password">
                        {(field) => (
                            <div>
                                <label className="block text-sm font-medium mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    className={`w-full px-4 py-2 bg-secondary/50 border rounded-md focus:outline-none focus:ring-1 focus:ring-accent ${field.state.meta.errors.length ? 'border-destructive' : 'border-border'
                                        }`}
                                    placeholder="••••••••"
                                />
                                {field.state.meta.errors.length > 0 && (
                                    <p className="text-sm text-destructive mt-1">{getFieldError(field.state.meta.errors)}</p>
                                )}
                            </div>
                        )}
                    </form.Field>

                    {/* Confirm Password Field */}
                    <form.Field name="confirmPassword">
                        {(field) => (
                            <div>
                                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    className={`w-full px-4 py-2 bg-secondary/50 border rounded-md focus:outline-none focus:ring-1 focus:ring-accent ${field.state.meta.errors.length ? 'border-destructive' : 'border-border'
                                        }`}
                                    placeholder="••••••••"
                                />
                                {field.state.meta.errors.length > 0 && (
                                    <p className="text-sm text-destructive mt-1">{getFieldError(field.state.meta.errors)}</p>
                                )}
                            </div>
                        )}
                    </form.Field>

                    <form.Subscribe selector={(state) => state.isSubmitting}>
                        {(isSubmitting) => (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-2 bg-black text-white rounded-md font-medium hover:bg-black/90 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? 'Resetting...' : 'Reset Password'}
                            </button>
                        )}
                    </form.Subscribe>
                </form>
            </div>
        </div>
    )
}
