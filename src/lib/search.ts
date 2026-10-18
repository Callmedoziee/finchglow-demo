import { filterForCompany } from '@/lib/visibility'
import type { CompanyId, NewsItem, PortalApp } from '@/types/portal'

export interface SearchResults {
  apps: PortalApp[]
  news: NewsItem[]
}

/** True when every word in the query appears somewhere in the text (case-insensitive). */
export const matchesQuery = (text: string, query: string): boolean => {
  const haystack = text.toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word))
}

/** Searches apps and news the given company is allowed to see. A blank query matches nothing. */
export const searchPortal = (
  query: string,
  companyId: CompanyId,
  allApps: PortalApp[],
  allNews: NewsItem[],
): SearchResults => {
  if (query.trim() === '') return { apps: [], news: [] }

  return {
    apps: filterForCompany(allApps, companyId).filter((app) => matchesQuery(`${app.name} ${app.description}`, query)),
    news: filterForCompany(allNews, companyId).filter((item) => matchesQuery(`${item.title} ${item.summary}`, query)),
  }
}
