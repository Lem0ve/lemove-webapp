import { useMemo, useState } from 'react'
import { Check, Search } from 'lucide-react'
import { CATEGORIES, PROVIDERS, brandLogoUrl, type ProviderCategory } from './ProviderCatalog'

type Props = {
  onCancel: () => void
  onConfirm: (selectedIds: string[]) => void
}

export const ProviderPickerInline = ({ onCancel, onConfirm }: Props) => {
  const [activeCategory, setActiveCategory] = useState<ProviderCategory | 'Alle'>('Alle')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    const list = activeCategory === 'Alle' ? PROVIDERS : PROVIDERS.filter(provider => provider.category === activeCategory)
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
        <h4 className="text-base sm:text-lg font-semibold text-gray-900">Anbieter auswählen</h4>
      </div>
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Suchen..."
            aria-label="Anbieter suchen"
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
            const isChecked = selected.has(provider.id)
            return (
              <div
                key={provider.id}
                onClick={() => toggle(provider.id)}
                onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(provider.id) } }}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                className={`relative flex h-28 flex-col items-center justify-center rounded-xl border p-2 text-sm cursor-pointer ${isChecked ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
              >
                <input type="checkbox" checked={isChecked} onChange={() => toggle(provider.id)} className="sr-only" aria-label={`${provider.name} auswählen`} />
                <button
                  type="button"
                  onClick={(event) => { event.stopPropagation(); toggle(provider.id) }}
                  className={`absolute right-2 top-2 h-5 w-5 rounded-full border-2 ${isChecked ? 'border-gray-900 bg-gray-900' : 'border-gray-300 bg-white'} flex items-center justify-center`}
                  aria-label={isChecked ? 'Ausgewählt' : 'Auswählen'}
                >
                  {isChecked && <Check className="h-3 w-3 text-white" />}
                </button>
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
