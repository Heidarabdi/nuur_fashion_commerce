import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/web')({
  component: WebPage,
})

function WebPage() {
  return (
    <div className="min-h-screen bg-white p-6">
      <h1>Web Application</h1>
    </div>
  )
}