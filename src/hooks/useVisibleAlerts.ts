import { fetchAlerts } from '@/api/mockApi'
import { useCompany } from '@/context/companyContext'
import { useCachedAsync } from '@/hooks/useCachedAsync'
import { CACHE_KEYS } from '@/lib/offlineCache'
import { filterForCompany, sortAlerts } from '@/lib/visibility'
import type { Alert } from '@/types/portal'

export type VisibleAlerts =
  | { status: 'loading' }
  | { status: 'error'; error: Error; reload: () => void }
  | {
      status: 'success'
      critical: Alert[]
      other: Alert[]
      /** Set when these are saved copies because a refresh failed. Null means they are fresh. */
      savedAt: string | null
      /** True while a retry is running and the saved copy is still on screen. */
      isRefreshing: boolean
      reload: () => void
    }

/** Alerts for the selected company (plus group-wide ones), sorted, with critical ones split out. */
export const useVisibleAlerts = (): VisibleAlerts => {
  const { company } = useCompany()
  const request = useCachedAsync(CACHE_KEYS.alerts, fetchAlerts)

  if (request.status === 'loading') return { status: 'loading' }
  if (request.status === 'error') return { status: 'error', error: request.error, reload: request.reload }

  const sorted = sortAlerts(filterForCompany(request.data, company.id))
  return {
    status: 'success',
    critical: sorted.filter((alert) => alert.severity === 'critical'),
    other: sorted.filter((alert) => alert.severity !== 'critical'),
    savedAt: request.savedAt,
    isRefreshing: request.status === 'stale' && request.isRefreshing,
    reload: request.reload,
  }
}
