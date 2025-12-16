import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/shipping')({
  component: ShippingPage,
})

function ShippingPage() {
  return (
    <div className="min-h-screen pt-10 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-16 space-y-4">
        <h1 className="font-serif text-4xl font-bold">Shipping</h1>
        <p className="text-foreground/70">Information about delivery options, costs, and timelines.</p>
      </div>
    </div>
  )
}
