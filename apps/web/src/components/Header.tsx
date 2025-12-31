import { Link, useNavigate } from '@tanstack/react-router'
import { Heart, ShoppingBag, Search, Menu, X, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { authClient } from '../lib/auth-client'

export default function Header() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { data: session } = authClient.useSession()

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate({ to: '/shop', search: { search: searchQuery.trim() } })
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <span className="font-serif text-2xl font-bold tracking-tight">Nuur</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/shop" className="text-sm font-medium hover:text-accent transition-colors">
              Shop
            </Link>
            <Link to="/new-arrivals" className="text-sm font-medium hover:text-accent transition-colors">
              New Arrivals
            </Link>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium hover:text-accent transition-colors">
                Categories
                <ChevronDown size={14} />
              </button>
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="w-40 bg-background border border-border rounded-lg shadow-lg py-1">
                  <Link to="/category/$slug" params={{ slug: 'men' }} className="block px-4 py-2 text-sm hover:bg-secondary transition-colors">
                    Men
                  </Link>
                  <Link to="/category/$slug" params={{ slug: 'women' }} className="block px-4 py-2 text-sm hover:bg-secondary transition-colors">
                    Women
                  </Link>
                  <Link to="/category/$slug" params={{ slug: 'kids' }} className="block px-4 py-2 text-sm hover:bg-secondary transition-colors">
                    Kids
                  </Link>
                  <Link to="/category/$slug" params={{ slug: 'accessories' }} className="block px-4 py-2 text-sm hover:bg-secondary transition-colors">
                    Accessories
                  </Link>
                </div>
              </div>
            </div>

            <Link to="/about" className="text-sm font-medium hover:text-accent transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {/* Search */}
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-40 md:w-64 px-3 py-1.5 text-sm bg-secondary border border-border rounded-l-md focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <button type="submit" className="px-3 py-1.5 bg-accent text-accent-foreground rounded-r-md">
                  <Search size={18} />
                </button>
                <button type="button" onClick={() => setIsSearchOpen(false)} className="ml-2 p-1.5 hover:bg-secondary rounded-md">
                  <X size={18} />
                </button>
              </form>
            ) : (
              <button onClick={() => setIsSearchOpen(true)} aria-label="Search" className="p-2 hover:bg-secondary rounded-md transition-colors">
                <Search size={20} />
              </button>
            )}

            <Link to="/wishlist" aria-label="Wishlist" className="p-2 hover:bg-secondary rounded-md transition-colors">
              <Heart size={20} />
            </Link>
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 pt-2 space-y-2">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center px-2 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-3 py-2 text-sm bg-secondary border border-border rounded-l-md focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button type="submit" className="px-4 py-2 bg-accent text-accent-foreground rounded-r-md">
                <Search size={18} />
              </button>
            </form>

            <Link to="/shop" className="block px-4 py-2 hover:bg-secondary rounded-md" onClick={() => setIsMenuOpen(false)}>
              Shop
            </Link>
            <Link to="/new-arrivals" className="block px-4 py-2 hover:bg-secondary rounded-md" onClick={() => setIsMenuOpen(false)}>
              New Arrivals
            </Link>
            <Link to="/category/$slug" params={{ slug: 'men' }} className="block px-4 py-2 hover:bg-secondary rounded-md" onClick={() => setIsMenuOpen(false)}>
              Men
            </Link>
            <Link to="/category/$slug" params={{ slug: 'women' }} className="block px-4 py-2 hover:bg-secondary rounded-md" onClick={() => setIsMenuOpen(false)}>
              Women
            </Link>
            <Link to="/category/$slug" params={{ slug: 'kids' }} className="block px-4 py-2 hover:bg-secondary rounded-md" onClick={() => setIsMenuOpen(false)}>
              Kids
            </Link>
            <Link to="/about" className="block px-4 py-2 hover:bg-secondary rounded-md" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link to="/profile" className="block px-4 py-2 hover:bg-secondary rounded-md" onClick={() => setIsMenuOpen(false)}>
              Account
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
