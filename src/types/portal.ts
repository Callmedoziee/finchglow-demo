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

/** Anything that can be shown to some companies and hidden from others. */
export interface Targeted {
  /** Company ids this item is for. Use '*' for the whole group. */
  companies: CompanyId[] | '*'
}

export interface PortalApp extends Targeted {
  id: string
  name: string
  description: string
  category: AppCategory
  url: string
}

export type Severity = 'information' | 'warning' | 'critical'

export interface Alert extends Targeted {
  id: string
  severity: Severity
  title: string
  body: string
  publishedAt: string
}

export interface NewsItem extends Targeted {
  id: string
  title: string
  summary: string
  publishedAt: string
}
