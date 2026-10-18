import { useCallback } from 'react'
import { NewspaperIcon } from '@/components/icon/NewspaperIcon'
import { audienceLabel } from '@/lib/audienceLabel'
import { formatPublished } from '@/lib/formatPublished'
import { useCompany } from '@/features/company/companyContext'
import { appIcons } from '@/features/launcher/appIcons'
import { useAsync } from '@/hooks/useAsync'
import { searchApps, searchNews } from '@/services/mockApi'
import type { NewsItem, PortalApp } from '@/types/portal'

const rowClass = 'flex items-center gap-3 rounded-lg p-2 hover:bg-accent-soft focus-visible:bg-accent-soft'
const headingClass = 'px-2 pb-1 text-xs font-bold uppercase tracking-wide text-subtle'

const AppRow = ({ app, onNavigate }: { app: PortalApp; onNavigate: () => void }) => {
  const AppIcon = appIcons[app.icon]
  return (
    <li>
      <a href={app.url} data-result onClick={onNavigate} className={rowClass}>
        <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
          <AppIcon className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold">{app.name}</span>
          <span className="block truncate text-xs text-muted">{app.description}</span>
        </span>
      </a>
    </li>
  )
}

const NewsRow = ({ item, onNavigate }: { item: NewsItem; onNavigate: () => void }) => (
  <li>
    {/* News has no page of its own, so the result jumps to the item in the Alerts & news card. */}
    <a href={`#news-${item.id}`} data-result onClick={onNavigate} className={rowClass}>
      <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg bg-canvas text-muted">
        <NewspaperIcon className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{item.title}</span>
        <span className="block truncate text-xs text-muted">
          News · {audienceLabel(item)} · {formatPublished(item.publishedAt)}
        </span>
      </span>
    </a>
  </li>
)

const Unavailable = ({ what, onRetry }: { what: string; onRetry: () => void }) => (
  <div className="mx-2 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-warning-soft p-3 text-sm text-warning">
    <p>{what} search is unavailable right now.</p>
    <button type="button" onClick={onRetry} className="min-h-11 rounded-lg border border-warning bg-surface px-4 font-semibold">
      Retry
    </button>
  </div>
)

const Skeleton = () => (
  <div aria-hidden="true" className="flex flex-col gap-3 px-2 py-2">
    {[0, 1, 2].map((row) => (
      <div key={row} className="flex items-center gap-3">
        <span className="size-9 rounded-lg bg-canvas motion-safe:animate-pulse" />
        <span className="flex flex-col gap-2">
          <span className="h-3 w-40 rounded bg-canvas motion-safe:animate-pulse" />
          <span className="h-3 w-24 rounded bg-canvas motion-safe:animate-pulse" />
        </span>
      </div>
    ))}
  </div>
)

/**
 * Searches apps and news with two separate requests, so one failing never hides the other's results.
 * Mount with key={company + query}: every new search then starts from "loading", and a slow older
 * response can never replace a newer one.
 */
export const SearchResults = ({ query, onNavigate }: { query: string; onNavigate: () => void }) => {
  const { company } = useCompany()
  const findApps = useCallback(() => searchApps(query, company.id), [query, company.id])
  const findNews = useCallback(() => searchNews(query, company.id), [query, company.id])
  const apps = useAsync(findApps)
  const news = useAsync(findNews)

  const isLoading = apps.status === 'loading' || news.status === 'loading'
  const appResults = apps.status === 'success' ? apps.data : []
  const newsResults = news.status === 'success' ? news.data : []
  const total = appResults.length + newsResults.length
  const bothSucceeded = apps.status === 'success' && news.status === 'success'

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto py-2" aria-busy={isLoading}>
        {isLoading && total === 0 && <Skeleton />}

        {apps.status === 'error' && <Unavailable what="App" onRetry={apps.reload} />}
        {appResults.length > 0 && (
          <section aria-labelledby="palette-apps" className="mt-2">
            <h2 id="palette-apps" className={headingClass}>
              Apps {appResults.length}
            </h2>
            <ul>
              {appResults.map((app) => (
                <AppRow key={app.id} app={app} onNavigate={onNavigate} />
              ))}
            </ul>
          </section>
        )}

        {news.status === 'error' && <Unavailable what="News" onRetry={news.reload} />}
        {newsResults.length > 0 && (
          <section aria-labelledby="palette-news" className="mt-2">
            <h2 id="palette-news" className={headingClass}>
              News {newsResults.length}
            </h2>
            <ul>
              {newsResults.map((item) => (
                <NewsRow key={item.id} item={item} onNavigate={onNavigate} />
              ))}
            </ul>
          </section>
        )}

        {bothSucceeded && total === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="font-semibold">No results for &ldquo;{query}&rdquo;</p>
            <p className="mt-1 text-sm text-muted">
              Check the spelling or try a shorter word. Only {company.name} and group-wide content is searched.
            </p>
          </div>
        )}
      </div>

      {/* A polite live region: screen readers hear the outcome without losing their place. */}
      <p role="status" className="border-t border-border px-4 py-3 text-sm text-muted">
        {isLoading && 'Searching apps and news...'}
        {!isLoading && total > 0 && `${total} ${total === 1 ? 'result' : 'results'} in ${company.name} + group-wide`}
        {!isLoading && total === 0 && bothSucceeded && `0 results in ${company.name} + group-wide`}
        {!isLoading && !bothSucceeded && total === 0 && 'Search is unavailable right now.'}
        {!isLoading && !bothSucceeded && total > 0 && ' · one search failed'}
      </p>
    </>
  )
}
