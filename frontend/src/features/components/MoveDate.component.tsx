import React from 'react'

export const MoveDate: React.FC<{
  alreadyMoved: boolean
  date: string
  onToggle: (v: boolean) => void
  onChangeDate: (v: string) => void
  onDone?: () => void
}> = ({ alreadyMoved, date, onToggle, onChangeDate, onDone }) => {
  const already = alreadyMoved
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900">Umzugsdatum</h3>
      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-gray-800">
          <input
            type="checkbox"
            checked={already}
            onChange={(e) => onToggle(e.target.checked)}
          />
          Schon umgezogen
        </label>
      </div>
      {!already && (
        <div className="max-w-xs">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-gray-700">Datum</span>
            <input
              type="date"
              className="rounded-xl border border-gray-300 p-2"
              value={date}
              onChange={(e) => onChangeDate(e.target.value)}
            />
          </label>
        </div>
      )}
      {onDone && (
        <div className="mt-4 flex justify-end">
          {(() => {
            const disabled = !already && !date
            return (
              <button
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-black'}`}
                onClick={() => onDone?.()}
                disabled={disabled}
              >
                Fertig
              </button>
            )
          })()}
        </div>
      )}
    </div>
  )
}
