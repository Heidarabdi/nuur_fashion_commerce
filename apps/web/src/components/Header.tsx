import { Link } from '@tanstack/react-router'
import { Heart, ShoppingBag, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
            <Link
              to="/profile"
              className="hidden md:block text-sm font-medium px-4 py-2 hover:bg-secondary rounded-md transition-colors"
            >
              Account
            </Link>

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
