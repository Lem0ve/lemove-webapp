import type { ConnectionStatus } from '../Home.interactor'
import { clsx } from './ConnectionStatus.utils'
import { Circle, Send, Check, CheckCircle2 } from 'lucide-react'

export const StatusSelector = ({ value, onChange }: { value: ConnectionStatus; onChange: (status: ConnectionStatus) => void }) => (
  <div className="flex items-center gap-1">
    <button title="Nicht kontaktiert" onClick={() => onChange('not_contacted')} className={clsx('rounded-lg p-2 ring-1', value === 'not_contacted' ? 'ring-gray-400' : 'ring-transparent hover:bg-gray-50 cursor-pointer')}>
      <Circle className="h-4 w-4" />
    </button>
    <button title="Gesendet" onClick={() => onChange('sent')} className={clsx('rounded-lg p-2 ring-1', value === 'sent' ? 'ring-blue-400' : 'ring-transparent hover:bg-gray-50 cursor-pointer')}>
      <Send className="h-4 w-4" />
    </button>
    <button title="Bestätigt" onClick={() => onChange('confirmed')} className={clsx('rounded-lg p-2 ring-1', value === 'confirmed' ? 'ring-emerald-400' : 'ring-transparent hover:bg-gray-50 cursor-pointer')}>
      <Check className="h-4 w-4" />
    </button>
    <button title="Manuell erledigt" onClick={() => onChange('manual_done')} className={clsx('rounded-lg p-2 ring-1', value === 'manual_done' ? 'ring-emerald-400' : 'ring-transparent hover:bg-gray-50 cursor-pointer')}>
      <CheckCircle2 className="h-4 w-4" />
    </button>
  </div>
)
