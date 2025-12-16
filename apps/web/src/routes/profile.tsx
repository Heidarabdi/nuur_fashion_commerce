import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { LogOut, Edit2 } from 'lucide-react'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
  })

  return (
    <div className="min-h-screen">
      <div className="pt-24 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl font-bold mb-12">My Account</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <aside className="md:col-span-1">
              <nav className="space-y-2">
                <a href="#profile" className="block px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium">
                  Profile
                </a>
                <a href="#orders" className="block px-4 py-3 hover:bg-secondary rounded-lg font-medium transition-colors">
                  Orders
                </a>
                <a href="#addresses" className="block px-4 py-3 hover:bg-secondary rounded-lg font-medium transition-colors">
                  Addresses
                </a>
                <a href="#wishlist" className="block px-4 py-3 hover:bg-secondary rounded-lg font-medium transition-colors">
                  Wishlist
                </a>
                <button className="w-full flex items-center gap-2 px-4 py-3 hover:bg-secondary rounded-lg font-medium transition-colors text-left">
                  <LogOut size={18} />
                  Sign Out
                </button>
              </nav>
            </aside>

            <div className="md:col-span-2 space-y-8">
              <section id="profile" className="bg-secondary rounded-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-serif text-2xl font-bold">Profile Information</h2>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                </div>

                {!isEditingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-foreground/60 mb-1">Full Name</p>
                      <p className="font-medium">
                        {profile.firstName} {profile.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60 mb-1">Email</p>
                      <p className="font-medium">{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60 mb-1">Phone</p>
                      <p className="font-medium">{profile.phone}</p>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">First Name</label>
                        <input type="text" defaultValue={profile.firstName} className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Last Name</label>
                        <input type="text" defaultValue={profile.lastName} className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email</label>
                      <input type="email" defaultValue={profile.email} className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Phone</label>
                      <input type="tel" defaultValue={profile.phone} className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="flex-1 py-3 border border-border rounded-lg font-semibold hover:bg-background transition-colors"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </form>
                )}
              </section>

              <section id="orders" className="bg-secondary rounded-lg p-8">
                <h2 className="font-serif text-2xl font-bold mb-6">Recent Orders</h2>
                <div className="space-y-4">
                  {[1, 2].map((order) => (
                    <div key={order} className="border border-border rounded-lg p-4 hover:bg-background transition-colors cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">Order #{1001 + order}</p>
                          <p className="text-sm text-foreground/60">Placed on Jan {20 + order}, 2025</p>
                        </div>
                        <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">Delivered</span>
                      </div>
                      <p className="text-sm">3 items • $1,299.00</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
