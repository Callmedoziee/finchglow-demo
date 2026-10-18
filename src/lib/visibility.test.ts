import { describe, expect, it } from 'vitest'
import { alerts } from '../data/mockData'
import { filterForCompany, isVisibleTo, sortAlerts } from './visibility'

describe('isVisibleTo', () => {
  it('shows group-wide items to every company', () => {
    expect(isVisibleTo({ companies: '*' }, 'academy')).toBe(true)
    expect(isVisibleTo({ companies: '*' }, 'facilities')).toBe(true)
  })

  it('shows targeted items only to listed companies', () => {
    expect(isVisibleTo({ companies: ['ota', 'holidays'] }, 'ota')).toBe(true)
    expect(isVisibleTo({ companies: ['ota', 'holidays'] }, 'tmc')).toBe(false)
  })
})

describe('filterForCompany', () => {
  it('always keeps group-wide critical alerts, whichever company is selected', () => {
    for (const companyId of ['academy', 'ota', 'b2b', 'tmc', 'holidays', 'facilities']) {
      const visible = filterForCompany(alerts, companyId)
      expect(visible.some((alert) => alert.severity === 'critical' && alert.companies === '*')).toBe(true)
    }
  })

  it('hides another company\'s alerts', () => {
    const titles = filterForCompany(alerts, 'tmc').map((alert) => alert.title)
    expect(titles).not.toContain('Agent login scheduled maintenance')
  })
})

describe('sortAlerts', () => {
  it('puts critical first, then warning, then information, newest first within a level', () => {
    const sorted = sortAlerts(alerts)
    expect(sorted.map((alert) => alert.severity)).toEqual(['critical', 'warning', 'warning', 'information', 'information'])
    expect(sorted[1].publishedAt > sorted[2].publishedAt).toBe(true)
  })

  it('does not change the original array', () => {
    const copy = [...alerts]
    sortAlerts(alerts)
    expect(alerts).toEqual(copy)
  })
})
