import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { authClient } from '../../lib/auth-client'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaFacebook } from 'react-icons/fa'

export const Route = createFileRoute('/auth/signup')({
  component: SignUpPage,
})

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

function SignUpPage() {
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const { error } = await authClient.signUp.email({
          email: value.email,
          password: value.password,
          name: value.name,
        })
        if (error) throw new Error(error.message || 'Failed to sign up')

        toast.success('Account created!', {
          description: 'Welcome to Nuur Fashion Commerce.',
        })
        navigate({ to: '/' })
      } catch (err) {
        toast.error('Sign up failed', {
          description: (err as Error).message,
        })
      }
    },
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-8 bg-background border border-border rounded-xl shadow-sm">
        <h1 className="text-2xl font-serif font-bold text-center mb-2">Create Account</h1>
        <p className="text-center text-muted-foreground text-sm mb-6">Join Nuur Fashion Commerce today</p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field name="name">
            {(field) => (
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={`w-full px-4 py-2 bg-secondary/50 border rounded-md focus:outline-none focus:ring-1 focus:ring-accent ${field.state.meta.errorMap['onChange'] ? 'border-destructive' : 'border-border'
                    }`}
                  placeholder="Your Name"
                />
                {field.state.meta.errorMap['onChange'] && (
                  <p className="text-sm text-destructive mt-1">{String(field.state.meta.errorMap['onChange'])}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={`w-full px-4 py-2 bg-secondary/50 border rounded-md focus:outline-none focus:ring-1 focus:ring-accent ${field.state.meta.errorMap['onChange'] ? 'border-destructive' : 'border-border'
                    }`}
                  placeholder="you@example.com"
                />
                {field.state.meta.errorMap['onChange'] && (
                  <p className="text-sm text-destructive mt-1">{String(field.state.meta.errorMap['onChange'])}</p>
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
                  className={`w-full px-4 py-2 bg-secondary/50 border rounded-md focus:outline-none focus:ring-1 focus:ring-accent ${field.state.meta.errorMap['onChange'] ? 'border-destructive' : 'border-border'
                    }`}
                  placeholder="••••••••"
                />
                {field.state.meta.errorMap['onChange'] && (
                  <p className="text-sm text-destructive mt-1">{String(field.state.meta.errorMap['onChange'])}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="confirmPassword">
            {(field) => (
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={`w-full px-4 py-2 bg-secondary/50 border rounded-md focus:outline-none focus:ring-1 focus:ring-accent ${field.state.meta.errorMap['onChange'] ? 'border-destructive' : 'border-border'
                    }`}
                  placeholder="••••••••"
                />
                {field.state.meta.errorMap['onChange'] && (
                  <p className="text-sm text-destructive mt-1">{String(field.state.meta.errorMap['onChange'])}</p>
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
                {isSubmitting ? 'Creating account...' : 'Create Account'}
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
          Already have an account?{' '}
          <Link to="/auth/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
