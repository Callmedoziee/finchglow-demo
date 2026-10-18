/**
 * Formats an ISO timestamp such as 2026-10-17T08:05:00Z for display, e.g. "17 Oct 2026, 08:05".
 * Uses the viewer's time zone unless one is given (tests pass 'UTC' so results never vary).
 */
export const formatPublished = (isoTimestamp: string, timeZone?: string): string =>
  new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone }).format(new Date(isoTimestamp))
