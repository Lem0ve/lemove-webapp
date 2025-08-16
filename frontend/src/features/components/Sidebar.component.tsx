import { ProgressCircle } from './ProgressCircle.component'
import { Home, House, CalendarDays } from 'lucide-react'
import type { ReactNode } from 'react'

type Step = { key: 'old' | 'new' | 'date'; label: string; icon: ReactNode };

const STEPS: Step[] = [
  { key: 'old', label: 'Auszug', icon: <Home className="h-4 w-4" /> },
  { key: 'new', label: 'Einzug', icon: <House className="h-4 w-4" /> },
  { key: 'date', label: 'Datum', icon: <CalendarDays className="h-4 w-4" /> },
]

export const Sidebar = ({
  current,
  completed,
  onNavigate,
  percent,
}: {
  current: number
  completed: { old: boolean; new: boolean; date: boolean }
  onNavigate?: (index: number) => void
  percent: number
}) => {
  return (
    <aside className="flex h-full w-full flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-gray-900">lemove</h2>
        <p className="mt-1 text-sm text-gray-600">Adress-Assistent</p>
      </div>
      <div className="flex items-center justify-center">
        <ProgressCircle percent={percent} />
      </div>
      <nav className="flex flex-col gap-2">
        {STEPS.map((s, idx) => {
          const isActive = idx === current
          const isDone = completed[s.key]
          return (
            <button
              key={s.key}
              onClick={() => onNavigate?.(idx)}
              className={
                'flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm ' +
                (isActive ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50')
              }
            >
              <span className="inline-flex items-center gap-2">
                {s.icon}
                {s.label}
              </span>
              <span className={'h-2 w-2 rounded-full ' + (isDone ? 'bg-emerald-500' : 'bg-gray-300')}></span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
