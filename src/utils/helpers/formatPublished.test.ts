import { describe, expect, it } from 'vitest'
import { formatLongDate, formatPublished, formatTimeOfDay } from './formatPublished'

describe('formatPublished', () => {
  it('formats an ISO timestamp as date and time', () => {
    expect(formatPublished('2026-10-17T08:05:00Z', 'UTC')).toBe('17 Oct 2026, 08:05')
  })

  it('shows the same moment in another time zone', () => {
    expect(formatPublished('2026-10-17T08:05:00Z', 'Africa/Lagos')).toBe('17 Oct 2026, 09:05')
  })

  it('formats just the time of day', () => {
    expect(formatTimeOfDay('2026-10-17T08:05:00Z', 'UTC')).toBe('08:05')
    expect(formatTimeOfDay('2026-10-17T08:05:00Z', 'Africa/Lagos')).toBe('09:05')
  })

  it('formats a long date for the greeting', () => {
    expect(formatLongDate(new Date('2026-10-18T10:00:00Z'), 'UTC')).toBe('Sunday, 18 October')
  })
})
