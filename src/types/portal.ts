export type CompanyId = string

export interface Company {
  id: CompanyId
  name: string
  /** Two or three letters shown in the logo mark. */
  mark: string
  tagline: string
  /** Accent used for buttons, links and focus. Must reach 4.5:1 against `onAccent`. */
  accent: string
  onAccent: string
  /** Very light tint for hover and selected backgrounds. */
  accentSoft: string
}

export type AppCategory = 'booking' | 'sales' | 'people' | 'learning' | 'operations' | 'finance'

export interface PortalApp {
  id: string
  name: string
  description: string
  category: AppCategory
  url: string
  /** Company ids that can launch this app. Use '*' for every company. */
  companies: CompanyId[] | '*'
}

export type Severity = 'information' | 'warning' | 'critical'

export interface Alert {
  id: string
  severity: Severity
  title: string
  body: string
  publishedAt: string
  /** Company ids this item is for. Use '*' for group-wide. */
  companies: CompanyId[] | '*'
}

export interface NewsItem {
  id: string
  title: string
  summary: string
  publishedAt: string
  companies: CompanyId[] | '*'
}
