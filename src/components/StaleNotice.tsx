import { formatPublished } from '@/lib/formatPublished'

interface Props {
  /** What is being shown, in plain words, e.g. "alerts". */
  what: string
  /** When the saved copy was taken. */
  savedAt: string
  /** True while a retry is running, so we do not claim it failed. */
  isRefreshing: boolean
  onRetry: () => void
}

/** Shown wherever a saved copy replaces fresh data, so nobody mistakes old information for current. */
export const StaleNotice = ({ what, savedAt, isRefreshing, onRetry }: Props) => (
  <div role="status" className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-surface p-3 text-sm">
    <p>
      Showing saved {what} from <time dateTime={savedAt}>{formatPublished(savedAt)}</time>.{' '}
      {isRefreshing ? 'Checking for updates...' : 'We could not refresh them.'}
    </p>
    {!isRefreshing && (
      <button
        type="button"
        onClick={onRetry}
        className="min-h-11 rounded-lg border border-line bg-surface px-4 font-medium text-foreground"
      >
        Try again
      </button>
    )}
  </div>
)
