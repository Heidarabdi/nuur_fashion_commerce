import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '../../lib/auth-client'
import { useMutation } from '@tanstack/react-query'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaFacebook } from 'react-icons/fa'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      })
      if (error) throw new Error(error.message || 'Failed to login')
      return data
    },
    onSuccess: () => {
      navigate({ to: '/' })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-8 bg-background border border-border rounded-xl shadow-sm">
        <h1 className="text-2xl font-serif font-bold text-center mb-6">Welcome Back</h1>

        {loginMutation.isError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 italic">
            {(loginMutation.error as Error).message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-2 bg-black text-white rounded-md font-medium hover:bg-black/90 transition-colors disabled:opacity-50"
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
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
