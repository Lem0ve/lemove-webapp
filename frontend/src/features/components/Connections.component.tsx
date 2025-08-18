import { useHome } from '../Home.context'
import { ConnectionCard } from './ConnectionCard.component'
import { Plus } from 'lucide-react'

type Props = { onStartAdd?: () => void }

export const Connections = ({ onStartAdd }: Props) => {
    const { connections, actions } = useHome()

    return (
        <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Meine Verbindungen</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {connections.map((r) => (
                    <ConnectionCard key={r.id} item={r} onUpdate={(patch) => actions.updateConnection(r.id, patch)} onRemove={() => actions.removeConnection(r.id)} />
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
