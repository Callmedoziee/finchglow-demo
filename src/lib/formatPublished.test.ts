import { describe, expect, it } from 'vitest'
import { formatPublished } from './formatPublished'

describe('formatPublished', () => {
  it('formats an ISO timestamp as date and time', () => {
    expect(formatPublished('2026-10-17T08:05:00Z', 'UTC')).toBe('17 Oct 2026, 08:05')
  })

  it('shows the same moment in another time zone', () => {
    expect(formatPublished('2026-10-17T08:05:00Z', 'Africa/Lagos')).toBe('17 Oct 2026, 09:05')
  })
})
