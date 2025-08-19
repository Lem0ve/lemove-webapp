import { useHome } from './Home.context'
import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Sidebar } from './components/Sidebar.component'
import { OldAddress } from './components/OldAddress.component'
import { NewAddress } from './components/NewAddress.component'
import { MoveDate } from './components/MoveDate.component'
import { DashboardStats } from './components/DashboardStats.component'
import { Connections } from './components/Connections.component'
import { ProviderPickerInline } from './components/ProviderPickerInline.component'
import { ConfirmDetailsStep } from './components/ConfirmDetailsStep.component'
import { PROVIDERS } from './components/ProviderCatalog'
import { EditProfilView } from './EditProfil.view'

export const HomeView = () => {
  const { move, actions, connections } = useHome()
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

  const [activeStep, setActiveStep] = useState(0)
  const highestUnlockedStep = stepCompletion.old ? (stepCompletion.new ? 2 : 1) : 0
  const showOnboardingFlow = forceOnboarding || !onboardingDoneQuery.data
  // UI mode after onboarding: 'dashboard' -> show stats + connections; 'pick-providers' -> inline picker; 'confirm' -> details confirm
  const [uiMode, setUiMode] = useState<'dashboard' | 'pick-providers' | 'confirm'>('dashboard')
  const [pendingProviderIds, setPendingProviderIds] = useState<string[]>([])
  const [showEditProfile, setShowEditProfile] = useState(false)

  return (
    <div className="w-full px-4 md:py-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        <div>
          <div className="rounded-2xl bg-black p-5 mb-4 text-white shadow-sm">
            <div className="text-xl font-semibold">
              <a href="/" className="flex items-center">
                <img src="/lemove_logo.png" alt="lemove logo" className="h-10 w-auto inline-block" />
              </a>
            </div>
          </div>
          <Sidebar
            activeStep={activeStep}
            stepCompletion={stepCompletion}
            onEditProfile={() => setShowEditProfile(true)}
            onStepNavigate={(idx: number) => {
              if (idx <= highestUnlockedStep) setActiveStep(idx)
            }}
          />
        </div>
        <div className="w-full max-w-3xl mx-auto">
          {isOnboardingComplete && !showOnboardingFlow ? (
            <div className="space-y-6">
              {uiMode === 'dashboard' && (
                <div className="space-y-6 rounded-2xl">
                  <DashboardStats />
                  <Connections onStartAdd={() => setUiMode('pick-providers')} />
                </div>
              )}
              {uiMode === 'pick-providers' && (
                <ProviderPickerInline
                  onCancel={() => setUiMode('dashboard')}
                  onConfirm={(ids) => { setPendingProviderIds(ids); setUiMode('confirm') }}
                />
              )}
              {uiMode === 'confirm' && (
                <ConfirmDetailsStep
                  selectedProviderIds={pendingProviderIds}
                  onBack={() => setUiMode('pick-providers')}
                  onSubmit={() => {
                    // Add providers now, then start dispatch
                    const existingNames = new Set<string>(connections.map(c => c.name.toLowerCase()))
                    pendingProviderIds.forEach(id => {
                      const p = PROVIDERS.find(x => x.id === id)
                      if (!p) return
                      if (!existingNames.has(p.name.toLowerCase())) {
                        actions.addConnection({ name: p.name, category: p.category, customerId: undefined })
                        existingNames.add(p.name.toLowerCase())
                      }
                    })
                    setPendingProviderIds([])
                    setUiMode('dashboard')
                    actions.startDispatch()
                  }}
                />
              )}
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
      {showEditProfile && (
        <EditProfilView onClose={() => setShowEditProfile(false)} />
      )}
    </div>
  )
}
