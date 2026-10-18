import { categoryOrder } from '@/config/apps'
import type { AppCategory, PortalApp } from '@/types/portal'

export interface AppGroup {
  category: AppCategory
  label: string
  apps: PortalApp[]
}

/** Groups apps by category in the configured order, leaving out categories with no apps. */
export const groupApps = (appList: PortalApp[]): AppGroup[] => categoryOrder
    .map(({ id, label }) => ({ category: id, label, apps: appList.filter((app) => app.category === id) }))
    .filter((group) => group.apps.length > 0)
