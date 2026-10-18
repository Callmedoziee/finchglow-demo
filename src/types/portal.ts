export type CompanyId = string

export interface CompanyLogo {
  /** Path under /public. */
  src: string
  /** The image's own size, so the browser can reserve space before it loads (no layout shift). */
  width: number
  height: number
  /** What a screen reader says for the logo. */
  alt: string
}

export interface Company {
  id: CompanyId
  name: string
  logo: CompanyLogo
  /** The colour behind the logo. Most logos are white, so they sit on a brand-coloured pill. */
  logoBackground: string
  tagline: string
  /** Accent used for buttons, links and focus. Must reach 4.5:1 against `onAccent`. */
  accent: string
  onAccent: string
  /** Very light tint for hover and selected backgrounds. */
  accentSoft: string
}

/** The icons an app can use. Each one is a file in components/icon and an entry in features/launcher/appIcons.ts. */
export type AppIconName =
  | 'plane'
  | 'users'
  | 'briefcase'
  | 'contact'
  | 'handshake'
  | 'calendar'
  | 'package'
  | 'graduation-cap'
  | 'wrench'
  | 'id-card'
  | 'receipt'

/** Anything that can be shown to some companies and hidden from others. */
export interface Targeted {
  /** Company ids this item is for. Use '*' for the whole group. */
  companies: CompanyId[] | '*'
}

/** Work waiting for the signed-in person in an app, for example 3 expense approvals. */
export interface WaitingWork {
  count: number
  singular: string
  plural: string
}

export interface PortalApp extends Targeted {
  id: string
  name: string
  description: string
  icon: AppIconName
  url: string
  waiting?: WaitingWork
}

export type Severity = 'information' | 'warning' | 'critical'

/** Which apps an alert affects, and a short label for them, for example "Payments failing". */
export interface AlertImpact {
  label: string
  appIds: string[]
}

export interface Alert extends Targeted {
  id: string
  severity: Severity
  title: string
  body: string
  publishedAt: string
  impact?: AlertImpact
}

export interface NewsItem extends Targeted {
  id: string
  title: string
  summary: string
  publishedAt: string
}
