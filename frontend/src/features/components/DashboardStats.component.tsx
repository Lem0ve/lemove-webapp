import { useMemo } from 'react'
import { useHome } from '../Home.context'

export const DashboardStats = () => {
  const { partners } = useHome()

  const kpi = useMemo(() => {
    const total = partners.length
    const sent = partners.filter((partner) => partner.status === 'sent').length
    const confirmed = partners.filter((partner) => partner.status === 'confirmed' || partner.status === 'manual_done').length
    const open = total - confirmed
    return { total, sent, confirmed, open }
  }, [partners])

  // Progress could be displayed later as a bar; compute on demand then.

  const KPI = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
    </div>
  )

  const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
    <section className="space-y-3">
      <div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      {children}
    </section>
  )

  return (
    <div className="space-y-6">
      <Section title="Dashboard">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPI label="Gesamt" value={String(kpi.total)} hint="Anzahl Partner" />
          <KPI label="Gesendet" value={String(kpi.sent)} hint="ohne Rückmeldung" />
          <KPI label="Bestätigt" value={String(kpi.confirmed)} />
          <KPI label="Offen" value={String(kpi.open)} />
        </div>
      </Section>
    </div>
  )
}
