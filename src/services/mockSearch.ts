import { filterForCompany } from '@/lib/visibility'
import type { CompanyId, NewsItem, PortalApp } from '@/types/portal'

/** True when every word in the query appears somewhere in the text (case-insensitive). */
export const matchesQuery = (text: string, query: string): boolean => {
  const lowerCaseText = text.toLowerCase()
  const searchWords = query.toLowerCase().split(/\s+/).filter(Boolean)
  return searchWords.every((word) => lowerCaseText.includes(word))
}

/** Apps the given company may see that match the query. A blank query matches nothing. */
export const searchApps = (query: string, companyId: CompanyId, allApps: PortalApp[]): PortalApp[] =>
  query.trim() === ''
    ? []
    : filterForCompany(allApps, companyId).filter((app) => matchesQuery(`${app.name} ${app.description}`, query))

/** News the given company may see that matches the query. A blank query matches nothing. */
export const searchNews = (query: string, companyId: CompanyId, allNews: NewsItem[]): NewsItem[] =>
  query.trim() === ''
    ? []
    : filterForCompany(allNews, companyId).filter((item) => matchesQuery(`${item.title} ${item.summary}`, query))
