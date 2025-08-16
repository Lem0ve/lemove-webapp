import { Trash2 } from 'lucide-react'
import type { Connection } from '../Home.interactor'
import { StatusSelector } from './StatusSelector.component'
import { StatusIcon, statusBadgeColor, clsx } from './ConnectionStatus.utils'

export const ConnectionCard = ({ item, onUpdate, onRemove }: { item: Connection; onUpdate: (patch: Partial<Connection>) => void; onRemove: () => void }) => (
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
          <StatusIcon status={item.status} />
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
