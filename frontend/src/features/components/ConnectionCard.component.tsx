import { Trash2 } from 'lucide-react'
import type { Connection } from '../Home.interactor'
import { StatusSelector } from './StatusSelector.component'
import { StatusIcon, statusBadgeColor, clsx } from './ConnectionStatus.utils'
import { PROVIDERS, brandLogoUrl } from './ProviderCatalog'

export const ConnectionCard = ({ item, onUpdate, onRemove }: { item: Connection; onUpdate: (patch: Partial<Connection>) => void; onRemove: () => void }) => {
  const provider = PROVIDERS.find((p) => p.name.toLowerCase() === item.name.toLowerCase())
  const logoSrc = provider?.logoUrl || (provider?.domain ? brandLogoUrl(provider.domain, 24, { format: 'svg' }) : undefined)

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 p-4 shadow-sm">
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {logoSrc ? (
              <img
                src={logoSrc}
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement
                  if (provider?.domain) {
                    img.src = brandLogoUrl(provider.domain, 24, { dpr: 2 })
                    img.onerror = () => { img.src = `https://logo.clearbit.com/${provider.domain}` }
                  }
                }}
                alt={item.name}
                className="h-6 w-auto max-w-[24px] rounded object-contain"
              />
            ) : (
              <div className="h-6 w-6 rounded bg-gray-200" />
            )}
            <div className="text-base font-semibold text-gray-900">{item.name}</div>
          </div>
          <button onClick={onRemove} className="rounded-xl border border-gray-300 p-2 text-gray-700 hover:bg-gray-50" title="Entfernen">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3">
          <span className={clsx('inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium', statusBadgeColor(item.status))}>
            <StatusIcon status={item.status} />
            {item.status === 'not_contacted' && 'Nicht kontaktiert'}
            {item.status === 'sent' && 'Gesendet'}
            {item.status === 'confirmed' && 'Bestätigt'}
            {item.status === 'manual_done' && 'Manuell erledigt'}
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between cursor-pointer">
        <StatusSelector value={item.status} onChange={(s) => onUpdate({ status: s })} />
      </div>
    </div>
  )
}
