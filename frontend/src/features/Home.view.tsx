import { useHome } from './Home.context'
import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Sidebar } from './components/Sidebar.component'
import { OldAddress } from './components/OldAddress.component'
import { NewAddress } from './components/NewAddress.component'
import { MoveDate } from './components/MoveDate.component'
import { DashboardStats } from './components/DashboardStats.component'
import { Connections } from './components/Connections.component'

export const HomeView = () => {
  const { move, actions } = useHome()
  const queryClient = useQueryClient()
  const [forceOnboarding] = useState(false)

  const onboardingDoneQuery = useQuery({
    queryKey: ['onboarding-done'],
    queryFn: async () => localStorage.getItem('onboarding_done') === '1',
    staleTime: Infinity,
    initialData: false,
  })

  const setOnboardingDoneMutation = useMutation({
    mutationFn: async (val: boolean) => {
      localStorage.setItem('onboarding_done', val ? '1' : '0')
      return val
    },
    onSuccess: (val) => queryClient.setQueryData(['onboarding-done'], val),
  })

  const stepCompletion = useMemo(
    () => ({
      old: !!(move.oldAddress.street && move.oldAddress.postalCode && move.oldAddress.city),
      new: !!(move.newAddress.street && move.newAddress.postalCode && move.newAddress.city),
      date: !!(move.alreadyMoved || move.moveDate),
    }),
    [move]
  )
  const isOnboardingComplete = stepCompletion.old && stepCompletion.new && stepCompletion.date
  const completionPercent = Math.round(((stepCompletion.old ? 1 : 0) + (stepCompletion.new ? 1 : 0) + (stepCompletion.date ? 1 : 0)) / 3 * 100)

  const [activeStep, setActiveStep] = useState(0)
  const highestUnlockedStep = stepCompletion.old ? (stepCompletion.new ? 2 : 1) : 0
  const showOnboardingFlow = forceOnboarding || !onboardingDoneQuery.data

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-4">
          <Sidebar
            current={activeStep}
            completed={stepCompletion}
            percent={completionPercent}
            onNavigate={(idx: number) => {
              if (idx <= highestUnlockedStep) setActiveStep(idx)
            }}
          />
        </div>
        <div className="md:col-span-8">
      {isOnboardingComplete && !showOnboardingFlow ? (
            <div className="space-y-6">
              <div className="space-y-6 rounded-2xl">
                <DashboardStats />
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900">Verbindungen</h3>
                </div>
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
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        {activeStep === 0 && (
                <OldAddress
                  value={move.oldAddress}
                  onChange={(a) => actions.setMove({ oldAddress: a })}
          onNext={() => setActiveStep(1)}
                />
              )}
        {activeStep === 1 && (
                <NewAddress
                  value={move.newAddress}
                  onChange={(a) => actions.setMove({ newAddress: a })}
          onNext={() => setActiveStep(2)}
                />
              )}
        {activeStep === 2 && (
                <MoveDate
                  alreadyMoved={!!move.alreadyMoved}
                  date={move.moveDate ?? ''}
                  onToggle={(v) => actions.setMove({ alreadyMoved: v })}
                  onChangeDate={(v) => actions.setMove({ moveDate: v })}
                  onDone={() => {
                    setOnboardingDoneMutation.mutate(true)
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
