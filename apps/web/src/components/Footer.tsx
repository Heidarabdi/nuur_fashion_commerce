import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Nuur</h3>
            <p className="text-sm opacity-75">Curated fashion for the modern collector.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop" className="opacity-75 hover:opacity-100">
                  All Items
                </Link>
              </li>
              <li>
                <Link to="/collections" className="opacity-75 hover:opacity-100">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/sale" className="opacity-75 hover:opacity-100">
                  Sale
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Customer</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="opacity-75 hover:opacity-100">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="opacity-75 hover:opacity-100">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/returns" className="opacity-75 hover:opacity-100">
                  Returns
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Info</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="opacity-75 hover:opacity-100">
                  About
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="opacity-75 hover:opacity-100">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="opacity-75 hover:opacity-100">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="opacity-75">&copy; 2025 Nuur. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="opacity-75 hover:opacity-100">
              Instagram
            </a>
            <a href="#" className="opacity-75 hover:opacity-100">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
