import { fetchApps } from '@/api/mockApi'
import { AppTile } from '@/components/AppTile'
import { ErrorMessage, LoadingMessage } from '@/components/feedback'
import { StaleNotice } from '@/components/StaleNotice'
import { useCompany } from '@/context/companyContext'
import { useCachedAsync } from '@/hooks/useCachedAsync'
import { groupApps } from '@/lib/groupApps'
import { CACHE_KEYS } from '@/lib/offlineCache'
import { filterForCompany } from '@/lib/visibility'
import type { PortalApp } from '@/types/portal'

/** The launcher grid: the apps the selected company can open, grouped by category. */
export const LauncherSection = () => {
  const { company } = useCompany()
  const appsRequest = useCachedAsync(CACHE_KEYS.apps, fetchApps)

  return (
    <section aria-labelledby="launcher-heading">
      <h2 id="launcher-heading" className="text-xl font-semibold">
        Your apps
      </h2>

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
        <AppGroups apps={filterForCompany(appsRequest.data, company.id)} companyName={company.name} />
      )}
    </section>
  )
}

const AppGroups = ({ apps, companyName }: { apps: PortalApp[]; companyName: string }) => {
  const groups = groupApps(apps)

  if (groups.length === 0) {
    return <p className="mt-3 text-muted">No apps are available for {companyName} yet.</p>
  }

  return (
    <div className="mt-3 flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.category} aria-labelledby={`group-${group.category}`}>
          <h3 id={`group-${group.category}`} className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
            {group.label}
          </h3>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {group.apps.map((app) => (
              <li key={app.id}>
                <AppTile app={app} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
