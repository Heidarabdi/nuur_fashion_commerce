import { createFileRoute } from '@tanstack/react-router'
import { AdminShell } from '../../components/AdminShell'

export const Route = createFileRoute('/admin/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <AdminShell>
      <div className="space-y-6">
        <h1 className="text-2xl lg:text-4xl font-serif font-bold text-foreground">Settings</h1>

        <div className="bg-card p-4 lg:p-6 rounded-lg border border-border shadow-sm">
          <h2 className="text-xl lg:text-2xl font-serif font-bold mb-4 lg:mb-6 text-foreground">Store Information</h2>
          <div className="space-y-4">
            <LabeledInput label="Store Name" defaultValue="Nuur Fashion" type="text" />
            <LabeledInput label="Email" defaultValue="info@nuur.com" type="email" />
            <LabeledInput label="Phone" defaultValue="+1 234 567 8900" type="tel" />
            <button className="bg-accent text-accent-foreground px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base rounded-lg font-medium hover:bg-accent/90 transition-colors">
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-card p-4 lg:p-6 rounded-lg border border-border shadow-sm">
          <h2 className="text-xl lg:text-2xl font-serif font-bold mb-4 lg:mb-6 text-foreground">Payment Methods</h2>
          <div className="space-y-3">
            <ToggleRow label="Stripe" defaultChecked />
            <ToggleRow label="PayPal" />
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

function LabeledInput({ label, defaultValue, type }: { label: string; defaultValue: string; type: string }) {
  return (
    <div>
      <label className="block text-xs lg:text-sm font-medium mb-2 text-foreground">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  )
}

function ToggleRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 lg:p-4 border border-border rounded-lg bg-background">
      <span className="text-sm lg:text-base font-medium text-foreground">{label}</span>
      <label className="flex items-center">
        <input type="checkbox" defaultChecked={defaultChecked} className="rounded border-border text-accent focus:ring-accent" />
      </label>
    </div>
  )
}
