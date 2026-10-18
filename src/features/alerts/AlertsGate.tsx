import type { ReactNode } from 'react'
import { LoadingMessage } from '@/components/ui/feedback'
import { useAlerts } from './alertsContext'
import { useHasElapsed } from './useHasElapsed'

/** The longest we hold the page back while waiting for alerts. */
const ALERTS_WAIT_LIMIT_MS = 1500

/**
 * Alerts settle first. While they load, only "Checking for alerts..." is shown; then the alert bands and the
 * page appear together. If the bands were inserted later, anything already on screen would be pushed down
 * (a layout shift measured at 0.6 before this gate). A slow alerts service can only hold the page for a limited time.
 */
export const AlertsGate = ({ children }: { children: ReactNode }) => {
  const alerts = useAlerts()
  const waitedLongEnough = useHasElapsed(ALERTS_WAIT_LIMIT_MS)

  if (alerts.status === 'loading' && !waitedLongEnough) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <LoadingMessage label="Checking for alerts..." />
      </div>
    )
  }

  return <>{children}</>
}
