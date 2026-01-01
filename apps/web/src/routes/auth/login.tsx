import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { authClient } from '../../lib/auth-client'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaFacebook } from 'react-icons/fa'
import { getFieldError } from '@/lib/form-utils'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

function LoginPage() {
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const { error, data } = await authClient.signIn.email({
          email: value.email,
          password: value.password,
        })
        if (error) throw new Error(error.message || 'Failed to login')

        toast.success('Welcome back!', {
          description: 'You have been signed in successfully.',
        })

        // Redirect admin users to admin dashboard
        if ((data?.user as any)?.role === 'admin') {
          navigate({ to: '/admin' })
        } else {
          navigate({ to: '/' })
        }
      } catch (err) {
        toast.error('Sign in failed', {
          description: (err as Error).message,
        })
      }
    },
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-8 bg-background border border-border rounded-xl shadow-sm">
        <h1 className="text-2xl font-serif font-bold text-center mb-6">Welcome Back</h1>

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

          <form.Field name="password">
            {(field) => (
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
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

          <div className="flex justify-end">
            <Link to="/auth/forgot-password" className="text-sm text-muted-foreground hover:text-accent">
              Forgot password?
            </Link>
          </div>

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-black text-white rounded-md font-medium hover:bg-black/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            )}
          </form.Subscribe>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => authClient.signIn.social({ provider: 'google' })}
            className="flex items-center justify-center py-2 border border-border rounded-md hover:bg-secondary transition-colors"
          >
            <FcGoogle className="w-5 h-5" />
          </button>
          <button
            onClick={() => authClient.signIn.social({ provider: 'github' })}
            className="flex items-center justify-center py-2 border border-border rounded-md hover:bg-secondary transition-colors"
          >
            <FaGithub className="w-5 h-5" />
          </button>
          <button
            onClick={() => authClient.signIn.social({ provider: 'facebook' })}
            className="flex items-center justify-center py-2 border border-border rounded-md hover:bg-secondary transition-colors text-blue-600"
          >
            <FaFacebook className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/auth/signup" className="text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
