import { useCallback } from 'react'
import { searchContent } from '@/services/mockApi'
import { AppTile } from '@/features/launcher/AppTile'
import { ErrorMessage } from '@/components/ui/feedback'
import { NewsCard } from '@/features/news/NewsCard'
import { useCompany } from '@/features/company/companyContext'
import { useAlerts } from '@/features/alerts/alertsContext'
import { incidentFor } from '@/features/alerts/incidentFor'
import { useAsync } from '@/hooks/useAsync'

interface Props {
  query: string
  onClear: () => void
}

/**
 * Mount this with key={query + company} so each new search starts from "loading" and
 * an older, slower response can never replace a newer one.
 */
export const SearchResultsSection = ({ query, onClear }: Props) => {
  const { company } = useCompany()
  const alerts = useAlerts()
  const activeAlerts = alerts.status === 'success' ? [...alerts.critical, ...alerts.other] : []
  const runSearch = useCallback(() => searchContent(query, company.id), [query, company.id])
  const search = useAsync(runSearch)

  const total = search.status === 'success' ? search.data.apps.length + search.data.news.length : 0

  return (
    <section aria-labelledby="results-heading" aria-busy={search.status === 'loading'}>
      <h2 id="results-heading" className="text-xl font-semibold">
        Search results
      </h2>

      {/* A polite live region: screen readers hear the outcome without losing their place. */}
      <p role="status" className="mt-2 text-muted">
        {search.status === 'loading' && `Searching for "${query}"...`}
        {search.status === 'success' && total > 0 && `${total} ${total === 1 ? 'result' : 'results'} for "${query}"`}
      </p>

      {search.status === 'error' && (
        <div className="mt-3">
          <ErrorMessage message={search.error.message} onRetry={search.reload} />
        </div>
      )}

      {search.status === 'success' && total === 0 && (
        <div className="mt-3 rounded-lg border border-line bg-surface p-4">
          <p className="font-medium">
            Nothing found for &ldquo;{query}&rdquo; in {company.name}.
          </p>
          <p className="mt-1 text-sm text-muted">Check the spelling or try a shorter, more general word.</p>
          <button
            type="button"
            onClick={onClear}
            className="mt-3 min-h-11 rounded-lg bg-accent px-4 font-medium text-on-accent"
          >
            Clear search
          </button>
        </div>
      )}

      {search.status === 'success' && search.data.apps.length > 0 && (
        <section aria-labelledby="results-apps" className="mt-4">
          <h3 id="results-apps" className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
            Apps
          </h3>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {search.data.apps.map((app) => (
              <li key={app.id}>
                <AppTile app={app} incident={incidentFor(app.id, activeAlerts)} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {search.status === 'success' && search.data.news.length > 0 && (
        <section aria-labelledby="results-news" className="mt-6">
          <h3 id="results-news" className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
            News
          </h3>
          <ul className="flex flex-col gap-3">
            {search.data.news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </ul>
        </section>
      )}
    </section>
  )
}
