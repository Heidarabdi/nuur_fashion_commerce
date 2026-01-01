import { Link } from '@tanstack/react-router'
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, Menu, X, FolderTree, Tag } from 'lucide-react'
import { useState } from 'react'
import { AdminGuard } from './AdminGuard'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-background">
        {isMobileMenuOpen && <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}

        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primary text-primary-foreground p-6 transform transition-transform lg:transform-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0`}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold">Nuur Admin</h2>
            <button className="lg:hidden text-primary-foreground" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <nav className="space-y-2">
            <NavItem to="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" setIsMobileMenuOpen={setIsMobileMenuOpen} primary />
            <NavItem to="/admin/products" icon={<Package size={18} />} label="Products" setIsMobileMenuOpen={setIsMobileMenuOpen} />
            <NavItem to="/admin/categories" icon={<FolderTree size={18} />} label="Categories" setIsMobileMenuOpen={setIsMobileMenuOpen} />
            <NavItem to="/admin/brands" icon={<Tag size={18} />} label="Brands" setIsMobileMenuOpen={setIsMobileMenuOpen} />
            <NavItem to="/admin/orders" icon={<ShoppingCart size={18} />} label="Orders" setIsMobileMenuOpen={setIsMobileMenuOpen} />
            <NavItem to="/admin/customers" icon={<Users size={18} />} label="Customers" setIsMobileMenuOpen={setIsMobileMenuOpen} />
            <NavItem to="/admin/analytics" icon={<BarChart3 size={18} />} label="Analytics" setIsMobileMenuOpen={setIsMobileMenuOpen} />
            <NavItem to="/admin/settings" icon={<Settings size={18} />} label="Settings" setIsMobileMenuOpen={setIsMobileMenuOpen} />
          </nav>
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <header className="bg-card border-b border-border p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="lg:hidden text-card-foreground" onClick={() => setIsMobileMenuOpen(true)}>
                  <Menu size={24} />
                </button>
                <h1 className="text-xl lg:text-2xl font-serif font-bold text-card-foreground">Admin Panel</h1>
              </div>
              <Link to="/" className="text-xs lg:text-sm text-muted-foreground hover:text-accent transition-colors">
                View Store
              </Link>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </AdminGuard>
  )
}

function NavItem({ to, icon, label, setIsMobileMenuOpen, primary }: { to: string; icon: React.ReactNode; label: string; setIsMobileMenuOpen: (v: boolean) => void; primary?: boolean }) {
  const base = 'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors'
  const style = primary ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'hover:bg-primary-foreground/10'
  return (
    <Link to={to} className={`${base} ${style}`} onClick={() => setIsMobileMenuOpen(false)}>
      {icon}
      {label}
    </Link>
  )
}
