import { createContext, useContext } from 'react'

const HomeCtx = createContext<boolean | null>(null)

export const HomeProvider = ({ children }: { children: React.ReactNode }) => {
  return <HomeCtx.Provider value={true}>{children}</HomeCtx.Provider>
}

export const useHome = () => {
  const ctx = useContext(HomeCtx)
  if (ctx == null) throw new Error('useHome must be used within HomeProvider')
  return ctx
}
