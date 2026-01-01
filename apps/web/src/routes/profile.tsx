import { Link, createFileRoute } from '@tanstack/react-router'
import { User, Mail, Calendar, Package, Settings, LogOut } from 'lucide-react'
import { authClient } from '../lib/auth-client'
import { useOrders } from '@nuur-fashion-commerce/api'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { data: session, isPending: isSessionLoading } = authClient.useSession()
  const { data: ordersData } = useOrders()

  const user = session?.user
  const orders = ordersData || []

  const handleSignOut = async () => {
    await authClient.signOut()
    window.location.href = '/'
  }

  if (isSessionLoading) {
    return (
      <div className="min-h-screen pt-10">
        <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-10 bg-secondary rounded w-48" />
              <div className="h-48 bg-secondary rounded-2xl" />
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
            <User className="w-16 h-16 mx-auto mb-6 text-foreground/30" />
            <h1 className="text-2xl font-serif font-semibold mb-3">Sign in to view your profile</h1>
            <p className="text-foreground/60 mb-8">
              Access your account to manage your profile, orders, and settings.
            </p>
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
          <h1 className="font-serif text-4xl font-bold mb-12">My Profile</h1>

          {/* Profile Card */}
          <div className="bg-card rounded-2xl border border-border p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || 'Profile'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-serif font-bold text-primary">
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </span>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-1">{user.name || 'Valued Customer'}</h2>
                <div className="flex items-center gap-2 text-foreground/60 mb-4">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/50 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-full text-sm font-medium transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link
              to="/orders"
              className="flex items-center gap-4 p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">My Orders</h3>
                <p className="text-sm text-foreground/60">{orders.length} orders</p>
              </div>
            </Link>

            <Link
              to="/wishlist"
              className="flex items-center gap-4 p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Wishlist</h3>
                <p className="text-sm text-foreground/60">Saved items</p>
              </div>
            </Link>

            <Link
              to="/settings"
              className="flex items-center gap-4 p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Settings</h3>
                <p className="text-sm text-foreground/60">Account & preferences</p>
              </div>
            </Link>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-foreground/60 hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
