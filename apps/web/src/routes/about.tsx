import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="min-h-screen pt-10 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-16">
        <h1 className="font-serif text-4xl font-bold mb-4">About</h1>
        <p className="text-foreground/70">Learn more about Nuur and our story.</p>
      </div>
    </div>
  )
}
