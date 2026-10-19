import { getCompany } from '@/configs/companies'
import type { Targeted } from '@/types/portal'

/** Who an item is for, in words: "Group-wide" or the names of the companies. Used for scope chips. */
export const audienceLabel = (item: Targeted): string =>
  item.companies === '*' ? 'Group-wide' : item.companies.map((id) => getCompany(id).name).join(', ')
