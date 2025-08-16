import { useState } from 'react'
import type { ProviderCategory } from '../Home.interactor'
import { Plus } from 'lucide-react'

const CATEGORIES: ProviderCategory[] = ['Konten', 'Versicherungen', 'Abos', 'Sonstiges']

export const AddConnectionForm = ({ onSubmit }: { onSubmit: (v: { name: string; category: ProviderCategory; customerId?: string }) => void }) => {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ProviderCategory>('Konten')
  const [customerId, setCustomerId] = useState('')

  function submit() {
    if (!name.trim()) return
    onSubmit({ name: name.trim(), category, customerId: customerId.trim() || undefined })
    setName('')
    setCustomerId('')
    setCategory('Konten')
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="md:col-span-5">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-gray-700">Name (z. B. Sparkasse, TK, o2)</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900" placeholder="z. B. ING, TK, o2" />
          </label>
        </div>
        <div className="md:col-span-3">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-gray-700">Kategorie</span>
            <select value={category} onChange={(e) => setCategory(e.target.value as ProviderCategory)} className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="md:col-span-3">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-gray-700">Kundennummer (optional)</span>
            <input value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="w-full rounded-xl border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-900" placeholder="123456" />
          </label>
        </div>
        <div className="md:col-span-1 flex items-end">
          <button onClick={submit} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
