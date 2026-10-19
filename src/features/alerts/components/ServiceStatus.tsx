import { useAlerts } from '@/utils/context/alertsContext'
import { severityStyles } from '@/configs/severity'
import { useCompany } from '@/utils/context/companyContext'
import { useApps } from '@/utils/context/appsContext'
import { filterForCompany } from '@/utils/helpers/visibility'

const dotClass = { critical: 'bg-critical', warning: 'bg-warning', information: 'bg-accent' } as const

/**
 * A short status strip derived from the alerts: either "all systems operational", or one row per alert
 * that says what it affects (alert.impact), with a link that jumps to that alert on this same page.
 * Nothing here is stored separately, so it can never disagree with the alerts above and below it.
 */
export const ServiceStatus = () => {
  const alerts = useAlerts()
  const { company } = useCompany()
  const apps = useApps()
  if (alerts.status !== 'success') return null

  const visibleApps =
    apps.status === 'success' || apps.status === 'stale' ? filterForCompany(apps.data, company.id) : []
  const incidents = [...alerts.critical, ...alerts.other].filter((alert) => alert.impact)

  return (
    <section aria-labelledby="service-status-heading" className="rounded-xl border border-border bg-surface p-4">
      <h2 id="service-status-heading" className="text-sm font-bold uppercase tracking-wide text-subtle">
        Service status
      </h2>
      {incidents.length === 0 ? (
        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-success">
          <span aria-hidden="true" className="size-2 rounded-full bg-success" />
          All systems operational
        </p>
      ) : (
        <ul className="mt-2 flex flex-col gap-2">
          {incidents.map((alert) => {
            const impact = alert.impact!
            const affected = visibleApps.filter((app) => impact.appIds.includes(app.id)).map((app) => app.name)
            return (
              <li key={alert.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="flex items-center gap-2 font-semibold">
                  <span aria-hidden="true" className={`size-2 rounded-full ${dotClass[alert.severity]}`} />
                  {impact.label}
                  <span className="font-normal text-muted">({severityStyles[alert.severity].label})</span>
                </span>
                {affected.length > 0 && <span className="text-muted">Affects {affected.join(', ')}</span>}
                <a href={`#alert-${alert.id}`} className="font-semibold text-accent underline">
                  View incident
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
