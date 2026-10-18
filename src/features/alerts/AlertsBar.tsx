import { ErrorMessage } from '@/components/ui/feedback'
import { OfflineBanner } from '@/features/offline/OfflineBanner'
import { StaleNotice } from '@/features/offline/StaleNotice'
import { useAlerts } from './alertsContext'
import { CriticalAlert } from './CriticalAlert'

/**
 * Everything that must be seen first, in full-width bands under the header and above the page:
 * the offline bar, problems loading alerts, a "these are saved copies" notice, and the critical alerts.
 */
export const AlertsBar = () => {
  const alerts = useAlerts()

  return (
    <div>
      <OfflineBanner />

      {alerts.status === 'error' && (
        // If alerts cannot load, say so loudly: staff must not assume "no alerts" means "all clear".
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <ErrorMessage message={`Alerts could not be loaded. ${alerts.error.message}`} onRetry={alerts.reload} />
        </div>
      )}

      {alerts.status === 'success' && alerts.savedAt !== null && (
        // Old alerts must say they are old: a critical alert may already have been resolved, or a new one missed.
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <StaleNotice what="alerts" savedAt={alerts.savedAt} isRefreshing={alerts.isRefreshing} onRetry={alerts.reload} />
        </div>
      )}

      {alerts.status === 'success' && alerts.critical.map((alert) => <CriticalAlert key={alert.id} alert={alert} savedAt={alerts.savedAt} />)}
    </div>
  )
}
