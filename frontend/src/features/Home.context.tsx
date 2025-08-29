import { createContext, useContext, useMemo, useRef, useState, useEffect } from 'react'
import type { Connection, ConnectionStatus } from './Home.interactor'
import { HomeInteractor } from './Home.interactor'

export type Address = {
  street: string;
  postalCode: string;
  city: string;
}

export type MoveState = {
  oldAddress: Address
  newAddress: Address
  moveDate?: string
  proofFile?: File | null
  alreadyMoved?: boolean
  fullName?: string
  email?: string
  phone?: string
  birthday?: string
}

type HomeState = {
  move: MoveState
  connections: Connection[]
  isDispatching: boolean
}

type HomeActions = {
  setMove: (patch: Partial<MoveState>) => void
  addConnection: (c: Omit<Connection, 'id' | 'status'> & { status?: ConnectionStatus }) => void
  updateConnection: (id: string, patch: Partial<Connection>) => void
  removeConnection: (id: string) => void
  startDispatch: () => void
}

const HomeCtx = createContext<(HomeState & { actions: HomeActions }) | null>(null)

export const HomeProvider = ({ children }: { children: React.ReactNode }) => {
  const STORAGE_KEY = 'move_state_v1'
  const defaultMove: MoveState = {
    oldAddress: { street: '', postalCode: '', city: '' },
    newAddress: { street: '', postalCode: '', city: '' },
    moveDate: '',
    proofFile: null,
    alreadyMoved: false,
    fullName: '',
    email: '',
    phone: '',
    birthday: '',
  }

  const [move, setMoveState] = useState<MoveState>(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
      if (!raw) return defaultMove
      const parsed = JSON.parse(raw) as Partial<MoveState>
      return {
        ...defaultMove,
        ...parsed,
        oldAddress: { ...defaultMove.oldAddress, ...(parsed?.oldAddress ?? {}) },
        newAddress: { ...defaultMove.newAddress, ...(parsed?.newAddress ?? {}) },
        moveDate: typeof parsed?.moveDate === 'string' ? parsed!.moveDate : defaultMove.moveDate,
        alreadyMoved: typeof parsed?.alreadyMoved === 'boolean' ? parsed!.alreadyMoved! : defaultMove.alreadyMoved,
      }
    } catch {
      return defaultMove
    }
  })
  const [connections, setConnections] = useState<Connection[]>([])
  const [isDispatching, setIsDispatching] = useState(false)
  const timerRef = useRef<number | null>(null)
  const persistTimerRef = useRef<number | null>(null)

  const setMove = (patch: Partial<MoveState>) => setMoveState((m) => ({ ...m, ...patch }))

  const addConnection: HomeActions['addConnection'] = (input) => {
    setConnections((prev) => HomeInteractor.add(prev, input))
  }
  const updateConnection: HomeActions['updateConnection'] = (id, patch) => {
    setConnections((prev) => HomeInteractor.update(prev, id, patch))
  }
  const removeConnection: HomeActions['removeConnection'] = (id) => {
    setConnections((prev) => HomeInteractor.remove(prev, id))
  }

  const isAddressComplete = useMemo(() => {
    const filled = (x: Address) => x.street && x.postalCode && x.city
    return filled(move.oldAddress) && filled(move.newAddress)
  }, [move])

  const startDispatch = () => {
    if (!isAddressComplete || connections.length === 0) return
    setIsDispatching(true)
    setConnections((prev) => HomeInteractor.beginDispatch(prev))
    const tick = () => {
      setConnections((prev) => HomeInteractor.tickDispatch(prev))
      setConnections((curr) => {
        const anyLeft = curr.some((c) => c.status === 'sent' || c.status === 'not_contacted')
        if (!anyLeft) {
          if (timerRef.current) window.clearInterval(timerRef.current)
          timerRef.current = null
          setIsDispatching(false)
        }
        return curr
      })
    }
    timerRef.current = window.setInterval(tick, 1200)
  }

  useEffect(() => () => {
    if (timerRef.current) window.clearInterval(timerRef.current)
    if (persistTimerRef.current) window.clearTimeout(persistTimerRef.current)
  }, [])

  useEffect(() => {
    if (persistTimerRef.current) window.clearTimeout(persistTimerRef.current)
    persistTimerRef.current = window.setTimeout(() => {
      try {
        const toSave: Omit<MoveState, 'proofFile'> & { proofFile: null } = { ...move, proofFile: null }
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
      } catch { }
    }, 300)
  }, [move])

  return (
    <HomeCtx.Provider value={{ move, connections, isDispatching, actions: { setMove, addConnection, updateConnection, removeConnection, startDispatch } }}>
      {children}
    </HomeCtx.Provider>
  )
}

export const useHome = () => {
  const ctx = useContext(HomeCtx)
  if (ctx == null) throw new Error('useHome must be used within HomeProvider')
  return ctx
}
