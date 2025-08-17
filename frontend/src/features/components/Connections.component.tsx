import { useState, useMemo, useEffect } from 'react'
import { useHome } from '../Home.context'
import { ConnectionCard } from './ConnectionCard.component'
import { CATEGORIES, PROVIDERS, brandLogoUrl, type ProviderCategory } from './ProviderCatalog'
import { Plus, Check } from 'lucide-react'

export const Connections = () => {
    const { connections, actions } = useHome()
    const [isPickerOpen, setPickerOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState<ProviderCategory | 'Alle'>('Alle')
    const [query, setQuery] = useState('')
    const [selected, setSelected] = useState<Set<string>>(new Set())

    const filtered = useMemo(() => {
        const list = activeCategory === 'Alle' ? PROVIDERS : PROVIDERS.filter(p => p.category === activeCategory)
        const q = query.trim().toLowerCase()
        return q ? list.filter(p => p.name.toLowerCase().includes(q)) : list
    }, [activeCategory, query])

    function toggle(id: string) {
        setSelected(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    function addSelected() {
        if (selected.size === 0) return
        const existing = new Set(connections.map(c => c.name.toLowerCase()))
        for (const id of selected) {
            const p = PROVIDERS.find(x => x.id === id)
            if (!p) continue
            // Avoid simple duplicates by name
            if (!existing.has(p.name.toLowerCase())) {
                actions.addConnection({ name: p.name, category: p.category, customerId: undefined })
            }
        }
        // Keep modal open, but reset selection so user can continue
        setSelected(new Set())
    }

    useEffect(() => {
        if (!isPickerOpen) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setPickerOpen(false)
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isPickerOpen])

    return (
        <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Meine Verbindungen</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {connections.map((r) => (
                    <ConnectionCard key={r.id} item={r} onUpdate={(patch) => actions.updateConnection(r.id, patch)} onRemove={() => actions.removeConnection(r.id)} />
                ))}

                {/* Add tile at the end */}
                <button
                    onClick={() => setPickerOpen(true)}
                    className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
                >
                    <span className="inline-flex items-center gap-2 text-sm font-medium">
                        <Plus className="h-4 w-4" /> Hinzufügen
                    </span>
                </button>
            </div>

            {/* Picker modal */}
            {isPickerOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 p-4" onClick={() => setPickerOpen(false)}>
                    <div className="w-full max-w-5xl h-[85vh] rounded-2xl bg-white p-5 shadow-lg flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="mb-4 flex items-center justify-between">
                            <h4 className="text-base sm:text-lg font-semibold text-gray-900">Anbieter auswählen</h4>
                        </div>
                        <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Suchen (z. B. NORD/LB)"
                                className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900"
                            />
                            <div className="sm:col-span-2 flex flex-wrap gap-2">
                                {(['Alle', ...CATEGORIES] as const).map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setActiveCategory(c as any)}
                                        className={`rounded-full px-3 py-1 text-xs ${activeCategory === c ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Scrollable grid */}
                        <div className="min-h-0 flex-1 overflow-auto">
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                {filtered.map((p) => {
                                    const isChecked = selected.has(p.id)
                                    return (
                                        <div
                                            key={p.id}
                                            onClick={() => toggle(p.id)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(p.id) } }}
                                            role="checkbox"
                                            aria-checked={isChecked}
                                            tabIndex={0}
                                            className={`relative flex h-28 flex-col items-center justify-center rounded-xl border p-2 text-sm cursor-pointer ${isChecked ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                                        >
                                            <input type="checkbox" checked={isChecked} onChange={() => toggle(p.id)} className="sr-only" aria-label={`${p.name} auswählen`} />
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); toggle(p.id) }}
                                                className={`absolute right-2 top-2 h-5 w-5 rounded-full border-2 ${isChecked ? 'border-gray-900 bg-gray-900' : 'border-gray-300 bg-white'} flex items-center justify-center`}
                                                aria-label={isChecked ? 'Ausgewählt' : 'Auswählen'}
                                            >
                                                {isChecked && <Check className="h-3 w-3 text-white" />}
                                            </button>
                                            {/* Prefer explicit logoUrl, else derive from Brandfetch by domain, else fallback to Clearbit Logo API */}
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                                            {p.logoUrl || p.domain ? (
                                                                                                <img
                                                                                                    src={p.logoUrl || (p.domain ? brandLogoUrl(p.domain, 64, { format: 'svg' }) : '')}
                                                                                                    onError={(e) => {
                                                                                                        const img = e.currentTarget as HTMLImageElement
                                                                                                        if (p.domain) {
                                                                                                            // Fallback to high-DPI raster from Brandfetch, then Clearbit
                                                                                                            img.src = brandLogoUrl(p.domain, 64, { dpr: 2 })
                                                                                                            img.onerror = () => { img.src = `https://logo.clearbit.com/${p.domain}` }
                                                                                                        } else {
                                                                                                            img.src = ''
                                                                                                        }
                                                                                                    }}
                                                                                                    alt={p.name}
                                                                                                    className="h-12 w-auto max-w-[80px] object-contain"
                                                                                                />
                                                                                            ) : (
                                                                        <div className="h-12 w-12 rounded-full bg-gray-200" />
                                                                    )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Footer actions */}
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-600">{selected.size} ausgewählt</div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setPickerOpen(false)} className="cursor-pointer rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">Schließen</button>
                                <button
                                    onClick={() => {
                                        addSelected()
                                        setPickerOpen(false)
                                    }}
                                    disabled={selected.size === 0}
                                    className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium ${selected.size === 0 ? 'bg-gray-200 text-gray-500' : 'bg-gray-900 text-white hover:bg-black'}`}
                                >
                                    Auswahl hinzufügen
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
