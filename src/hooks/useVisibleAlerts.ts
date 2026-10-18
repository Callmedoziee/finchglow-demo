import { fetchAlerts } from '@/api/mockApi'
import { useCompany } from '@/context/companyContext'
import { useAsync } from '@/hooks/useAsync'
import { filterForCompany, sortAlerts } from '@/lib/visibility'
import type { Alert } from '@/types/portal'

export type VisibleAlerts =
  | { status: 'loading' }
  | { status: 'error'; error: Error; reload: () => void }
  | { status: 'success'; critical: Alert[]; other: Alert[] }

/** Alerts for the selected company (plus group-wide ones), sorted, with critical ones split out. */
export const useVisibleAlerts = (): VisibleAlerts => {
  const { company } = useCompany()
  const request = useAsync(fetchAlerts)

  if (request.status === 'loading') return { status: 'loading' }
  if (request.status === 'error') return { status: 'error', error: request.error, reload: request.reload }

  const sorted = sortAlerts(filterForCompany(request.data, company.id))
  return {
    status: 'success',
    critical: sorted.filter((alert) => alert.severity === 'critical'),
    other: sorted.filter((alert) => alert.severity !== 'critical'),
  }
}
