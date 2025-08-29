import { useState } from 'react'
import { useHome } from '../Home.context'
import { PARTNERS, brandLogoUrl } from './PartnerCatalog'

 type Props = {
  selectedProviderIds: string[]
  onBack: () => void
  onSubmit: (confirmed: { fullName: string; email: string; phone?: string; birthday?: string }) => void
}

export const ConfirmDetailsStep = ({ selectedProviderIds, onBack, onSubmit }: Props) => {
  const { move, actions } = useHome()
  // Personal data
  const [fullName, setFullName] = useState(move.fullName ?? '')
  const [email, setEmail] = useState(move.email ?? '')
  const [phone, setPhone] = useState(move.phone ?? '')
  const [birthday, setBirthday] = useState(move.birthday ?? '')
  // Addresses and move
  const [oldStreet, setOldStreet] = useState(move.oldAddress.street)
  const [oldPostal, setOldPostal] = useState(move.oldAddress.postalCode)
  const [oldCity, setOldCity] = useState(move.oldAddress.city)
  const [newStreet, setNewStreet] = useState(move.newAddress.street)
  const [newPostal, setNewPostal] = useState(move.newAddress.postalCode)
  const [newCity, setNewCity] = useState(move.newAddress.city)
  const [alreadyMoved, setAlreadyMoved] = useState(!!move.alreadyMoved)
  const [moveDate, setMoveDate] = useState(move.moveDate ?? '')
  const [accepted, setAccepted] = useState(false)

  const selectedPartners = selectedProviderIds.map(providerId => PARTNERS.find(provider => provider.id === providerId)).filter(Boolean)

  const isValid = fullName.trim().length > 0 && /.+@.+\..+/.test(email) && accepted

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h4 className="text-base font-semibold text-gray-900 mb-2">Alle Daten</h4>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <div className="mb-2 text-sm font-medium text-gray-900">Alte Adresse</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input value={oldStreet} onChange={(event) => setOldStreet(event.target.value)} placeholder="Straße und Hausnummer" className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900" />
              <input value={oldPostal} onChange={(event) => setOldPostal(event.target.value)} placeholder="PLZ" className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900" />
              <input value={oldCity} onChange={(event) => setOldCity(event.target.value)} placeholder="Ort" className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium text-gray-900">Neue Adresse</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input value={newStreet} onChange={(event) => setNewStreet(event.target.value)} placeholder="Straße und Hausnummer" className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900" />
              <input value={newPostal} onChange={(event) => setNewPostal(event.target.value)} placeholder="PLZ" className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900" />
              <input value={newCity} onChange={(event) => setNewCity(event.target.value)} placeholder="Ort" className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium text-gray-900">Umzug</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[auto_1fr] items-center">
              <label className="flex items-center gap-2 text-sm text-gray-800">
                <input type="checkbox" checked={alreadyMoved} onChange={(event) => setAlreadyMoved(event.target.checked)} className="h-4 w-4 rounded border-gray-300" />
                Bereits umgezogen
              </label>
              <input type="date" value={moveDate} onChange={(event) => setMoveDate(event.target.value)} disabled={alreadyMoved} className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100" />
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium text-gray-900">Kontakt</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Vollständiger Name" className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900" />
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-Mail" className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900" />
              <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Telefon (optional)" className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900" />
              <input type="date" value={birthday} onChange={(event) => setBirthday(event.target.value)} placeholder="Geburtstag" className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h4 className="text-base font-semibold text-gray-900 mb-3">Ausgewählte Partner</h4>
        <div className="min-h-0">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {selectedPartners.map((provider) => (
              <div key={provider!.id} className="flex h-28 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {provider!.logoUrl || provider!.domain ? (
                  <img
                    src={provider!.logoUrl || (provider!.domain ? brandLogoUrl(provider!.domain, 64, { format: 'svg' }) : '')}
                    onError={(event) => {
                      const img = event.currentTarget as HTMLImageElement
                      if (provider!.domain) {
                        img.src = brandLogoUrl(provider!.domain, 64, { dpr: 2 })
                        img.onerror = () => { img.src = `https://logo.clearbit.com/${provider!.domain}` }
                      } else {
                        img.src = ''
                      }
                    }}
                    alt={provider!.name}
                    className="h-12 w-auto max-w-[80px] object-contain"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm text-gray-700">
        <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="h-4 w-4 rounded border-gray-300" />
        <span>Hiermit bestätige ich, dass meine Angaben korrekt sind und an die ausgewählten Anbieter übermittelt werden dürfen.</span>
      </label>

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="cursor-pointer rounded-xl px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Zurück</button>
        <button
          onClick={() => {
            actions.setMove({
              fullName,
              email,
              phone,
              birthday,
              oldAddress: { street: oldStreet, postalCode: oldPostal, city: oldCity },
              newAddress: { street: newStreet, postalCode: newPostal, city: newCity },
              alreadyMoved,
              moveDate: alreadyMoved ? '' : moveDate,
            })
            onSubmit({ fullName, email, phone, birthday })
          }}
          disabled={!isValid}
          className={`cursor-pointer inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${!isValid ? 'bg-gray-200 text-gray-500' : 'bg-gray-900 text-white hover:bg-black'}`}
        >
          Neue Adresse senden
        </button>
      </div>
    </div>
  )
}
