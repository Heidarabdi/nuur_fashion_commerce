import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1>Admin Dashboard</h1>
    </div>
  )
}