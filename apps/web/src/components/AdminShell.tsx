import { Link, useRouterState } from '@tanstack/react-router'
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, Menu, X, FolderTree, Tag, Home, LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { AdminGuard } from './AdminGuard'

interface NavItem {
  to: string
  icon: LucideIcon
  label: string
  matchPrefix?: boolean // true = match path prefix, false = exact match
}

const mainNavItems: NavItem[] = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: Package, label: 'Products', matchPrefix: true },
  { to: '/admin/categories', icon: FolderTree, label: 'Categories' },
  { to: '/admin/brands', icon: Tag, label: 'Brands' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders', matchPrefix: true },
  { to: '/admin/customers', icon: Users, label: 'Customers' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
]

const settingsNavItems: NavItem[] = [
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { location } = useRouterState()
  const currentPath = location.pathname

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const isActive = (item: NavItem) =>
    item.matchPrefix ? currentPath.startsWith(item.to) : currentPath === item.to

  return (
    <AdminGuard>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Mobile overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={closeMobileMenu} />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 
          bg-card border-r border-border flex flex-col
          transform transition-transform duration-200 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-0
        `}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-serif font-bold text-foreground">Nuur Admin</h2>
            <button className="lg:hidden text-muted-foreground hover:text-foreground" onClick={closeMobileMenu}>
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {mainNavItems.map((item) => (
              <NavLink key={item.to} item={item} isActive={isActive(item)} onClick={closeMobileMenu} />
            ))}

            <div className="pt-4 mt-4 border-t border-border space-y-1">
              {settingsNavItems.map((item) => (
                <NavLink key={item.to} item={item} isActive={isActive(item)} onClick={closeMobileMenu} />
              ))}
            </div>
          </nav>

          {/* Back to Store */}
          <div className="p-4 border-t border-border">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
              <Home size={18} />
              Back to Store
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <header className="bg-card border-b border-border px-4 py-3 lg:px-6 lg:py-4 shrink-0">
            <div className="flex items-center gap-4">
              <button className="lg:hidden text-foreground p-1" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={24} />
              </button>
              <h1 className="text-lg lg:text-xl font-serif font-semibold text-foreground">Admin Panel</h1>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </AdminGuard>
  )
}

function NavLink({ item, isActive, onClick }: { item: NavItem; isActive: boolean; onClick: () => void }) {
  const Icon = item.icon
  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
        ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}
      `}
    >
      <Icon size={18} />
      {item.label}
    </Link>
  )
}
