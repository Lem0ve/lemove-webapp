export type ProviderCategory = 'Konten' | 'Versicherungen' | 'Abos' | 'Sonstiges'

export type ConnectionStatus = 'not_contacted' | 'sent' | 'confirmed' | 'manual_done'

export type Connection = {
  id: string
  name: string
  category: ProviderCategory
  customerId?: string
  status: ConnectionStatus
}

export const HomeInteractor = {
  newId: () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2)),

  add(conns: Connection[], input: Omit<Connection, 'id' | 'status'> & { status?: ConnectionStatus }): Connection[] {
    const id = HomeInteractor.newId()
    return [{ id, status: input.status ?? 'not_contacted', ...input }, ...conns]
  },

  update(conns: Connection[], id: string, patch: Partial<Connection>): Connection[] {
    return conns.map((c) => (c.id === id ? { ...c, ...patch } : c))
  },

  remove(conns: Connection[], id: string): Connection[] {
    return conns.filter((c) => c.id !== id)
  },

  beginDispatch(conns: Connection[]): Connection[] {
    return conns.map((c) => (c.status === 'not_contacted' ? { ...c, status: 'sent' } : c))
  },

  tickDispatch(conns: Connection[]): Connection[] {
    let changed = false
    const next = conns.map((c) => {
      if (c.status === 'sent' && Math.random() < 0.35) {
        changed = true
        return { ...c, status: 'confirmed' as ConnectionStatus }
      }
      return c
    })
    return changed ? next : conns
  },
}
