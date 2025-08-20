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
  // const showOnboardingFlow = forceOnboarding || !onboardingDoneQuery.data // entfernt, nicht mehr genutzt
  // UI mode after onboarding: 'dashboard' -> show stats + connections; 'pick-providers' -> inline picker; 'confirm' -> details confirm
  const [uiMode, setUiMode] = useState<'dashboard' | 'pick-providers' | 'confirm'>('dashboard')
  const [pendingProviderIds, setPendingProviderIds] = useState<string[]>([])
  const [showEditProfile, setShowEditProfile] = useState(false)

  const showingOnboarding = (forceOnboarding || !onboardingDoneQuery.data) || !isOnboardingComplete

  // Fullscreen Onboarding Maske vor eigentlichem Dashboard
  if (showingOnboarding) {
    const ONBOARDING_STEPS = [
      { key: 'old', label: 'Auszug' },
      { key: 'new', label: 'Einzug' },
      { key: 'date', label: 'Datum' },
    ] as const
    return (
      <div className="min-h-screen w-full bg-gray-50 px-4 py-8">
        <div className="mx-auto mb-8 flex max-w-3xl items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/lemove_logo_dark.png" alt="lemove logo" className="h-10 w-auto" />
          </a>
        </div>
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {ONBOARDING_STEPS.map((step, idx) => {
                  const unlocked = idx <= (stepCompletion.old ? (stepCompletion.new ? 2 : 1) : 0)
                  const active = idx === activeStep
                  const done = step.key === 'old' ? stepCompletion.old : step.key === 'new' ? stepCompletion.new : stepCompletion.date
                  const base = 'inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-sm font-medium transition-colors'
                  const state = active
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : unlocked
                      ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  return (
                    <button
                      key={step.key}
                      type="button"
                      disabled={!unlocked}
                      onClick={() => unlocked && setActiveStep(idx)}
                      className={`${base} ${state}`}
                      aria-current={active ? 'step' : undefined}
                    >
                      <span>{step.label}</span>
                      <span className={'h-1.5 w-1.5 ml-2 rounded-full ' + (done ? 'bg-emerald-500' : 'bg-gray-300')}></span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="space-y-6">
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
        </div>
      </div>
    )
  }

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
          {isOnboardingComplete ? (
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
          ) : null}
        </div>
      </div>
      {showEditProfile && (
        <EditProfilView onClose={() => setShowEditProfile(false)} />
      )}
    </div>
  )
}
