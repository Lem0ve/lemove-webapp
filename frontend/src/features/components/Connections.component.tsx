import React, { useMemo, useState } from 'react'
import { Check, CheckCircle2, Circle, Search, Send, Trash2, Plus } from 'lucide-react'
import type { ProviderCategory, Connection, ConnectionStatus } from '../Home.interactor'
import { useHome } from '../Home.context'

function clsx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ')
}

const CATEGORIES: ProviderCategory[] = ['Bank', 'Versicherung', 'Arbeitgeber', 'Telekom', 'Energie', 'Gym', 'Sonstige']

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

const StatusSelector = ({ value, onChange }: { value: ConnectionStatus; onChange: (s: ConnectionStatus) => void }) => (
  <div className="flex items-center gap-1">
    <button title="Nicht kontaktiert" onClick={() => onChange('not_contacted')} className={clsx('rounded-lg p-2 ring-1', value === 'not_contacted' ? 'ring-gray-400' : 'ring-transparent hover:bg-gray-50')}>
      <Circle className="h-4 w-4" />
    </button>
    <button title="Gesendet" onClick={() => onChange('sent')} className={clsx('rounded-lg p-2 ring-1', value === 'sent' ? 'ring-blue-400' : 'ring-transparent hover:bg-gray-50')}>
      <Send className="h-4 w-4" />
    </button>
    <button title="Bestätigt" onClick={() => onChange('confirmed')} className={clsx('rounded-lg p-2 ring-1', value === 'confirmed' ? 'ring-emerald-400' : 'ring-transparent hover:bg-gray-50')}>
      <Check className="h-4 w-4" />
    </button>
    <button title="Manuell erledigt" onClick={() => onChange('manual_done')} className={clsx('rounded-lg p-2 ring-1', value === 'manual_done' ? 'ring-emerald-400' : 'ring-transparent hover:bg-gray-50')}>
      <CheckCircle2 className="h-4 w-4" />
    </button>
  </div>
)

const LabeledInput = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="grid gap-1 text-sm">
    <span className="font-medium text-gray-700">{label}</span>
    {children}
  </label>
)

const ConnectionCard = ({ item, onUpdate, onRemove }: { item: Connection; onUpdate: (patch: Partial<Connection>) => void; onRemove: () => void }) => (
  <div className="flex flex-col justify-between rounded-2xl border border-gray-200 p-4 shadow-sm">
    <div>
      <div className="flex items-center justify-between gap-2">
        <div className="text-base font-semibold text-gray-900">{item.name}</div>
        <button onClick={onRemove} className="rounded-xl border border-gray-300 p-2 text-gray-700 hover:bg-gray-50" title="Entfernen">
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

export const Connections = () => {
  const { connections, actions } = useHome()
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState<ProviderCategory | 'Alle'>('Alle')

  const filtered = useMemo(() => {
    return connections.filter((x) => {
      const matchesCat = activeCat === 'Alle' || x.category === activeCat
      const matchesQuery = !query || x.name.toLowerCase().includes(query.toLowerCase())
      return matchesCat && matchesQuery
    })
  }, [connections, query, activeCat])

  const AddConnectionForm = () => {
    const [name, setName] = useState('')
    const [category, setCategory] = useState<ProviderCategory>('Bank')
    const [customerId, setCustomerId] = useState('')

    function submit() {
      if (!name.trim()) return
      actions.addConnection({ name: name.trim(), category, customerId: customerId.trim() || undefined })
      setName('')
      setCustomerId('')
      setCategory('Bank')
    }

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="md:col-span-5">
            <LabeledInput label="Name (z. B. Sparkasse, TK, o2)">
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900" placeholder="z. B. ING, TK, o2" />
            </LabeledInput>
          </div>
          <div className="md:col-span-3">
            <LabeledInput label="Kategorie">
              <select value={category} onChange={(e) => setCategory(e.target.value as ProviderCategory)} className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </LabeledInput>
          </div>
          <div className="md:col-span-3">
            <LabeledInput label="Kundennummer (optional)">
              <input value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900" placeholder="123456" />
            </LabeledInput>
          </div>
          <div className="md:col-span-1 flex items-end">
            <button onClick={submit} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button className={clsx('rounded-full px-3 py-1 text-xs', activeCat === 'Alle' ? 'bg-gray-900 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50')} onClick={() => setActiveCat('Alle')}>Alle</button>
          {CATEGORIES.map((c) => (
            <button key={c} className={clsx('rounded-full px-3 py-1 text-xs', activeCat === c ? 'bg-gray-900 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50')} onClick={() => setActiveCat(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="relative max-w-sm flex-1 sm:flex-none">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Suchen…" className="w-full rounded-xl border border-gray-300 p-2 pl-9 outline-none focus:ring-2 focus:ring-gray-900" />
        </div>
      </div>

      <AddConnectionForm />

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 p-6 text-sm text-gray-600">Keine Einträge. Über das Formular hinzufügen.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ConnectionCard key={r.id} item={r} onUpdate={(patch) => actions.updateConnection(r.id, patch)} onRemove={() => actions.removeConnection(r.id)} />
          ))}
        </div>
      )}
    </div>
  )
}
