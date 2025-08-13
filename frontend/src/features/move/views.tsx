import { useMemo, useState } from 'react'
import { useMove } from './context'
import type { Address, Connection, ConnectionStatus, ProviderCategory } from './types'
import { CATEGORIES } from './types'
import { Building2, CalendarDays, Check, CheckCircle2, Circle, Search, Send, Trash2, Upload, Zap, Plus } from 'lucide-react'

function clsx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ')
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-gray-900">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

function KPI({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
    </div>
  )
}

function LabeledInput({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      {children}
    </label>
  )
}

function AddressFields({ value, onChange, prefix }: { value: Address; onChange: (a: Address) => void; prefix: string }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <LabeledInput label={`${prefix} – Straße & Nr.`}>
        <input
          value={value.street}
          onChange={(e) => onChange({ ...value, street: e.target.value })}
          className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Musterstraße 1"
        />
      </LabeledInput>
      <LabeledInput label={`${prefix} – PLZ`}>
        <input
          value={value.postalCode}
          onChange={(e) => onChange({ ...value, postalCode: e.target.value })}
          className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="12345"
        />
      </LabeledInput>
      <LabeledInput label={`${prefix} – Stadt`}>
        <input
          value={value.city}
          onChange={(e) => onChange({ ...value, city: e.target.value })}
          className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Hannover"
        />
      </LabeledInput>
    </div>
  )
}

function ProofUpload({ file, onFile }: { file: File | null | undefined; onFile: (f: File | null) => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-dashed border-gray-300 p-4">
      <div className="flex items-center gap-3">
        <Upload className="h-5 w-5 text-gray-600" />
        <div className="text-sm">
          <div className="font-medium text-gray-800">Ummeldebestätigung hochladen</div>
          <div className="text-gray-600">PDF/JPG, optional</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {file ? (
          <span className="truncate text-sm text-gray-700" title={file.name}>{file.name}</span>
        ) : (
          <span className="text-sm text-gray-500">Kein Dokument</span>
        )}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50">
          Datei wählen
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {file && (
          <button
            onClick={() => onFile(null)}
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Entfernen
          </button>
        )}
      </div>
    </div>
  )
}

function statusBadgeColor(s: ConnectionStatus) {
  switch (s) {
    case 'not_contacted':
      return 'bg-gray-100 text-gray-700 ring-1 ring-gray-200'
    case 'sent':
      return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
    case 'confirmed':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
    case 'manual_done':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
  }
}

function statusIcon(s: ConnectionStatus) {
  switch (s) {
    case 'not_contacted':
      return <Circle className="h-4 w-4" />
    case 'sent':
      return <Send className="h-4 w-4" />
    case 'confirmed':
      return <Check className="h-4 w-4" />
    case 'manual_done':
      return <CheckCircle2 className="h-4 w-4" />
  }
}

function StatusSelector({ value, onChange }: { value: ConnectionStatus; onChange: (s: ConnectionStatus) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button
        title="Nicht kontaktiert"
        onClick={() => onChange('not_contacted')}
        className={clsx('rounded-lg p-2 ring-1', value === 'not_contacted' ? 'ring-gray-400' : 'ring-transparent hover:bg-gray-50')}
      >
        <Circle className="h-4 w-4" />
      </button>
      <button
        title="Gesendet (ohne Rückmeldung)"
        onClick={() => onChange('sent')}
        className={clsx('rounded-lg p-2 ring-1', value === 'sent' ? 'ring-blue-400' : 'ring-transparent hover:bg-gray-50')}
      >
        <Send className="h-4 w-4" />
      </button>
      <button
        title="Bestätigt"
        onClick={() => onChange('confirmed')}
        className={clsx('rounded-lg p-2 ring-1', value === 'confirmed' ? 'ring-emerald-400' : 'ring-transparent hover:bg-gray-50')}
      >
        <Check className="h-4 w-4" />
      </button>
      <button
        title="Manuell erledigt"
        onClick={() => onChange('manual_done')}
        className={clsx('rounded-lg p-2 ring-1', value === 'manual_done' ? 'ring-emerald-400' : 'ring-transparent hover:bg-gray-50')}
      >
        <CheckCircle2 className="h-4 w-4" />
      </button>
    </div>
  )
}

function QuickChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50">
      {label}
    </button>
  )
}

