import { ArrowUpRightIcon } from '@/components/icon/ArrowUpRightIcon'
import type { AppIncident } from '@/features/alerts/helpers/incidentFor'
import type { PortalApp } from '@/types/portal'
import { appIcons } from '@/features/launcher/helpers/appIcons'

const incidentChipClass: Record<AppIncident['severity'], string> = {
  critical: 'bg-critical-soft text-critical',
  warning: 'bg-warning-soft text-warning',
  information: 'bg-accent-soft text-accent',
}

const Chip = ({ className, children }: { className: string; children: string }) => (
  <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
    <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
    {children}
  </span>
)

/**
 * One launcher tile. A real link, so Enter works, middle-click works and screen readers say "link".
 * It shows at most one badge: an incident affecting the app (derived from the alerts) comes first,
 * otherwise the work waiting for the person. The badge is text, so meaning never depends on colour alone.
 */
export const AppTile = ({ app, incident }: { app: PortalApp; incident?: AppIncident }) => {
  const AppIcon = appIcons[app.icon]
  const hasCriticalIncident = incident?.severity === 'critical'

  return (
    <a
      href={app.url}
      className={`flex h-full min-h-40 flex-col rounded-xl border bg-surface p-4 hover:border-accent ${
        hasCriticalIncident ? 'border-critical/40' : 'border-border'
      }`}
    >
      <span className="flex items-start justify-between">
        <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent">
          <AppIcon className="size-6" />
        </span>
        <ArrowUpRightIcon className="size-4 text-muted" />
      </span>
      <span className="mt-4 block text-base font-semibold text-foreground">{app.name}</span>
      <span className="mt-1 block text-sm text-muted">{app.description}</span>
      {(incident || app.waiting) && (
        <span className="mt-auto flex pt-3">
          {incident ? (
            <Chip className={incidentChipClass[incident.severity]}>{incident.label}</Chip>
          ) : (
            app.waiting && <Chip className="bg-accent-soft text-accent">{`${app.waiting.count} waiting for you`}</Chip>
          )}
        </span>
      )}
    </a>
  )
}
