import { Check, CheckCircle2, Circle, Send } from 'lucide-react'
import type { ConnectionStatus } from '../Home.interactor'

export function clsx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ')
}

export function statusBadgeColor(status: ConnectionStatus) {
  switch (status) {
    case 'not_contacted':
      return 'bg-gray-100 text-gray-700 ring-1 ring-gray-200'
    case 'sent':
      return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
    case 'confirmed':
    case 'manual_done':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
  }
}

export const StatusIcon = ({ status, className }: { status: ConnectionStatus; className?: string }) => {
  switch (status) {
    case 'not_contacted':
      return <Circle className={className ?? 'h-4 w-4'} />
    case 'sent':
      return <Send className={className ?? 'h-4 w-4'} />
    case 'confirmed':
      return <Check className={className ?? 'h-4 w-4'} />
    case 'manual_done':
      return <CheckCircle2 className={className ?? 'h-4 w-4'} />
  }
}
