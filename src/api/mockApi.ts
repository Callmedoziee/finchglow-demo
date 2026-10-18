import { apps } from '@/config/apps'
import { alerts, currentEmployee, news, type Employee } from '@/data/mockData'
import { searchPortal, type SearchResults } from '@/lib/search'
import type { Alert, CompanyId, NewsItem, PortalApp } from '@/types/portal'

export interface ApiBehaviour {
  /** Milliseconds each call takes, to make loading states visible. */
  delayMs: number
  /** 0 to 1. The share of calls that fail. */
  failureRate: number
}

const apiBehaviour: ApiBehaviour = { delayMs: 400, failureRate: 0 }

/** Tests and the demo toggle use this to slow down or break the fake API. */
export const configureApi = (changes: Partial<ApiBehaviour>): void => {
  // Only overwrite what was actually provided; `undefined` must not wipe a value.
  if (changes.delayMs !== undefined) apiBehaviour.delayMs = changes.delayMs
  if (changes.failureRate !== undefined) apiBehaviour.failureRate = changes.failureRate
}

export class ApiError extends Error {
  constructor(message = 'The service could not be reached. Please try again.') {
    super(message)
    this.name = 'ApiError'
  }
}

const simulateResponse = <T>(data: T): Promise<T> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < apiBehaviour.failureRate) reject(new ApiError())
      else resolve(structuredClone(data))
    }, apiBehaviour.delayMs)
  })

export const fetchEmployee = (): Promise<Employee> => simulateResponse(currentEmployee)
export const fetchApps = (): Promise<PortalApp[]> => simulateResponse(apps)
export const fetchAlerts = (): Promise<Alert[]> => simulateResponse(alerts)
export const fetchNews = (): Promise<NewsItem[]> => simulateResponse(news)

/** The company filter runs here, as a real search service would do it, so the browser never receives hidden content. */
export const searchContent = (query: string, companyId: CompanyId): Promise<SearchResults> =>
  simulateResponse(searchPortal(query, companyId, apps, news))
