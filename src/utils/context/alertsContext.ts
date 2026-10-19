import { createContext, useContext } from 'react'
import type { VisibleAlerts } from '@/utils/hooks/useVisibleAlerts'

export const AlertsContext = createContext<VisibleAlerts | null>(null)

/** The alerts for the selected company. Must be used under AlertsProvider. */
export const useAlerts = (): VisibleAlerts => {
  const value = useContext(AlertsContext)
  if (!value) throw new Error('useAlerts must be used inside an AlertsProvider')
  return value
}
