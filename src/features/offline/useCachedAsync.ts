import { useEffect, useState } from 'react'
import { useAsync } from '@/hooks/useAsync'
import { loadFromCache, saveToCache } from './offlineCache'
import { REFRESH_EVENT } from './refreshEvent'

export type CachedState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  /** Fresh data from the server. `loadedAt` is when it arrived. */
  | { status: 'success'; data: T; savedAt: null; loadedAt: string }
  /**
   * The last copy we saved, shown because a refresh failed or a retry is still running.
   * `savedAt` says how old it is. While `isRefreshing`, a retry is in flight.
   */
  | { status: 'stale'; data: T; savedAt: string; isRefreshing: boolean }

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

  // Also keep the last fresh result in memory. If the device cannot save a copy (storage full or blocked, as in
  // some private windows), this is what still shows during a retry or after a failed refresh.
  // Setting state while rendering, guarded like this, is React's way to react to a change in what we were given.
  const [lastFresh, setLastFresh] = useState<{ data: T; savedAt: string } | null>(null)
  if (request.status === 'success' && lastFresh?.data !== request.data) {
    setLastFresh({ data: request.data, savedAt: request.loadedAt })
  }

  // Save every successful result so there is something to fall back on later.
  useEffect(() => {
    if (freshData !== undefined) saveToCache(cacheKey, freshData)
  }, [cacheKey, freshData])

  // Anything can ask every data source to reload (the demo panel's "Refresh now" does).
  useEffect(() => {
    window.addEventListener(REFRESH_EVENT, reload)
    return () => window.removeEventListener(REFRESH_EVENT, reload)
  }, [reload])

  // While we are not showing fresh data, refresh as soon as the device is back online.
  const needsRefresh = request.status !== 'success'
  useEffect(() => {
    if (!needsRefresh) return
    window.addEventListener('online', reload)
    return () => window.removeEventListener('online', reload)
  }, [needsRefresh, reload])

  if (request.status === 'success') {
    return { status: 'success', data: request.data, savedAt: null, loadedAt: request.loadedAt, reload }
  }

  // During a retry, keep showing the saved copy instead of blanking the page while we wait.
  if (request.status === 'loading') {
    const saved = request.isRetry ? (lastFresh ?? loadFromCache<T>(cacheKey)) : null
    if (saved) return { status: 'stale', data: saved.data, savedAt: saved.savedAt, isRefreshing: true, reload }
    return { status: 'loading', reload }
  }

  const saved = lastFresh ?? loadFromCache<T>(cacheKey)
  if (saved) return { status: 'stale', data: saved.data, savedAt: saved.savedAt, isRefreshing: false, reload }
  return { status: 'error', error: request.error, reload }
}
