import { describe, expect, it } from 'vitest'
import { apps } from '@/configs/apps'
import { filterForCompany } from '@/lib/visibility'
import { groupApps } from './groupApps'

describe('groupApps', () => {
  it('orders groups as configured and puts each app under its own category', () => {
    const groups = groupApps(apps)
    expect(groups.map((group) => group.category)).toEqual(['booking', 'sales', 'operations', 'learning', 'people', 'finance'])
    for (const group of groups) {
      expect(group.apps.every((app) => app.category === group.category)).toBe(true)
    }
  })

  it('leaves out categories that have no apps for the selected company', () => {
    const academyGroups = groupApps(filterForCompany(apps, 'academy'))
    expect(academyGroups.map((group) => group.category)).not.toContain('booking')
  })

  it('returns an empty list when there are no apps', () => {
    expect(groupApps([])).toEqual([])
  })
})
