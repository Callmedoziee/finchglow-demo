import type { Alert, Severity } from '@/types/portal'

export interface AppIncident {
  label: string
  severity: Severity
}

const severityOrder: Severity[] = ['critical', 'warning', 'information']

/**
 * The most serious alert that affects this app, as a short label for its tile (for example "Payments failing"),
 * or undefined when nothing affects it. The tile derives this from the alerts, so the two can never disagree.
 */
export const incidentFor = (appId: string, alerts: Alert[]): AppIncident | undefined => {
  const affecting = alerts.filter((alert) => alert.impact?.appIds.includes(appId))
  const worst = [...affecting].sort(
    (first, second) => severityOrder.indexOf(first.severity) - severityOrder.indexOf(second.severity),
  )[0]
  return worst?.impact ? { label: worst.impact.label, severity: worst.severity } : undefined
}
