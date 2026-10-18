import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { OfflineIcon } from '@/icons/OfflineIcon'

/**
 * The status region is always on the page, and only its content changes. Screen readers
 * reliably announce changes inside a region that already exists, but often miss one that
 * appears from nothing.
 */
export const OfflineBanner = () => {
  const isOnline = useOnlineStatus()

  return (
    <div role="status">
      {!isOnline && (
        <div className="flex items-start gap-3 rounded-lg bg-slate-800 p-4 text-white">
          <OfflineIcon className="mt-0.5 size-6 shrink-0" />
          <div>
            <p className="font-bold">You are offline</p>
            <p className="text-sm">
              You are seeing the last information saved on this device. It may be out of date. It will refresh by itself
              when you reconnect.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
