import type { Connection, ConnectionStatus } from './types'

export const MoveInteractor = {
  newId: () => Math.random().toString(36).slice(2),

  add(conns: Connection[], input: Omit<Connection, 'id' | 'status'> & { status?: ConnectionStatus }): Connection[] {
    const id = MoveInteractor.newId()
    return [{ id, status: input.status ?? 'not_contacted', ...input }, ...conns]
  },

  update(conns: Connection[], id: string, patch: Partial<Connection>): Connection[] {
    return conns.map((c) => (c.id === id ? { ...c, ...patch } : c))
  },

  remove(conns: Connection[], id: string): Connection[] {
    return conns.filter((c) => c.id !== id)
  },
}
