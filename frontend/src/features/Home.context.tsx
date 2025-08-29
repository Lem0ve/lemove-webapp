import { createContext, useContext, useMemo, useRef, useState, useEffect } from 'react'
import type { Partner, PartnerStatus } from './Home.interactor'
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
  partners: Partner[]
  isDispatching: boolean
}

type HomeActions = {
  setMove: (patch: Partial<MoveState>) => void
  addPartner: (partner: Omit<Partner, 'id' | 'status'> & { status?: PartnerStatus }) => void
  updatePartner: (id: string, patch: Partial<Partner>) => void
  removePartner: (id: string) => void
  startDispatch: () => void
}

const HomeCtx = createContext<(HomeState & { actions: HomeActions }) | null>(null)

export const HomeProvider = ({ children }: { children: React.ReactNode }) => {
  const STORAGE_KEY = 'move_state_v1'
  const PARTNERS_KEY = 'partners_v1'
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
  const [partners, setPartners] = useState<Partner[]>(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(PARTNERS_KEY) : null
      if (!raw) return []
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return []
      return parsed
        .filter((item) => item && typeof item === 'object')
        .map((item) => {
          const safe: Partner = {
            id: String(item.id ?? ''),
            providerId: item.providerId ? String(item.providerId) : undefined,
            name: String(item.name ?? ''),
            category: (item.category ?? 'Sonstiges') as any,
            customerId: item.customerId != null ? String(item.customerId) : undefined,
            status: (item.status ?? 'not_contacted') as any,
          }
          return safe
        })
        .filter((item) => item.id && item.name)
    } catch {
      return []
    }
  })
  const [isDispatching, setIsDispatching] = useState(false)
  const timerRef = useRef<number | null>(null)
  const persistTimerRef = useRef<number | null>(null)
  const partnersPersistTimerRef = useRef<number | null>(null)

  const setMove = (patch: Partial<MoveState>) => setMoveState((current) => ({ ...current, ...patch }))

  const addPartner: HomeActions['addPartner'] = (input) => {
    setPartners((previous) => HomeInteractor.add(previous, input))
  }
  const updatePartner: HomeActions['updatePartner'] = (id, patch) => {
    setPartners((previous) => HomeInteractor.update(previous, id, patch))
  }
  const removePartner: HomeActions['removePartner'] = (id) => {
    setPartners((previous) => HomeInteractor.remove(previous, id))
  }

  const isAddressComplete = useMemo(() => {
    const isFilled = (address: Address) => address.street && address.postalCode && address.city
    return isFilled(move.oldAddress) && isFilled(move.newAddress)
  }, [move])

  const startDispatch = () => {
    if (!isAddressComplete || partners.length === 0) return
    setIsDispatching(true)
    setPartners((previous) => HomeInteractor.beginDispatch(previous))
    const tick = () => {
      setPartners((previous) => HomeInteractor.tickDispatch(previous))
      setPartners((currentPartners) => {
        const anyLeft = currentPartners.some((partner) => partner.status === 'sent' || partner.status === 'not_contacted')
        if (!anyLeft) {
          if (timerRef.current) window.clearInterval(timerRef.current)
          timerRef.current = null
          setIsDispatching(false)
        }
        return currentPartners
      })
    }
    timerRef.current = window.setInterval(tick, 1200)
  }

  useEffect(() => () => {
    if (timerRef.current) window.clearInterval(timerRef.current)
    if (persistTimerRef.current) window.clearTimeout(persistTimerRef.current)
    if (partnersPersistTimerRef.current) window.clearTimeout(partnersPersistTimerRef.current)
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

  useEffect(() => {
    if (partnersPersistTimerRef.current) window.clearTimeout(partnersPersistTimerRef.current)
    partnersPersistTimerRef.current = window.setTimeout(() => {
      try {
        window.localStorage.setItem(PARTNERS_KEY, JSON.stringify(partners))
      } catch { }
    }, 200)
  }, [partners])

  return (
    <HomeCtx.Provider value={{ move, partners, isDispatching, actions: { setMove, addPartner, updatePartner, removePartner, startDispatch } }}>
      {children}
    </HomeCtx.Provider>
  )
}

export const useHome = () => {
  const ctx = useContext(HomeCtx)
  if (ctx == null) throw new Error('useHome must be used within HomeProvider')
  return ctx
}
