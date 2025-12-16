import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!email) setErrors((prev) => ({ ...prev, email: 'Email is required' }))
    if (!password) setErrors((prev) => ({ ...prev, password: 'Password is required' }))
  }

  return (
    <div className="min-h-screen pt-10 px-4 md:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-8 shadow-sm">
        <h1 className="font-serif text-3xl font-bold mb-4">Sign In</h1>
        <p className="text-foreground/60 mb-6">Access your Nuur account</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${errors.email ? 'border-destructive' : 'border-border'}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${errors.password ? 'border-destructive' : 'border-border'}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
          </div>

          <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-foreground/60">
            Don't have an account?{' '}
            <Link to="/auth/signup" className="text-accent font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <button className="w-full py-3 border border-border rounded-lg font-semibold hover:bg-secondary transition-colors">
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  )
}
