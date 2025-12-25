import { createFileRoute } from '@tanstack/react-router'
import { AdminShell } from '../../components/AdminShell'

export const Route = createFileRoute('/admin/analytics')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  return (
    <AdminShell>
      <div className="space-y-6">
        <h1 className="text-2xl lg:text-4xl font-serif font-bold text-foreground">Analytics</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <MetricCard label="Page Views" value="45,231" trend="+12.5% vs last week" trendClass="text-emerald-600" />
          <MetricCard label="Conversion Rate" value="3.24%" trend="+0.5% vs last week" trendClass="text-emerald-600" />
          <MetricCard label="Avg Order Value" value="$185.50" trend="-2.1% vs last week" trendClass="text-destructive" />
        </div>

        <div className="bg-card p-4 lg:p-6 rounded-lg border border-border shadow-sm">
          <h2 className="text-xl lg:text-2xl font-serif font-bold mb-4 lg:mb-6 text-foreground">Traffic Sources</h2>
          <div className="space-y-4">
            <TrafficRow label="Direct" percent="45%" width="45%" />
            <TrafficRow label="Organic Search" percent="35%" width="35%" />
            <TrafficRow label="Social Media" percent="20%" width="20%" />
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

function MetricCard({ label, value, trend, trendClass }: { label: string; value: string; trend: string; trendClass: string }) {
  return (
    <div className="bg-card p-4 lg:p-6 rounded-lg border border-border shadow-sm">
      <p className="text-muted-foreground text-xs lg:text-sm font-medium">{label}</p>
      <p className="text-2xl lg:text-3xl font-serif font-bold mt-2 text-foreground">{value}</p>
      <p className={`${trendClass} text-xs lg:text-sm mt-2`}>{trend}</p>
    </div>
  )
}

function TrafficRow({ label, percent, width }: { label: string; percent: string; width: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm lg:text-base text-foreground font-medium whitespace-nowrap">{label}</span>
      <div className="flex-1 mx-2 lg:mx-4 bg-muted rounded-full h-2">
        <div className="bg-accent h-2 rounded-full" style={{ width }}></div>
      </div>
      <span className="text-xs lg:text-sm text-muted-foreground font-medium whitespace-nowrap">{percent}</span>
    </div>
  )
}
