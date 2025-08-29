import { useHome } from '../Home.context'
import { PartnerCard } from './PartnerCard.component'
import { Plus } from 'lucide-react'

type Props = { onStartAdd?: () => void }

export const Partners = ({ onStartAdd }: Props) => {
    const { partners, actions } = useHome()

    return (
        <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Meine Partner</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {partners.map((partner) => (
                    <PartnerCard key={partner.id} item={partner} onUpdate={(patch) => actions.updatePartner(partner.id, patch)} onRemove={() => actions.removePartner(partner.id)} />
                ))}

                {/* Add tile at the end */}
                <button
                    onClick={() => onStartAdd?.()}
                    className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
                >
                    <span className="inline-flex items-center gap-2 text-sm font-medium">
                        <Plus className="h-4 w-4" /> Hinzufügen
                    </span>
                </button>
            </div>
        </div>
    )
}
