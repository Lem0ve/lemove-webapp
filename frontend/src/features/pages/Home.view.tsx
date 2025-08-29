import { Navigate } from 'react-router-dom'
import { EditProfilView } from '../pages/EditProfil.view'
import { Sidebar } from '../components/Sidebar.component'
import { useState } from 'react'
import { ConfirmDetailsStep } from '../components/ConfirmDetailsStep.component'
import { Connections } from '../components/Connections.component'
import { DashboardStats } from '../components/DashboardStats.component'
import { PROVIDERS } from '../components/ProviderCatalog'
import { ProviderPickerInline } from '../components/ProviderPickerInline.component'
import { useHome } from '../Home.context'

export const HomeView = () => {
  const { move, actions, connections } = useHome()
  const [forceOnboarding] = useState(false)

  const onboardingDone = (() => {
    try { return localStorage.getItem('onboarding_done') === '1' } catch { return false }
  })()

  // no local mutation needed here; onboarding completion is handled in OnboardingView

  const stepCompletion = {
    old: !!(move.oldAddress.street && move.oldAddress.postalCode && move.oldAddress.city),
    new: !!(move.newAddress.street && move.newAddress.postalCode && move.newAddress.city),
    date: !!(move.alreadyMoved || move.moveDate),
  }
  const isOnboardingComplete = stepCompletion.old && stepCompletion.new && stepCompletion.date

  const [activeStep, setActiveStep] = useState(0)
  const highestUnlockedStep = stepCompletion.old ? (stepCompletion.new ? 2 : 1) : 0
  const [uiMode, setUiMode] = useState<'dashboard' | 'pick-providers' | 'confirm'>('dashboard')
  const [pendingProviderIds, setPendingProviderIds] = useState<string[]>([])
  const [showEditProfile, setShowEditProfile] = useState(false)

  const showingOnboarding = (forceOnboarding || !onboardingDone) || !isOnboardingComplete
  if (showingOnboarding) {
    return <Navigate to="/onboarding" replace />
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
            onStepNavigate={(index: number) => {
              if (index <= highestUnlockedStep) setActiveStep(index)
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
                    const existingProviderIds = new Set<string>(connections.map(connection => (connection.providerId ?? '').toLowerCase()).filter(Boolean))
                    const legacyNames = new Set<string>(connections.filter(connection => !connection.providerId).map(connection => connection.name.toLowerCase()))
                    pendingProviderIds.forEach(providerId => {
                      const provider = PROVIDERS.find(providerItem => providerItem.id === providerId)
                      if (!provider) return
                      const idKey = provider.id.toLowerCase()
                      const nameKey = provider.name.toLowerCase()
                      const exists = existingProviderIds.has(idKey) || legacyNames.has(nameKey)
                      if (exists) return
                      actions.addConnection({ providerId: provider.id, name: provider.name, category: provider.category, customerId: undefined })
                      existingProviderIds.add(idKey)
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
