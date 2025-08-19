import { Home, House, CalendarDays, ChevronRight, ChevronLeft } from 'lucide-react'

type StepKey = 'old' | 'new' | 'date'
type SidebarProps = {
  activeStep: number
  stepCompletion: { old: boolean; new: boolean; date: boolean }
  onStepNavigate?: (index: number) => void
}

const STEPS: Array<{ key: StepKey; label: string }> = [
  { key: 'old', label: 'Auszug' },
  { key: 'new', label: 'Einzug' },
  { key: 'date', label: 'Datum' },
]

export const Sidebar = ({ activeStep, stepCompletion, onStepNavigate }: SidebarProps) => {
  return (
    <aside className="flex h-full w-full flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-gray-900">Umzug</h2>
      </div>
      <nav className="flex flex-col gap-2">
        {STEPS.map((step, idx) => {
          const isActive = idx === activeStep
          const isDone = stepCompletion[step.key]
          return (
            <button
              key={step.key}
              onClick={() => onStepNavigate?.(idx)}
              className={
                'flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm ' +
                (isActive ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50')
              }
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="inline-flex items-center gap-2">
                {step.key === 'old' && (<><Home className="h-4 w-4" /><ChevronRight className="h-4 w-4" /></>)}
                {step.key === 'new' && (<><House className="h-4 w-4" /><ChevronLeft className="h-4 w-4" /></>)}
                {step.key === 'date' && <CalendarDays className="h-4 w-4" />}
                {step.label}
              </span>
              <span className={'h-2 w-2 rounded-full ' + (isDone ? 'bg-emerald-500' : 'bg-gray-300')}></span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
