import { describe, expect, it } from 'vitest'
import { apps } from '@/configs/apps'
import { news } from '@/data/mockData'
import { matchesQuery, searchApps, searchNews } from './mockSearch'

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

describe('searchApps', () => {
  it('finds apps by name or description', () => {
    expect(searchApps('payslips', 'ota', apps).map((app) => app.name)).toEqual(['HR Self-Service'])
  })

  it('only returns what the selected company may see', () => {
    expect(searchApps('agent console', 'ota', apps)).toEqual([])
    expect(searchApps('agent console', 'b2b', apps).map((app) => app.name)).toEqual(['Agent Console'])
  })

  it('returns nothing for a blank query or when nothing matches', () => {
    expect(searchApps('   ', 'ota', apps)).toEqual([])
    expect(searchApps('zzzz', 'ota', apps)).toEqual([])
  })
})

describe('searchNews', () => {
  it('finds news by title or summary', () => {
    expect(searchNews('recognition', 'ota', news).map((item) => item.title)).toEqual(['Staff recognition week starts Monday'])
  })

  it('only returns what the selected company may see', () => {
    expect(searchNews('autumn cohort', 'ota', news)).toEqual([])
    expect(searchNews('autumn cohort', 'academy', news)).toHaveLength(1)
  })

  it('returns nothing for a blank query or when nothing matches', () => {
    expect(searchNews('   ', 'ota', news)).toEqual([])
    expect(searchNews('zzzz', 'ota', news)).toEqual([])
  })
})
