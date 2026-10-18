import { fetchNews } from '@/services/mockApi'
import { ErrorMessage, LoadingMessage } from '@/components/ui/feedback'
import { NewsCard } from './NewsCard'
import { StaleNotice } from '@/features/offline/StaleNotice'
import { useCompany } from '@/features/company/companyContext'
import { useCachedAsync } from '@/features/offline/useCachedAsync'
import { CACHE_KEYS } from '@/features/offline/offlineCache'
import { filterForCompany } from '@/lib/visibility'

export const NewsFeed = () => {
  const { company } = useCompany()
  const newsRequest = useCachedAsync(CACHE_KEYS.news, fetchNews)

  return (
    <section aria-labelledby="news-heading" className="min-w-0">
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
