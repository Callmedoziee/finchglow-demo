import type { Alert, CompanyId, Severity } from '../types/portal'

interface Targeted {
  companies: CompanyId[] | '*'
}

/** True when the item is group-wide or lists this company. */
export const isVisibleTo = (item: Targeted, companyId: CompanyId): boolean =>
  item.companies === '*' || item.companies.includes(companyId)

export const filterForCompany = <T extends Targeted>(items: T[], companyId: CompanyId): T[] =>
  items.filter((item) => isVisibleTo(item, companyId))

const severityRank: Record<Severity, number> = { critical: 0, warning: 1, information: 2 }

/** Critical first, then warnings, then information; newest first within a level. */
export const sortAlerts = (list: Alert[]): Alert[] =>
  [...list].sort(
    (a, b) => severityRank[a.severity] - severityRank[b.severity] || b.publishedAt.localeCompare(a.publishedAt),
  )
