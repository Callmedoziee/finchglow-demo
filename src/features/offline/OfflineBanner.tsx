import { useAlerts } from '@/context/alertsContext'
import { OfflineIcon } from '@/components/icon/OfflineIcon'
import { formatTimeOfDay } from '@/utils/helpers/formatPublished'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { requestRefresh } from '@/utils/helpers/refreshEvent'

/**
 * A full-width dark bar under the header while the device is offline.
 * The status region is always on the page, and only its content changes. Screen readers
 * reliably announce changes inside a region that already exists, but often miss one that
 * appears from nothing.
 */
export const OfflineBanner = () => {
  const isOnline = useOnlineStatus()
  const alerts = useAlerts()
  const savedTime = alerts.status === 'success' ? formatTimeOfDay(alerts.syncedAt) : null

  return (
    <div role="status">
      {!isOnline && (
        <div className="bg-foreground text-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
            <OfflineIcon className="size-6 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-bold">You are offline</p>
              <p className="text-sm">
                {savedTime ? `Showing alerts saved at ${savedTime}. ` : 'Showing what is saved on this device. '}
                They will refresh by themselves as soon as you reconnect.
              </p>
            </div>
            <button
              type="button"
              onClick={requestRefresh}
              className="min-h-11 rounded-lg border border-white px-4 text-sm font-semibold text-white"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
