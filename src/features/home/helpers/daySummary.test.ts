import { describe, expect, it } from 'vitest'
import { alerts } from '@/data/mockData'
import { apps } from '@/configs/apps'
import { filterForCompany } from '@/utils/helpers/visibility'
import { incidentsAffecting, summariseDay } from './daySummary'

const expenses = { count: 3, singular: 'expense approval', plural: 'expense approvals' }
const stock = { count: 2, singular: 'stock request', plural: 'stock requests' }
const oneTrip = { count: 1, singular: 'trip approval', plural: 'trip approvals' }

describe('summariseDay', () => {
  it.each([
    [0, [], 'You are all caught up.'],
    [1, [], 'One incident affects a tool you use today.'],
    [2, [], '2 incidents affect tools you use today.'],
    [0, [expenses], '3 expense approvals are waiting for you.'],
    [0, [oneTrip], '1 trip approval is waiting for you.'],
    [1, [expenses], 'One incident affects a tool you use today, and 3 expense approvals are waiting for you.'],
    [0, [expenses, stock], '3 expense approvals and 2 stock requests are waiting for you.'],
  ])('%i incidents and %j waiting gives: %s', (incidents, waiting, expected) => {
    expect(summariseDay(incidents, waiting)).toBe(expected)
  })

  it('ignores waiting work with a count of zero', () => {
    expect(summariseDay(0, [{ count: 0, singular: 'task', plural: 'tasks' }])).toBe('You are all caught up.')
  })

  it('mentions at most two kinds of waiting work', () => {
    const many = [expenses, stock, oneTrip]
    expect(summariseDay(0, many)).toBe('3 expense approvals and 2 stock requests are waiting for you.')
  })
})

describe('incidentsAffecting', () => {
  it('counts alerts that affect an app the person can see', () => {
    const travelden = filterForCompany(apps, 'ota')
    const visibleAlerts = filterForCompany(alerts, 'ota')

    expect(incidentsAffecting(visibleAlerts, travelden).map((alert) => alert.title)).toEqual([
      'Payment gateway failure',
      'Booking platform running slowly',
    ])
  })

  it('ignores alerts about apps the person does not have', () => {
    const academyApps = filterForCompany(apps, 'academy')
    expect(incidentsAffecting(filterForCompany(alerts, 'academy'), academyApps)).toEqual([])
  })

  it('ignores alerts that name no apps', () => {
    const noImpact = alerts.filter((alert) => !alert.impact)
    expect(incidentsAffecting(noImpact, apps)).toEqual([])
  })
})
