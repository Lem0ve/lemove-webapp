import React from 'react'

type Address = { street: string; postalCode: string; city: string }

export const NewAddress: React.FC<{
  value: Address
  onChange: (a: Address) => void
  onNext?: () => void
}> = ({ value, onChange, onNext }) => {
  const a = value
  const valid = Boolean(a.street && a.postalCode && a.city)
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900">Einzugsadresse</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-gray-700">Straße & Nr.</span>
          <input className="rounded-xl border border-gray-300 p-2" value={a.street} onChange={(e) => onChange({ ...a, street: e.target.value })} />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-gray-700">PLZ</span>
          <input className="rounded-xl border border-gray-300 p-2" value={a.postalCode} onChange={(e) => onChange({ ...a, postalCode: e.target.value })} />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-gray-700">Stadt</span>
          <input className="rounded-xl border border-gray-300 p-2" value={a.city} onChange={(e) => onChange({ ...a, city: e.target.value })} />
        </label>
      </div>
      {onNext && (
        <div className="mt-4 flex justify-end">
          <button
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${valid ? 'bg-gray-900 text-white hover:bg-black' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            onClick={() => valid && onNext()}
            disabled={!valid}
          >
            Weiter
          </button>
        </div>
      )}
    </div>
  )
}
