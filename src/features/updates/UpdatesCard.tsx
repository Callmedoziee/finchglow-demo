import { useState } from 'react'
import { NewspaperIcon } from '@/components/icon/NewspaperIcon'
import { ErrorMessage, LoadingMessage } from '@/components/ui/feedback'
import { severityStyles } from '@/configs/severity'
import { SeverityIcon } from '@/features/alerts/SeverityIcon'
import { useAlerts } from '@/features/alerts/alertsContext'
import { useCompany } from '@/features/company/companyContext'
import { StaleNotice } from '@/features/offline/StaleNotice'
import { CACHE_KEYS } from '@/features/offline/offlineCache'
import { useCachedAsync } from '@/features/offline/useCachedAsync'
import { audienceLabel } from '@/lib/audienceLabel'
import { formatPublished } from '@/lib/formatPublished'
import { filterForCompany } from '@/lib/visibility'
import { fetchNews } from '@/services/mockApi'
import { applyFilter, mergeUpdates, publishedAtOf, type Update, type UpdatesFilter } from './mergeUpdates'

const filterLabels: Record<UpdatesFilter, string> = { all: 'All', alerts: 'Alerts', news: 'News' }

const UpdateRow = ({ update }: { update: Update }) => {
  const isAlert = update.kind === 'alert'
  const style = isAlert ? severityStyles[update.alert.severity] : undefined
  const title = isAlert ? update.alert.title : update.item.title
  const text = isAlert ? update.alert.body : update.item.summary
  const scope = audienceLabel(isAlert ? update.alert : update.item)

  return (
    <li
      id={isAlert ? `alert-${update.alert.id}` : `news-${update.item.id}`}
      className="flex scroll-mt-4 gap-3 border-t border-border py-4 first:border-t-0 first:pt-0 last:pb-0"
    >
      <span
        aria-hidden="true"
        style={style && { backgroundColor: style.background, color: style.foreground }}
        className={`grid size-9 shrink-0 place-items-center rounded-full ${style ? '' : 'bg-accent-soft text-accent'}`}
      >
        {isAlert ? <SeverityIcon severity={update.alert.severity} className="size-5" /> : <NewspaperIcon className="size-5" />}
      </span>
      <div className="min-w-0 wrap-anywhere">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span style={style && { color: style.foreground }} className={`font-bold ${style ? '' : 'text-accent'}`}>
            {style ? style.label : 'News'}
          </span>
          <span className="rounded-full bg-canvas px-2 py-0.5 text-xs text-muted">{scope}</span>
          <time dateTime={publishedAtOf(update)} className="text-muted">
            {formatPublished(publishedAtOf(update))}
          </time>
        </p>
        <h3 className="mt-1 text-base font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted">{text}</p>
      </div>
    </li>
  )
}

/**
 * One card for everything the company should know: its warnings and information alerts plus its news, newest first.
 * Critical alerts are not here; they own the band under the header. The chips narrow the list to one kind.
 */
export const UpdatesCard = () => {
  const { company } = useCompany()
  const alerts = useAlerts()
  const newsRequest = useCachedAsync(CACHE_KEYS.news, fetchNews)
  const [filter, setFilter] = useState<UpdatesFilter>('all')

  const newsLoaded = newsRequest.status === 'success' || newsRequest.status === 'stale'
  const visibleAlerts = alerts.status === 'success' ? alerts.other : []
  const visibleNews = newsLoaded ? filterForCompany(newsRequest.data, company.id) : []
  const everything = mergeUpdates(visibleAlerts, visibleNews)
  const shown = applyFilter(everything, filter)
  const counts: Record<UpdatesFilter, number> = {
    all: everything.length,
    alerts: visibleAlerts.length,
    news: visibleNews.length,
  }

  return (
    <section aria-labelledby="updates-heading" className="min-w-0 rounded-xl border border-border bg-surface p-4">
      <h2 id="updates-heading" className="text-xl font-bold">
        Alerts &amp; news
      </h2>

      <div role="group" aria-label="Show" className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(filterLabels) as UpdatesFilter[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
            className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${
              filter === key ? 'border-accent bg-accent text-on-accent' : 'border-line bg-surface text-foreground'
            }`}
          >
            {filterLabels[key]} <span className="font-normal">{counts[key]}</span>
          </button>
        ))}
      </div>

      {newsRequest.status === 'loading' && <LoadingMessage label="Loading news..." />}

      {newsRequest.status === 'error' && (
        <div className="mt-3">
          <ErrorMessage message={newsRequest.error.message} onRetry={newsRequest.reload} />
        </div>
      )}

      {newsRequest.status === 'stale' && (
        <div className="mt-3">
          <StaleNotice
            what="news"
            savedAt={newsRequest.savedAt}
            isRefreshing={newsRequest.isRefreshing}
            onRetry={newsRequest.reload}
          />
        </div>
      )}

      {shown.length > 0 && (
        <ul className="mt-4">
          {shown.map((update) => (
            <UpdateRow key={update.kind === 'alert' ? update.alert.id : update.item.id} update={update} />
          ))}
        </ul>
      )}
      {shown.length === 0 && (newsLoaded || newsRequest.status === 'error') && (
        <p className="mt-4 text-muted">Nothing to show here right now.</p>
      )}
    </section>
  )
}
