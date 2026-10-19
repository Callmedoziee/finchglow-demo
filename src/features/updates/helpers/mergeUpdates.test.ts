import { describe, expect, it } from 'vitest'
import type { Alert, NewsItem } from '@/types/portal'
import { applyFilter, mergeUpdates } from './mergeUpdates'

const alert = (id: string, publishedAt: string): Alert => ({
  id,
  severity: 'warning',
  title: id,
  body: '',
  publishedAt,
  companies: '*',
})
const news = (id: string, publishedAt: string): NewsItem => ({ id, title: id, summary: '', publishedAt, companies: '*' })

describe('mergeUpdates', () => {
  it('puts alerts and news in one list, newest first', () => {
    const merged = mergeUpdates(
      [alert('a-old', '2026-10-10T08:00:00Z'), alert('a-new', '2026-10-17T08:00:00Z')],
      [news('n-mid', '2026-10-14T08:00:00Z')],
    )

    expect(merged.map((update) => (update.kind === 'alert' ? update.alert.id : update.item.id))).toEqual([
      'a-new',
      'n-mid',
      'a-old',
    ])
  })

  it('does not change the lists it was given', () => {
    const alerts = [alert('a-1', '2026-10-10T08:00:00Z'), alert('a-2', '2026-10-17T08:00:00Z')]
    mergeUpdates(alerts, [])
    expect(alerts.map((a) => a.id)).toEqual(['a-1', 'a-2'])
  })
})

describe('applyFilter', () => {
  const merged = mergeUpdates([alert('a-1', '2026-10-17T08:00:00Z')], [news('n-1', '2026-10-14T08:00:00Z')])

  it('keeps everything for all, and only one kind otherwise', () => {
    expect(applyFilter(merged, 'all')).toHaveLength(2)
    expect(applyFilter(merged, 'alerts').map((u) => u.kind)).toEqual(['alert'])
    expect(applyFilter(merged, 'news').map((u) => u.kind)).toEqual(['news'])
  })
})
