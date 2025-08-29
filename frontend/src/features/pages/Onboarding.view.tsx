import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoveDate } from '../components/MoveDate.component'
import { AddressForm } from '../components/AddressForm.component'
import { useHome } from '../Home.context'

export const OnboardingView: React.FC = () => {
  const { move, actions } = useHome()
  const navigate = useNavigate()

  const [activeStep, setActiveStep] = useState(0)

  const stepCompletion = {
    old: !!(move.oldAddress.street && move.oldAddress.postalCode && move.oldAddress.city),
    new: !!(move.newAddress.street && move.newAddress.postalCode && move.newAddress.city),
    date: !!(move.alreadyMoved || move.moveDate),
  }

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
              {ONBOARDING_STEPS.map((step, index) => {
                const unlocked = index <= (stepCompletion.old ? (stepCompletion.new ? 2 : 1) : 0)
                const active = index === activeStep
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
                    onClick={() => unlocked && setActiveStep(index)}
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
            <AddressForm
              title="Auszugsadresse"
              value={move.oldAddress}
              onChange={(address) => actions.setMove({ oldAddress: address })}
              onNext={() => setActiveStep(1)}
              idPrefix="old"
            />
          )}
          {activeStep === 1 && (
            <AddressForm
              title="Einzugsadresse"
              value={move.newAddress}
              onChange={(address) => actions.setMove({ newAddress: address })}
              onNext={() => setActiveStep(2)}
              idPrefix="new"
            />
          )}
          {activeStep === 2 && (
            <MoveDate
              alreadyMoved={!!move.alreadyMoved}
              date={move.moveDate ?? ''}
              onToggle={(value) => actions.setMove({ alreadyMoved: value })}
              onChangeDate={(dateValue) => actions.setMove({ moveDate: dateValue })}
              onDone={() => {
                try { localStorage.setItem('onboarding_done', '1') } catch {}
                navigate('/', { replace: true })
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
