import { describe, expect, it } from 'vitest'
import { apps } from '@/config/apps'
import { news } from '@/data/mockData'
import { matchesQuery, searchPortal } from './search'

describe('matchesQuery', () => {
  it('ignores letter case', () => {
    expect(matchesQuery('Booking Engine', 'BOOKING')).toBe(true)
  })

  it('requires every word, in any order', () => {
    expect(matchesQuery('Search, price and book flights', 'flights book')).toBe(true)
    expect(matchesQuery('Search, price and book flights', 'flights hotels')).toBe(false)
  })

  it('ignores extra spaces', () => {
    expect(matchesQuery('Booking Engine', '  booking   engine ')).toBe(true)
  })
})

describe('searchPortal', () => {
  it('finds apps by name or description', () => {
    expect(searchPortal('payslips', 'ota', apps, news).apps.map((app) => app.name)).toEqual(['HR Self-Service'])
  })

  it('finds news by title or summary', () => {
    expect(searchPortal('recognition', 'ota', apps, news).news.map((item) => item.title)).toEqual(['Staff recognition week starts Monday'])
  })

  it('only returns what the selected company may see', () => {
    expect(searchPortal('agent console', 'ota', apps, news).apps).toEqual([])
    expect(searchPortal('agent console', 'b2b', apps, news).apps.map((app) => app.name)).toEqual(['Agent Console'])
  })

  it('returns nothing for a blank query', () => {
    expect(searchPortal('   ', 'ota', apps, news)).toEqual({ apps: [], news: [] })
  })

  it('returns nothing when nothing matches', () => {
    expect(searchPortal('zzzz', 'ota', apps, news)).toEqual({ apps: [], news: [] })
  })
})
