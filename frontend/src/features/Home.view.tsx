import { HomeProvider, useHome } from './Home.context'
import { useMemo, useState } from 'react'
import { Sidebar } from './components/Sidebar.component'
import { OldAddress } from './components/OldAddress.component'
import { NewAddress } from './components/NewAddress.component'
import { MoveDate } from './components/MoveDate.component'
import { DashboardStats } from './components/DashboardStats.component'
import { Connections } from './components/Connections.component'

const Wizard = () => {
  const { move, actions } = useHome()
  const [showWizard, setShowWizard] = useState(false)

  const completed = useMemo(() => ({
    old: !!(move.oldAddress.street && move.oldAddress.postalCode && move.oldAddress.city),
    new: !!(move.newAddress.street && move.newAddress.postalCode && move.newAddress.city),
    date: !!(move.alreadyMoved || move.moveDate),
  }), [move])
  const percent = useMemo(() => Math.round(((completed.old ? 1 : 0) + (completed.new ? 1 : 0) + (completed.date ? 1 : 0)) / 3 * 100), [completed])
  const allDone = completed.old && completed.new && completed.date

  const [currentIndex, setCurrentIndex] = useState(0)
  const unlockIndex = completed.old ? (completed.new ? 2 : 1) : 0

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-4">
          <Sidebar
            current={currentIndex}
            completed={completed}
            percent={percent}
            onNavigate={(idx: number) => {
              if (idx <= unlockIndex) setCurrentIndex(idx)
            }}
          />
        </div>
        <div className="md:col-span-8">
          {allDone && !showWizard ? (
            <div className="space-y-6">
              <div className="space-y-6 rounded-2xl">
                <DashboardStats />
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-gray-900">Verbindungen</h3>
                  <Connections />
                  <div className="flex justify-end">
                    <button
                      className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
                      onClick={() => actions.startDispatch()}
                    >
                      Schritte starten
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              {currentIndex === 0 && (
                <OldAddress value={move.oldAddress} onChange={(a) => actions.setMove({ oldAddress: a })} />
              )}
              {currentIndex === 1 && (
                <NewAddress value={move.newAddress} onChange={(a) => actions.setMove({ newAddress: a })} />
              )}
              {currentIndex === 2 && (
                <MoveDate alreadyMoved={!!move.alreadyMoved} date={move.moveDate ?? ''} onToggle={(v) => actions.setMove({ alreadyMoved: v })} onChangeDate={(v) => actions.setMove({ moveDate: v })} />
              )}
              <div className="mt-6 flex justify-end">
                {allDone && (
                  <button
                    className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowWizard(false)}
                  >
                    Fertig
                  </button>
                )}
                <button
                  className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
                  onClick={() => {
                    // advance to next allowed step; prefer first incomplete
                    if (allDone) return
                    const nextIncomplete = !completed.old ? 0 : !completed.new ? 1 : 2
                    if (currentIndex < nextIncomplete && currentIndex < 2) {
                      setCurrentIndex(currentIndex + 1)
                    } else {
                      setCurrentIndex(nextIncomplete)
                    }
                  }}
                >
                  Weiter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const HomeView = () => {
  return (
    <HomeProvider>
      <Wizard />
    </HomeProvider>
  )
}
