import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { authClient } from '../../lib/auth-client'
import { getFieldError } from '../../lib/form-utils'
import { useState } from 'react'

export const Route = createFileRoute('/auth/forgot-password')({
    component: ForgotPasswordPage,
})

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email'),
})

function ForgotPasswordPage() {
    const [isSubmitted, setIsSubmitted] = useState(false)

    const form = useForm({
        defaultValues: {
            email: '',
        },
        validators: {
            onChange: forgotPasswordSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                const { error } = await authClient.requestPasswordReset({
                    email: value.email,
                    redirectTo: '/auth/reset-password',
                })
                if (error) throw new Error(error.message || 'Failed to send reset email')

                setIsSubmitted(true)
                toast.success('Reset email sent!', {
                    description: 'Check your inbox for a password reset link.',
                })
            } catch (err) {
                toast.error('Failed to send reset email', {
                    description: (err as Error).message,
                })
            }
        },
    })

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                <div className="w-full max-w-md p-8 bg-background border border-border rounded-xl shadow-sm text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-serif font-bold mb-2">Check Your Email</h1>
                    <p className="text-muted-foreground mb-6">
                        We've sent a password reset link to your email address. Click the link in the email to reset your password.
                    </p>
                    <Link
                        to="/auth/login"
                        className="text-accent hover:underline"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div className="w-full max-w-md p-8 bg-background border border-border rounded-xl shadow-sm">
                <h1 className="text-2xl font-serif font-bold text-center mb-2">Forgot Password</h1>
                <p className="text-muted-foreground text-center mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="space-y-4"
                >
                    <form.Field name="email">
                        {(field) => (
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    className={`w-full px-4 py-2 bg-secondary/50 border rounded-md focus:outline-none focus:ring-1 focus:ring-accent ${field.state.meta.errors.length ? 'border-destructive' : 'border-border'
                                        }`}
                                    placeholder="you@example.com"
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
                                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        )}
                    </form.Subscribe>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Remember your password?{' '}
                    <Link to="/auth/login" className="text-accent hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
