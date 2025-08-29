export type ProviderCategory = 'Konten' | 'Versicherungen' | 'Abos' | 'Sonstiges'

export type ConnectionStatus = 'not_contacted' | 'sent' | 'confirmed' | 'manual_done'

export type Connection = {
  id: string
  providerId?: string
  name: string
  category: ProviderCategory
  customerId?: string
  status: ConnectionStatus
}

export const HomeInteractor = {
  newId: () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2)),

  add(connections: Connection[], input: Omit<Connection, 'id' | 'status'> & { status?: ConnectionStatus }): Connection[] {
    const id = HomeInteractor.newId()
    return [{ id, status: input.status ?? 'not_contacted', ...input }, ...connections]
  },

  update(connections: Connection[], id: string, patch: Partial<Connection>): Connection[] {
    return connections.map((connection) => (connection.id === id ? { ...connection, ...patch } : connection))
  },

  remove(connections: Connection[], id: string): Connection[] {
    return connections.filter((connection) => connection.id !== id)
  },

  beginDispatch(connections: Connection[]): Connection[] {
    return connections.map((connection) => (connection.status === 'not_contacted' ? { ...connection, status: 'sent' } : connection))
  },

  tickDispatch(connections: Connection[]): Connection[] {
    let changed = false
    const next = connections.map((connection) => {
      if (connection.status === 'sent' && Math.random() < 0.35) {
        changed = true
        return { ...connection, status: 'confirmed' as ConnectionStatus }
      }
      return connection
    })
    return changed ? next : connections
  },
}
