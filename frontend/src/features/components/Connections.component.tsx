import { useHome } from '../Home.context'
import { AddConnectionForm } from './AddConnectionForm.component'
import { ConnectionCard } from './ConnectionCard.component'

export const Connections = () => {
  const { connections, actions } = useHome()

  return (
    <div className="space-y-4">
      <AddConnectionForm onSubmit={({ name, category, customerId }) => actions.addConnection({ name, category, customerId })} />
      {connections.length === 0 ? (
        <div className="rounded-xl border border-gray-200 p-6 text-sm text-gray-600">Keine Einträge. Über das Formular hinzufügen.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {connections.map((r) => (
            <ConnectionCard key={r.id} item={r} onUpdate={(patch) => actions.updateConnection(r.id, patch)} onRemove={() => actions.removeConnection(r.id)} />
          ))}
        </div>
      )}
    </div>
  )
}
