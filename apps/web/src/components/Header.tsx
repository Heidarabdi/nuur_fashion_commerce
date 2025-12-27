import { Link } from '@tanstack/react-router'
import { Heart, ShoppingBag, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { authClient } from '../lib/auth-client'
import { User, LogOut, Settings } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = authClient.useSession()

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <span className="font-serif text-2xl font-bold tracking-tight">Nuur</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/shop" className="text-sm font-medium hover:text-accent transition-colors">
              Shop
            </Link>
            <Link to="/collections" className="text-sm font-medium hover:text-accent transition-colors">
              Collections
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-accent transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button aria-label="Search" className="p-2 hover:bg-secondary rounded-md transition-colors">
              <Search size={20} />
            </button>
            <button aria-label="Wishlist" className="p-2 hover:bg-secondary rounded-md transition-colors">
              <Heart size={20} />
            </button>
            <Link to="/cart" className="p-2 hover:bg-secondary rounded-md transition-colors relative">
              <ShoppingBag size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </Link>
            {session ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-1 hover:bg-secondary rounded-full transition-colors">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-medium">
                    {session.user.name?.[0] || 'U'}
                  </div>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-medium truncate">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                  </div>
                  <div className="p-1">
                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary rounded-md">
                      <User size={16} /> Profile
                    </Link>
                    <Link to="/settings" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary rounded-md">
                      <Settings size={16} /> Settings
                    </Link>
                    <button
                      onClick={() => authClient.signOut()}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/auth/login" className="hidden md:block text-sm font-medium px-4 py-2 hover:bg-secondary rounded-md transition-colors">
                Sign In
              </Link>
            )}

            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden pb-4 pt-2 space-y-2">
            <Link to="/shop" className="block px-4 py-2 hover:bg-secondary rounded-md" onClick={() => setIsMenuOpen(false)}>
              Shop
            </Link>
            <Link
              to="/collections"
              className="block px-4 py-2 hover:bg-secondary rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Collections
            </Link>
            <Link
              to="/about"
              className="block px-4 py-2 hover:bg-secondary rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/profile"
              className="block px-4 py-2 hover:bg-secondary rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Account
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
