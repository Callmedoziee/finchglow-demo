/**
 * Formats an ISO timestamp such as 2026-10-17T08:05:00Z for display, e.g. "17 Oct 2026, 08:05".
 * Uses the viewer's time zone unless one is given (tests pass 'UTC' so results never vary).
 */
export const formatPublished = (isoTimestamp: string, timeZone?: string): string =>
  new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone }).format(new Date(isoTimestamp))

/** Just the clock time, e.g. "09:05". Same time-zone rule as formatPublished. */
export const formatTimeOfDay = (isoTimestamp: string, timeZone?: string): string =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone }).format(new Date(isoTimestamp))
