import { formatPublished } from '@/lib/formatPublished'
import type { NewsItem } from '@/types/portal'

/** One news item. Used by the news feed and by search results, so both look the same. */
export const NewsCard = ({ item }: { item: NewsItem }) => (
  <li className="rounded-lg border border-line bg-surface p-4">
    <h3 className="text-base font-semibold">{item.title}</h3>
    <p className="mt-1 text-sm text-muted">{item.summary}</p>
    <p className="mt-2 text-sm text-muted">
      <time dateTime={item.publishedAt}>{formatPublished(item.publishedAt)}</time>
    </p>
  </li>
)
