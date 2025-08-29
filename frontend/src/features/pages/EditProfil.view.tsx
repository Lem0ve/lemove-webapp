import React from 'react'
import { MoveDate } from '../components/MoveDate.component'
import { AddressForm } from '../components/AddressForm.component'
import { useHome } from '../Home.context'

export const EditProfilView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { move, actions } = useHome()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-lg space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Profildaten bearbeiten</h2>
        </div>
        <div className="space-y-10">
          <section>
            <AddressForm title="Auszugsadresse" value={move.oldAddress} onChange={(address) => actions.setMove({ oldAddress: address })} idPrefix="old" />
          </section>
          <section>
            <AddressForm title="Einzugsadresse" value={move.newAddress} onChange={(address) => actions.setMove({ newAddress: address })} idPrefix="new" />
          </section>
          <section>
            <div className="space-y-4">
              <MoveDate
                alreadyMoved={!!move.alreadyMoved}
                date={move.moveDate ?? ''}
                onToggle={(value) => actions.setMove({ alreadyMoved: value })}
                onChangeDate={(dateValue) => actions.setMove({ moveDate: dateValue })}
              />
            </div>
          </section>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-black"
          >
            Speichern & Schließen
          </button>
        </div>
      </div>
    </div>
  )
}
