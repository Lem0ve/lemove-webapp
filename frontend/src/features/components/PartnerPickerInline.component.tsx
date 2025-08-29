import { useMemo, useState } from 'react'
import { Check, Search } from 'lucide-react'
import { CATEGORIES, PARTNERS, brandLogoUrl, type PartnerCategory } from './PartnerCatalog'
import { useHome } from '../Home.context'

type Props = {
  onCancel: () => void
  onConfirm: (selectedIds: string[]) => void
}

export const PartnerPickerInline = ({ onCancel, onConfirm }: Props) => {
  const { partners } = useHome()
  const [activeCategory, setActiveCategory] = useState<PartnerCategory | 'Alle'>('Alle')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const existingProviderIds = useMemo(() => {
    const ids = new Set<string>()
    partners.forEach((partner) => {
      if (partner.providerId) ids.add(partner.providerId)
    })
    return ids
  }, [partners])
  const existingNamesLower = useMemo(() => new Set(partners.filter(partner => !partner.providerId).map(partner => partner.name.toLowerCase())), [partners])

  const filtered = useMemo(() => {
    const list = activeCategory === 'Alle' ? PARTNERS : PARTNERS.filter(provider => provider.category === activeCategory)
    const queryLower = query.trim().toLowerCase()
    return queryLower ? list.filter(provider => provider.name.toLowerCase().includes(queryLower)) : list
  }, [activeCategory, query])

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-base sm:text-lg font-semibold text-gray-900">Partner auswählen</h4>
      </div>
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Partner suchen..."
            aria-label="Partner suchen"
            className="w-full rounded-xl border border-gray-300 p-2 pl-9 outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <div className="sm:col-span-2 flex flex-wrap gap-2">
          {(['Alle', ...CATEGORIES] as const).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category as any)}
              className={`rounded-full px-3 py-1 text-xs ${activeCategory === category ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 max-h-[60vh] overflow-auto">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((provider) => {
            const alreadyAdded = existingProviderIds.has(provider.id) || existingNamesLower.has(provider.name.toLowerCase())
            const isChecked = selected.has(provider.id)
            return (
              <div
                key={provider.id}
                onClick={() => { if (!alreadyAdded) toggle(provider.id) }}
                onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (!alreadyAdded) toggle(provider.id) } }}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                className={`relative flex h-28 flex-col items-center justify-center rounded-xl border p-2 text-sm ${alreadyAdded ? 'border-emerald-300 bg-emerald-50 text-emerald-800 cursor-not-allowed' : 'cursor-pointer'} ${isChecked && !alreadyAdded ? 'border-gray-900 bg-gray-50' : !alreadyAdded ? 'border-gray-200 bg-white hover:bg-gray-50' : ''}`}
              >
                <input type="checkbox" checked={isChecked || alreadyAdded} onChange={() => {}} disabled={alreadyAdded} className="sr-only" aria-label={`${provider.name} ${alreadyAdded ? 'bereits hinzugefügt' : 'auswählen'}`} />
                <button
                  type="button"
                  onClick={(event) => { event.stopPropagation(); if (!alreadyAdded) toggle(provider.id) }}
                  className={`absolute right-2 top-2 h-5 w-5 rounded-full border-2 ${alreadyAdded ? 'border-emerald-400 bg-emerald-400' : isChecked ? 'border-gray-900 bg-gray-900' : 'border-gray-300 bg-white'} flex items-center justify-center`}
                  aria-label={alreadyAdded ? 'Bereits hinzugefügt' : isChecked ? 'Ausgewählt' : 'Auswählen'}
                >
                  {(isChecked || alreadyAdded) && <Check className="h-3 w-3 text-white" />}
                </button>
                {alreadyAdded && (
                  <span className="absolute left-2 top-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-200">Hinzugefügt</span>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {provider.logoUrl || provider.domain ? (
                  <img
                    src={provider.logoUrl || (provider.domain ? brandLogoUrl(provider.domain, 64, { format: 'svg' }) : '')}
                    onError={(event) => {
                      const img = event.currentTarget as HTMLImageElement
                      if (provider.domain) {
                        img.src = brandLogoUrl(provider.domain, 64, { dpr: 2 })
                        img.onerror = () => { img.src = `https://logo.clearbit.com/${provider.domain}` }
                      } else {
                        img.src = ''
                      }
                    }}
                    alt={provider.name}
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

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">{selected.size} ausgewählt</div>
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="cursor-pointer rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">Abbrechen</button>
          <button
            onClick={() => onConfirm(Array.from(selected))}
            disabled={selected.size === 0}
            className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium ${selected.size === 0 ? 'bg-gray-200 text-gray-500' : 'bg-gray-900 text-white hover:bg-black'}`}
          >
            Weiter
          </button>
        </div>
      </div>
    </div>
  )
}
