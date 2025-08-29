export type PartnerCategory = 'Konten' | 'Versicherungen' | 'Abos' | 'Sonstiges'

export type PartnerStatus = 'not_contacted' | 'sent' | 'confirmed' | 'manual_done'

export type Partner = {
  id: string
  providerId?: string
  name: string
  category: PartnerCategory
  customerId?: string
  status: PartnerStatus
}

export const HomeInteractor = {
  newId: () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2)),

  add(connections: Partner[], input: Omit<Partner, 'id' | 'status'> & { status?: PartnerStatus }): Partner[] {
    const id = HomeInteractor.newId()
    return [{ id, status: input.status ?? 'not_contacted', ...input }, ...connections]
  },

  update(connections: Partner[], id: string, patch: Partial<Partner>): Partner[] {
    return connections.map((connection) => (connection.id === id ? { ...connection, ...patch } : connection))
  },

  remove(connections: Partner[], id: string): Partner[] {
    return connections.filter((connection) => connection.id !== id)
  },

  beginDispatch(connections: Partner[]): Partner[] {
    return connections.map((connection) => (connection.status === 'not_contacted' ? { ...connection, status: 'sent' } : connection))
  },

  tickDispatch(connections: Partner[]): Partner[] {
    let changed = false
    const next = connections.map((connection) => {
      if (connection.status === 'sent' && Math.random() < 0.35) {
        changed = true
        return { ...connection, status: 'confirmed' as PartnerStatus }
      }
      return connection
    })
    return changed ? next : connections
  },
}
