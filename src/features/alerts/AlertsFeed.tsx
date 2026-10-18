import { SeverityIcon } from './SeverityIcon'
import { severityStyles } from '@/configs/severity'
import { formatPublished } from '@/lib/formatPublished'
import type { Alert } from '@/types/portal'

const AlertItem = ({ alert }: { alert: Alert }) => {
  const style = severityStyles[alert.severity]

  return (
    <li
      id={`alert-${alert.id}`}
      style={{ backgroundColor: style.background, color: style.foreground, borderColor: style.border }}
      className="wrap-anywhere scroll-mt-4 rounded-lg border-l-8 border-y border-r p-4"
    >
      <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
        <SeverityIcon severity={alert.severity} className="size-5 shrink-0" />
        {style.label}
      </p>
      <h3 className="mt-1 text-base font-semibold">{alert.title}</h3>
      <p className="mt-1 text-sm">{alert.body}</p>
      <p className="mt-2 text-sm">
        <time dateTime={alert.publishedAt}>{formatPublished(alert.publishedAt)}</time>
      </p>
    </li>
  )
}

/** Warnings and information. Critical alerts are shown separately, above everything else. */
export const AlertsFeed = ({ alerts }: { alerts: Alert[] }) => (
  <section aria-labelledby="alerts-heading" className="min-w-0">
    <h2 id="alerts-heading" className="text-xl font-semibold">
      Alerts
    </h2>
    {alerts.length === 0 ? (
      <p className="mt-3 text-muted">No other alerts right now.</p>
    ) : (
      <ul className="mt-3 flex flex-col gap-3">
        {alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </ul>
    )}
  </section>
)
