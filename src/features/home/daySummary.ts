import type { Alert, PortalApp, WaitingWork } from '@/types/portal'

/** The alerts that affect at least one of these apps. Used to count "incidents" for the person. */
export const incidentsAffecting = (alerts: Alert[], apps: PortalApp[]): Alert[] =>
  alerts.filter((alert) => alert.impact?.appIds.some((appId) => apps.some((app) => app.id === appId)))

const describeWaiting = (work: WaitingWork): string => `${work.count} ${work.count === 1 ? work.singular : work.plural}`

/**
 * One sentence about the person's day, for example:
 * "One incident affects a tool you use today, and 3 expense approvals are waiting for you."
 * Built from counts, never typed out, so it is always true of the data on screen.
 */
export const summariseDay = (incidentCount: number, waiting: WaitingWork[]): string => {
  const incidentText =
    incidentCount === 0
      ? null
      : incidentCount === 1
        ? 'One incident affects a tool you use today'
        : `${incidentCount} incidents affect tools you use today`

  // Mention at most two kinds of waiting work, so the sentence stays short.
  const shown = waiting.filter((work) => work.count > 0).slice(0, 2)
  const isSingle = shown.length === 1 && shown[0].count === 1
  const waitingText =
    shown.length === 0 ? null : `${shown.map(describeWaiting).join(' and ')} ${isSingle ? 'is' : 'are'} waiting for you`

  if (!incidentText && !waitingText) return 'You are all caught up.'
  return `${[incidentText, waitingText].filter(Boolean).join(', and ')}.`
}
