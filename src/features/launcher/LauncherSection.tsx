import { ErrorMessage, LoadingMessage } from '@/components/ui/feedback'
import { useAlerts } from '@/utils/context/alertsContext'
import { incidentFor } from '@/features/alerts/helpers/incidentFor'
import { useCompany } from '@/utils/context/companyContext'
import { StaleNotice } from '@/components/ui/StaleNotice'
import { useOnlineStatus } from '@/utils/hooks/useOnlineStatus'
import { filterForCompany } from '@/utils/helpers/visibility'
import type { PortalApp } from '@/types/portal'
import { AppTile } from '@/features/launcher/components/AppTile'
import { useApps } from '@/utils/context/appsContext'

/** The launcher grid: the apps the selected company can open, each with any incident or waiting work. */
export const LauncherSection = () => {
  const { company } = useCompany()
  const appsRequest = useApps()
  const isOnline = useOnlineStatus()

  const visibleApps =
    appsRequest.status === 'success' || appsRequest.status === 'stale' ? filterForCompany(appsRequest.data, company.id) : []

  return (
    <section aria-labelledby="launcher-heading">
      <div className="flex items-baseline gap-3">
        <h2 id="launcher-heading" className="text-xl font-bold">
          Your tools
        </h2>
        {visibleApps.length > 0 && (
          <span className="text-sm text-subtle">{visibleApps.length === 1 ? '1 app' : `${visibleApps.length} apps`}</span>
        )}
        {!isOnline && <span className="ml-auto text-sm text-subtle">Opens when online</span>}
      </div>

      {appsRequest.status === 'loading' && <LoadingMessage label="Loading your apps..." />}

      {appsRequest.status === 'error' && (
        <div className="mt-3">
          <ErrorMessage message={appsRequest.error.message} onRetry={appsRequest.reload} />
        </div>
      )}

      {appsRequest.status === 'stale' && (
        <div className="mt-3">
          <StaleNotice
            what="apps"
            savedAt={appsRequest.savedAt}
            isRefreshing={appsRequest.isRefreshing}
            onRetry={appsRequest.reload}
          />
        </div>
      )}

      {(appsRequest.status === 'success' || appsRequest.status === 'stale') && (
        <AppGrid apps={visibleApps} companyName={company.name} />
      )}
    </section>
  )
}

const AppGrid = ({ apps, companyName }: { apps: PortalApp[]; companyName: string }) => {
  const alerts = useAlerts()
  const activeAlerts = alerts.status === 'success' ? [...alerts.critical, ...alerts.other] : []

  if (apps.length === 0) {
    return <p className="mt-3 text-muted">No apps are available for {companyName} yet.</p>
  }

  return (
    <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {apps.map((app) => (
        <li key={app.id}>
          <AppTile app={app} incident={incidentFor(app.id, activeAlerts)} />
        </li>
      ))}
    </ul>
  )
}
