import { createContext, useContext, useMemo, useRef, useState, useEffect } from 'react'
import type { Address, MoveCore, Connection, ConnectionStatus } from './types'

export type MoveState = {
  move: MoveCore
  connections: Connection[]
  isDispatching: boolean
}

export type MoveActions = {
  setMove: (m: Partial<MoveCore>) => void
  addConnection: (c: Omit<Connection, 'id' | 'status'> & { status?: ConnectionStatus }) => void
  updateConnection: (id: string, patch: Partial<Connection>) => void
  removeConnection: (id: string) => void
  startDispatch: () => void
}

const MoveCtx = createContext<(MoveState & { actions: MoveActions }) | null>(null)

export function MoveProvider({ children }: { children: React.ReactNode }) {
  const [move, setMoveState] = useState<MoveCore>({
    oldAddress: { street: '', postalCode: '', city: '' },
    newAddress: { street: '', postalCode: '', city: '' },
    moveDate: '',
    proofFile: null,
  })
  const [connections, setConnections] = useState<Connection[]>([])
  const [isDispatching, setIsDispatching] = useState(false)
  const dispatchTimer = useRef<number | null>(null)

  const setMove = (patch: Partial<MoveCore>) => setMoveState((m) => ({ ...m, ...patch }))

  function addConnection(input: Omit<Connection, 'id' | 'status'> & { status?: ConnectionStatus }) {
    const id = Math.random().toString(36).slice(2)
    setConnections((prev) => [{ id, status: input.status ?? 'not_contacted', ...input }, ...prev])
  }
  function updateConnection(id: string, patch: Partial<Connection>) {
    setConnections((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }
  function removeConnection(id: string) {
    setConnections((prev) => prev.filter((c) => c.id !== id))
  }

  const isAddressComplete = useMemo(() => {
    const filled = (x: Address) => x.street && x.postalCode && x.city
    return filled(move.oldAddress) && filled(move.newAddress)
  }, [move])

  function startDispatch() {
    if (!isAddressComplete || connections.length === 0) return
    setIsDispatching(true)

    setConnections((prev) => prev.map((c) => (c.status === 'not_contacted' ? { ...c, status: 'sent' } : c)))

    const tick = () => {
      setConnections((prev) => {
        const up = [...prev]
        let changed = false
        for (let i = 0; i < up.length; i++) {
          const c = up[i]
          if (c.status === 'sent' && Math.random() < 0.35) {
            up[i] = { ...c, status: 'confirmed' }
            changed = true
          }
        }
        return changed ? up : prev
      })

      const anyLeft = connections.some((c) => c.status === 'sent' || c.status === 'not_contacted')
      if (!anyLeft) {
        if (dispatchTimer.current) window.clearInterval(dispatchTimer.current)
        dispatchTimer.current = null
        setIsDispatching(false)
      }
    }

    dispatchTimer.current = window.setInterval(tick, 1200)
  }

  useEffect(() => () => {
    if (dispatchTimer.current) window.clearInterval(dispatchTimer.current)
  }, [])

  return (
    <MoveCtx.Provider
      value={{
        move,
        connections,
        isDispatching,
        actions: { setMove, addConnection, updateConnection, removeConnection, startDispatch },
      }}
    >
      {children}
    </MoveCtx.Provider>
  )
}

export function useMove() {
  const ctx = useContext(MoveCtx)
  if (!ctx) throw new Error('useMove must be used inside MoveProvider')
  return ctx
}
