import { useState, type ReactNode } from 'react'
import { LoadingMessage } from '@/components/ui/feedback'
import { useAlerts } from '@/context/alertsContext'
import { useApps } from '@/context/appsContext'
import { useHasElapsed } from '@/features/home/hooks/useHasElapsed'

/** The longest we hold the page back while waiting for the alerts and the apps. */
const PORTAL_WAIT_LIMIT_MS = 1500

/**
 * Settle the alerts and the apps first, then draw the alert bands and the page together.
 * If they arrived one by one, anything already on screen would be pushed down (a layout shift measured at 0.6
 * before this gate). Both requests start at the same moment, so waiting for both costs no extra time.
 * A slow service can only hold the page for a limited time.
 * The gate only ever applies to the first load. Once the page has appeared it stays, so a later retry
 * can never hide an alert band that is already on screen.
 */
export const PortalGate = ({ children }: { children: ReactNode }) => {
  const alerts = useAlerts()
  const apps = useApps()
  const waitedLongEnough = useHasElapsed(PORTAL_WAIT_LIMIT_MS)

  const [hasSettled, setHasSettled] = useState(false)
  const settledNow = (alerts.status !== 'loading' && apps.status !== 'loading') || waitedLongEnough
  if (settledNow && !hasSettled) setHasSettled(true)

  if (!hasSettled && !settledNow) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <LoadingMessage label="Loading your portal..." />
      </div>
    )
  }

  return <>{children}</>
}
