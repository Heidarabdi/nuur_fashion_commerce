import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/returns')({
  component: ReturnsPage,
})

function ReturnsPage() {
  return (
    <div className="min-h-screen pt-10 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-16 space-y-4">
        <h1 className="font-serif text-4xl font-bold">Returns</h1>
        <p className="text-foreground/70">Policies for returns and exchanges.</p>
      </div>
    </div>
  )
}
