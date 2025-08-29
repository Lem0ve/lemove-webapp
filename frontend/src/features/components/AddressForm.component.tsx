import React from 'react'

export type Address = { street: string; postalCode: string; city: string }

type Props = {
  title: string
  value: Address
  onChange: (a: Address) => void
  onNext?: () => void
  idPrefix?: string
}

export const AddressForm: React.FC<Props> = ({ title, value, onChange, onNext, idPrefix = '' }) => {
  const a = value
  const valid = Boolean(a.street && a.postalCode && a.city)
  const prefix = idPrefix ? `${idPrefix}-` : ''

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label htmlFor={`${prefix}street`} className="grid gap-1 text-sm">
          <span className="font-medium text-gray-700">Straße & Nr.</span>
          <input
            id={`${prefix}street`}
            className="rounded-xl border border-gray-300 p-2"
            autoComplete="address-line1"
            value={a.street}
            onChange={(e) => onChange({ ...a, street: e.target.value })}
          />
        </label>
        <label htmlFor={`${prefix}postal`} className="grid gap-1 text-sm">
          <span className="font-medium text-gray-700">PLZ</span>
          <input
            id={`${prefix}postal`}
            className="rounded-xl border border-gray-300 p-2"
            autoComplete="postal-code"
            value={a.postalCode}
            onChange={(e) => onChange({ ...a, postalCode: e.target.value })}
          />
        </label>
        <label htmlFor={`${prefix}city`} className="grid gap-1 text-sm">
          <span className="font-medium text-gray-700">Stadt</span>
          <input
            id={`${prefix}city`}
            className="rounded-xl border border-gray-300 p-2"
            autoComplete="address-level2"
            value={a.city}
            onChange={(e) => onChange({ ...a, city: e.target.value })}
          />
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

