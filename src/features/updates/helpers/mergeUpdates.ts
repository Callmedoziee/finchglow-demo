import type { Alert, NewsItem } from '@/types/portal'

/** One row of the Alerts & news card: either an alert or a news item, never both. */
export type Update = { kind: 'alert'; alert: Alert } | { kind: 'news'; item: NewsItem }

export type UpdatesFilter = 'all' | 'alerts' | 'news'

export const publishedAtOf = (update: Update): string =>
  update.kind === 'alert' ? update.alert.publishedAt : update.item.publishedAt

/** Alerts and news in one list, newest first. ISO timestamps sort correctly as plain text. */
export const mergeUpdates = (alerts: Alert[], news: NewsItem[]): Update[] => {
  const all: Update[] = [
    ...alerts.map((alert): Update => ({ kind: 'alert', alert })),
    ...news.map((item): Update => ({ kind: 'news', item })),
  ]
  return all.sort((first, second) => publishedAtOf(second).localeCompare(publishedAtOf(first)))
}

export const applyFilter = (updates: Update[], filter: UpdatesFilter): Update[] =>
  filter === 'all' ? updates : updates.filter((update) => update.kind === (filter === 'alerts' ? 'alert' : 'news'))
