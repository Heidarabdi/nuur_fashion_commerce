import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/signup')({
  component: SignupPage,
})

function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!formData.firstName) setErrors((prev) => ({ ...prev, firstName: 'First name is required' }))
    if (!formData.lastName) setErrors((prev) => ({ ...prev, lastName: 'Last name is required' }))
    if (!formData.email) setErrors((prev) => ({ ...prev, email: 'Email is required' }))
    if (!formData.password) setErrors((prev) => ({ ...prev, password: 'Password is required' }))
    if (formData.password !== formData.confirmPassword)
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }))
  }

  return (
    <div className="min-h-screen pt-10 px-4 md:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-8 shadow-sm">
        <h1 className="font-serif text-3xl font-bold mb-4">Create Account</h1>
        <p className="text-foreground/60 mb-6">Join Nuur to start shopping</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${errors.firstName ? 'border-destructive' : 'border-border'}`}
                placeholder="John"
              />
              {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${errors.lastName ? 'border-destructive' : 'border-border'}`}
                placeholder="Doe"
              />
              {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${errors.password ? 'border-destructive' : 'border-border'}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${errors.confirmPassword ? 'border-destructive' : 'border-border'}`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors mt-6"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-foreground/60">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-accent font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <button className="w-full py-3 border border-border rounded-lg font-semibold hover:bg-secondary transition-colors">
            Sign up with Google
          </button>
        </div>
      </div>
    </div>
  )
}
