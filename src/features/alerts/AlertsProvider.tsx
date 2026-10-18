import type { ReactNode } from 'react'
import { AlertsContext } from './alertsContext'
import { useVisibleAlerts } from './useVisibleAlerts'

/**
 * Loads the alerts once and shares them. The critical band (above the page), the sync chip (in the header)
 * and the page itself all need the same alerts, so one request serves all three.
 * Must sit inside CompanyProvider, because the alerts depend on the selected company.
 */
export const AlertsProvider = ({ children }: { children: ReactNode }) => {
  const alerts = useVisibleAlerts()
  return <AlertsContext.Provider value={alerts}>{children}</AlertsContext.Provider>
}