function ConnectionCard({ item, onUpdate, onRemove }: { item: Connection; onUpdate: (patch: Partial<Connection>) => void; onRemove: () => void }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 p-4 shadow-sm">
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="text-base font-semibold text-gray-900">{item.name}</div>
          <button
            onClick={onRemove}
            className="rounded-xl border border-gray-300 p-2 text-gray-700 hover:bg-gray-50"
            title="Entfernen"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-1 text-xs text-gray-500">{item.category} · Kundennr.: {item.customerId || '–'}</div>
        <div className="mt-3">
          <span className={clsx('inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium', statusBadgeColor(item.status))}>
            {statusIcon(item.status)}
            {item.status === 'not_contacted' && 'Nicht kontaktiert'}
            {item.status === 'sent' && 'Gesendet'}
            {item.status === 'confirmed' && 'Bestätigt'}
            {item.status === 'manual_done' && 'Manuell erledigt'}
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-500">Status ändern</div>
        <StatusSelector value={item.status} onChange={(s) => onUpdate({ status: s })} />
      </div>
    </div>
  )
}

function AddConnectionForm({ onAdd, quickAdd }: { onAdd: (c: Omit<Connection, 'id' | 'status'> & { status?: ConnectionStatus }) => void; quickAdd: (preset: string, cat: ProviderCategory) => void }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ProviderCategory>('Bank')
  const [customerId, setCustomerId] = useState('')

  function submit() {
    if (!name.trim()) return
    onAdd({ name: name.trim(), category, customerId: customerId.trim() || undefined })
    setName('')
    setCustomerId('')
    setCategory('Bank')
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="md:col-span-5">
          <LabeledInput label="Name (z. B. Sparkasse, TK, o2)">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="z. B. ING, TK, o2"
            />
          </LabeledInput>
        </div>
        <div className="md:col-span-3">
          <LabeledInput label="Kategorie">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProviderCategory)}
              className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </LabeledInput>
        </div>
        <div className="md:col-span-3">
          <LabeledInput label="Kundennummer (optional)">
            <input
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="123456"
            />
          </LabeledInput>
        </div>
        <div className="md:col-span-1 flex items-end">
          <button onClick={submit} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500">Schnell hinzufügen:</span>
        <QuickChip label="Hausbank" onClick={() => quickAdd('Hausbank', 'Bank')} />
        <QuickChip label="Krankenversicherung" onClick={() => quickAdd('Krankenversicherung', 'Versicherung')} />
        <QuickChip label="Arbeitgeber" onClick={() => quickAdd('Arbeitgeber', 'Arbeitgeber')} />
        <QuickChip label="Internet (Telekom)" onClick={() => quickAdd('Telekom', 'Telekom')} />
        <QuickChip label="Strom" onClick={() => quickAdd('Strom', 'Energie')} />
        <QuickChip label="Fitnessstudio" onClick={() => quickAdd('Fitnessstudio', 'Gym')} />
      </div>
    </div>
  )
}

