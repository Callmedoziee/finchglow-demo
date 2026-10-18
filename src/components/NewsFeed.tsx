import { fetchNews } from '@/api/mockApi'
import { ErrorMessage, LoadingMessage } from '@/components/feedback'
import { useCompany } from '@/context/companyContext'
import { useAsync } from '@/hooks/useAsync'
import { formatPublished } from '@/lib/formatPublished'
import { filterForCompany } from '@/lib/visibility'

export const NewsFeed = () => {
  const { company } = useCompany()
  const newsRequest = useAsync(fetchNews)

  return (
    <section aria-labelledby="news-heading">
      <h2 id="news-heading" className="text-xl font-semibold">
        News
      </h2>

      {newsRequest.status === 'loading' && <LoadingMessage label="Loading news..." />}

      {newsRequest.status === 'error' && (
        <div className="mt-3">
          <ErrorMessage message={newsRequest.error.message} onRetry={newsRequest.reload} />
        </div>
      )}

      {newsRequest.status === 'success' && (
        <ul className="mt-3 flex flex-col gap-3">
          {filterForCompany(newsRequest.data, company.id)
            .sort((first, second) => second.publishedAt.localeCompare(first.publishedAt))
            .map((item) => (
              <li key={item.id} className="rounded-lg border border-line bg-surface p-4">
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.summary}</p>
                <p className="mt-2 text-sm text-muted">
                  <time dateTime={item.publishedAt}>{formatPublished(item.publishedAt)}</time>
                </p>
              </li>
            ))}
        </ul>
      )}
    </section>
  )
}
