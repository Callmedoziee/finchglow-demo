import { createContext, useContext } from 'react'
import type { CachedState } from '@/features/offline/useCachedAsync'
import type { PortalApp } from '@/types/portal'

export type AppsState = CachedState<PortalApp[]> & { reload: () => void }

export const AppsContext = createContext<AppsState | null>(null)

/** Every app in the catalogue (not yet filtered for a company). Must be used under AppsProvider. */
export const useApps = (): AppsState => {
  const value = useContext(AppsContext)
  if (!value) throw new Error('useApps must be used inside an AppsProvider')
  return value
}