function ConnectionsBoard({
  items,
  onUpdate,
  onRemove,
  onAdd,
}: {
  items: Connection[]
  onUpdate: (id: string, patch: Partial<Connection>) => void
  onRemove: (id: string) => void
  onAdd: (c: Omit<Connection, 'id' | 'status'> & { status?: ConnectionStatus }) => void
}) {
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState<ProviderCategory | 'Alle'>('Alle')

  function quickAdd(preset: string, cat: ProviderCategory) {
    onAdd({ name: preset, category: cat })
  }

  const filtered = useMemo(() => {
    return items.filter((x) => {
      const matchesCat = activeCat === 'Alle' || x.category === activeCat
      const matchesQuery = !query || x.name.toLowerCase().includes(query.toLowerCase())
      return matchesCat && matchesQuery
    })
  }, [items, query, activeCat])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className={clsx('rounded-full px-3 py-1 text-xs', activeCat === 'Alle' ? 'bg-gray-900 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50')}
            onClick={() => setActiveCat('Alle')}
          >
            Alle
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={clsx('rounded-full px-3 py-1 text-xs', activeCat === c ? 'bg-gray-900 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50')}
              onClick={() => setActiveCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative max-w-sm flex-1 sm:flex-none">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suchen…"
            className="w-full rounded-xl border border-gray-300 p-2 pl-9 outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      <AddConnectionForm onAdd={onAdd} quickAdd={quickAdd} />

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 p-6 text-sm text-gray-600">
          Keine Einträge. Über das Formular oder die Schnellchips hinzufügen.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ConnectionCard key={r.id} item={r} onUpdate={(patch) => onUpdate(r.id, patch)} onRemove={() => onRemove(r.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

export function MoveView() {
  const { move, connections, actions, isDispatching } = useMove()

  // KPIs
  const kpi = useMemo(() => {
    const total = connections.length
    const sent = connections.filter((c) => c.status === 'sent').length
    const confirmed = connections.filter((c) => c.status === 'confirmed' || c.status === 'manual_done').length
    const open = total - confirmed
    return { total, sent, confirmed, open }
  }, [connections])

  const progress = useMemo(() => {
    if (connections.length === 0) return 0
    const done = connections.filter((c) => c.status === 'confirmed' || c.status === 'manual_done').length
    return Math.round((done / connections.length) * 100)
  }, [connections])

  const isAddressComplete = useMemo(() => {
    const filled = (x: Address) => x.street && x.postalCode && x.city
    return filled(move.oldAddress) && filled(move.newAddress)
  }, [move])

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gray-900 p-5">
        <div className="flex items-center gap-3 text-white">
          <Building2 className="h-6 w-6 text-white" />
          <h1 className="text-xl font-semibold tracking-tight text-white">lemove · Umzugs-Automatisierung (MVP)</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-white">
          <span className="opacity-90">Fortschritt</span>
          <div className="relative h-3 w-44 rounded-full bg-transparent ring-2 ring-white/90">
            <div className="absolute left-0 top-0 h-3 rounded-full bg-white transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="tabular-nums">{progress}%</span>
        </div>
      </header>

      {/* Overview / Dashboard */}
      <Section title="Übersicht" subtitle="Relevante Kennzahlen dieses Umzugs auf einen Blick.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPI label="Gesamt" value={String(kpi.total)} hint="Anzahl Verbindungen" />
          <KPI label="Gesendet" value={String(kpi.sent)} hint="ohne Rückmeldung" />
          <KPI label="Bestätigt" value={String(kpi.confirmed)} />
          <KPI label="Offen" value={String(kpi.open)} />
        </div>
      </Section>

      {/* Adresseingabe */}
      <Section title="Adressen & Datum" subtitle="Aktuelle und künftige Anschrift, optionales Umzugsdatum.">
        <div className="grid gap-5">
          <AddressFields prefix="Aktuell" value={move.oldAddress} onChange={(a) => actions.setMove({ oldAddress: a })} />
          <AddressFields prefix="Neu" value={move.newAddress} onChange={(a) => actions.setMove({ newAddress: a })} />
          <div className="max-w-xs">
            <LabeledInput label="Umzugsdatum (optional)">
              <div className="relative">
                <input
                  type="date"
                  value={move.moveDate ?? ''}
                  onChange={(e) => actions.setMove({ moveDate: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 p-2 pl-10 outline-none focus:ring-2 focus:ring-gray-900"
                />
                <CalendarDays className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </LabeledInput>
          </div>
        </div>
      </Section>

      {/* Proof-Upload (optional) */}
      <Section title="Ummeldebestätigung" subtitle="Optionaler Upload; kann später für Provider-Workflows genutzt werden.">
        <ProofUpload file={move.proofFile ?? null} onFile={(f) => actions.setMove({ proofFile: f })} />
      </Section>

      {/* Verbindungen */}
      <Section title="Verbindungen auswählen" subtitle="Betroffene Banken, Versicherungen, Energie/Telekom etc. hinzufügen, filtern und den Status pflegen.">
        <ConnectionsBoard
          items={connections}
          onUpdate={actions.updateConnection}
          onRemove={actions.removeConnection}
          onAdd={actions.addConnection}
        />
      </Section>

      {/* Hinweis */}
      <p className="text-xs text-gray-500">
        Status-Codierung: Grau = nicht kontaktiert · Blau = gesendet (ohne Rückmeldung) · Grün = bestätigt/manuell erledigt.
      </p>

      {/* Footer */}
      <footer className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
          onClick={() => {
            actions.setMove({ oldAddress: { street: '', postalCode: '', city: '' }, newAddress: { street: '', postalCode: '', city: '' }, moveDate: '', proofFile: null })
          }}
        >
          Zurücksetzen
        </button>
        <button
          className={clsx(
            'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white',
            isAddressComplete && connections.length > 0 && !isDispatching ? 'bg-gray-900 hover:bg-black' : 'bg-gray-400'
          )}
          disabled={!isAddressComplete || connections.length === 0 || isDispatching}
          onClick={actions.startDispatch}
        >
          <Zap className="h-4 w-4" /> Schritte starten
        </button>
      </footer>
    </div>
  )
}
