import { useCallback, useEffect, useState } from 'react'
import { toError } from '@/lib/toError'

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

/**
 * Runs `loadData` on mount and whenever `reload` is called.
 * `loadData` must be a stable function (defined outside the component or memoised).
 */
export const useAsync = <T>(loadData: () => Promise<T>): AsyncState<T> & { reload: () => void } => {
  const [asyncState, setAsyncState] = useState<AsyncState<T>>({ status: 'loading' })
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    loadData()
      .then((data) => {
        if (!cancelled) setAsyncState({ status: 'success', data })
      })
      .catch((error: unknown) => {
        if (!cancelled) setAsyncState({ status: 'error', error: toError(error) })
      })
    return () => {
      cancelled = true
    }
  }, [loadData, retryCount])

  // Going back to "loading" happens in the event that caused it (the retry), not inside the effect.
  const reload = useCallback(() => {
    setAsyncState({ status: 'loading' })
    setRetryCount((count) => count + 1)
  }, [])
  return { ...asyncState, reload }
}
