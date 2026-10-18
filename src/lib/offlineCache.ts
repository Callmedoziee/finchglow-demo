export interface CacheEntry<T> {
  /** ISO timestamp of when this copy was saved. */
  savedAt: string
  data: T
}

/** The names under which each kind of content is saved. */
export const CACHE_KEYS = {
  alerts: 'alerts',
  news: 'news',
  apps: 'apps',
} as const

const PREFIX = 'finchglow-portal:'

const isCacheEntry = (value: unknown): value is CacheEntry<unknown> =>
  typeof value === 'object' && value !== null && 'savedAt' in value && typeof value.savedAt === 'string' && 'data' in value

/** Saves a copy of the data. Storage can be full or blocked (private browsing), so failure is ignored. */
export const saveToCache = <T>(key: string, data: T): void => {
  try {
    const entry: CacheEntry<T> = { savedAt: new Date().toISOString(), data }
    localStorage.setItem(PREFIX + key, JSON.stringify(entry))
  } catch {
    // The portal still works without a saved copy; it just cannot show one later.
  }
}

/** Returns the saved copy, or null when there is none or it is unreadable. */
export const loadFromCache = <T>(key: string): CacheEntry<T> | null => {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return null
    const parsed: unknown = JSON.parse(raw)
    return isCacheEntry(parsed) ? (parsed as CacheEntry<T>) : null
  } catch {
    return null
  }
}
