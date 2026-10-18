import { useEffect } from 'react'
import { useAsync } from '@/hooks/useAsync'
import { loadFromCache, saveToCache } from '@/lib/offlineCache'

export type CachedState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  /** Fresh data from the server. */
  | { status: 'success'; data: T; savedAt: null }
  /** The refresh failed, so this is the last copy we saved. `savedAt` says how old it is. */
  | { status: 'stale'; data: T; savedAt: string; error: Error }

/**
 * Like useAsync, but remembers the last good result on the device.
 * If a later load fails, it falls back to that saved copy instead of showing nothing.
 * When the connection comes back it tries again by itself.
 * `loadData` must be a stable function, as with useAsync.
 */
export const useCachedAsync = <T>(cacheKey: string, loadData: () => Promise<T>): CachedState<T> & { reload: () => void } => {
  const request = useAsync(loadData)
  const { reload } = request
  const freshData = request.status === 'success' ? request.data : undefined

  // Save every successful result so there is something to fall back on later.
  useEffect(() => {
    if (freshData !== undefined) saveToCache(cacheKey, freshData)
  }, [cacheKey, freshData])

  // While we are not showing fresh data, refresh as soon as the device is back online.
  const needsRefresh = request.status !== 'success'
  useEffect(() => {
    if (!needsRefresh) return
    window.addEventListener('online', reload)
    return () => window.removeEventListener('online', reload)
  }, [needsRefresh, reload])

  if (request.status === 'success') return { status: 'success', data: request.data, savedAt: null, reload }
  if (request.status === 'loading') return { status: 'loading', reload }

  const saved = loadFromCache<T>(cacheKey)
  if (saved) return { status: 'stale', data: saved.data, savedAt: saved.savedAt, error: request.error, reload }
  return { status: 'error', error: request.error, reload }
}
