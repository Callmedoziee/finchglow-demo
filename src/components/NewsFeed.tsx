import { fetchNews } from '@/api/mockApi'
import { ErrorMessage, LoadingMessage } from '@/components/feedback'
import { NewsCard } from '@/components/NewsCard'
import { StaleNotice } from '@/components/StaleNotice'
import { useCompany } from '@/context/companyContext'
import { useCachedAsync } from '@/hooks/useCachedAsync'
import { CACHE_KEYS } from '@/lib/offlineCache'
import { filterForCompany } from '@/lib/visibility'

export const NewsFeed = () => {
  const { company } = useCompany()
  const newsRequest = useCachedAsync(CACHE_KEYS.news, fetchNews)

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

      {(newsRequest.status === 'success' || newsRequest.status === 'stale') && (
        <ul className="mt-3 flex flex-col gap-3">
          {filterForCompany(newsRequest.data, company.id)
            .sort((first, second) => second.publishedAt.localeCompare(first.publishedAt))
            .map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
        </ul>
      )}
    </section>
  )
}
