import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
    component: SettingsPage,
})

function SettingsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-serif font-bold mb-8">Settings</h1>
            <div className="bg-secondary/20 p-8 rounded-xl border border-border">
                <p>Settings coming soon.</p>
            </div>
        </div>
    )
}
