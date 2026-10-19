import { describe, expect, it } from 'vitest'
import { alerts } from '@/data/mockData'
import { incidentFor } from './incidentFor'

describe('incidentFor', () => {
  it('returns the label of the alert that affects the app', () => {
    expect(incidentFor('agent-console', alerts)).toEqual({ label: 'Payments failing', severity: 'critical' })
  })

  it('picks the most serious alert when several affect the same app', () => {
    // Both the payment failure (critical) and slow searches (warning) affect the Booking Engine.
    expect(incidentFor('booking-engine', alerts)).toEqual({ label: 'Payments failing', severity: 'critical' })
  })

  it('returns nothing for an app no alert affects', () => {
    expect(incidentFor('hr-self-service', alerts)).toBeUndefined()
  })

  it('returns nothing when there are no alerts', () => {
    expect(incidentFor('booking-engine', [])).toBeUndefined()
  })
})
