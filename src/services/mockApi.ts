import { apps } from '@/configs/apps'
import { alerts, currentEmployee, news, type Employee } from '@/data/mockData'
import { searchApps as findApps, searchNews as findNews } from './mockSearch'
import type { Alert, CompanyId, NewsItem, PortalApp } from '@/types/portal'

/** The calls the fake API offers, so the demo and tests can break one of them while the others keep working. */
export type ApiEndpoint = 'employee' | 'apps' | 'alerts' | 'news' | 'searchApps' | 'searchNews'

export interface ApiBehaviour {
  /** Milliseconds each call takes, to make loading states visible. */
  delayMs: number
  /** 0 to 1. The share of calls that fail. */
  failureRate: number
  /** Calls that always fail, whatever failureRate says. */
  failingEndpoints: ApiEndpoint[]
}

const apiBehaviour: ApiBehaviour = { delayMs: 400, failureRate: 0, failingEndpoints: [] }

export const getApiBehaviour = (): ApiBehaviour => ({ ...apiBehaviour, failingEndpoints: [...apiBehaviour.failingEndpoints] })

/** Tests and the demo toggle use this to slow down or break the fake API. */
export const configureApi = (changes: Partial<ApiBehaviour>): void => {
  // Only overwrite what was actually provided; `undefined` must not wipe a value.
  if (changes.delayMs !== undefined) apiBehaviour.delayMs = changes.delayMs
  if (changes.failureRate !== undefined) apiBehaviour.failureRate = changes.failureRate
  if (changes.failingEndpoints !== undefined) apiBehaviour.failingEndpoints = [...changes.failingEndpoints]
}

export class ApiError extends Error {
  constructor(message = 'The service could not be reached. Please try again.') {
    super(message)
    this.name = 'ApiError'
  }
}

const simulateResponse = <T>(endpoint: ApiEndpoint, data: T): Promise<T> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!navigator.onLine) reject(new ApiError('You are offline.'))
      else if (apiBehaviour.failingEndpoints.includes(endpoint) || Math.random() < apiBehaviour.failureRate) reject(new ApiError())
      else resolve(structuredClone(data))
    }, apiBehaviour.delayMs)
  })

export const fetchEmployee = (): Promise<Employee> => simulateResponse('employee', currentEmployee)
export const fetchApps = (): Promise<PortalApp[]> => simulateResponse('apps', apps)
export const fetchAlerts = (): Promise<Alert[]> => simulateResponse('alerts', alerts)
export const fetchNews = (): Promise<NewsItem[]> => simulateResponse('news', news)

/**
 * Apps and news are searched by two separate calls, so one can fail while the other still answers.
 * The company filter runs here, as a real search service would do it, so the browser never receives hidden content.
 */
export const searchApps = (query: string, companyId: CompanyId): Promise<PortalApp[]> =>
  simulateResponse('searchApps', findApps(query, companyId, apps))

export const searchNews = (query: string, companyId: CompanyId): Promise<NewsItem[]> =>
  simulateResponse('searchNews', findNews(query, companyId, news))
