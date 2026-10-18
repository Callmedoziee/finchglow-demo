import { useAlerts } from '@/features/alerts/alertsContext'
import { formatTimeOfDay } from '@/lib/formatPublished'
import { useOnlineStatus } from './useOnlineStatus'

/** A small chip in the header: "Online · synced 09:41" or "Offline · saved 09:41". Text carries the meaning; the dot is decoration. */
export const SyncStatus = () => {
  const isOnline = useOnlineStatus()
  const alerts = useAlerts()

  const isFresh = alerts.status === 'success' && alerts.savedAt === null
  const time = alerts.status === 'success' ? formatTimeOfDay(alerts.syncedAt) : null
  const good = isOnline && isFresh
  // Until the time is known, show a placeholder of similar length so the chip does not grow later
  // and wrap onto a new line on a phone, which would push the whole page down.

  return (
    <p
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ${
        good ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'
      }`}
    >
      <span aria-hidden="true" className="size-2 rounded-full bg-current" />
      {isOnline ? 'Online' : 'Offline'}
      {time ? ` · ${isFresh ? 'synced' : 'saved'} ${time}` : ' · syncing...'}
    </p>
  )
}
