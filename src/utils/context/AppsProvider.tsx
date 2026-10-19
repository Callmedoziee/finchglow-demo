import type { ReactNode } from 'react'
import { fetchApps } from '@/services/mockApi'
import { CACHE_KEYS } from '@/utils/helpers/offlineCache'
import { useCachedAsync } from '@/utils/hooks/useCachedAsync'
import { AppsContext } from './appsContext'

/**
 * Loads the app catalogue once and shares it. The launcher shows the apps, and the greeting counts waiting
 * work and incidents from them, so both read the same copy. Loading it at the same moment as the alerts
 * also means the page can be drawn once, with nothing arriving later to push things down.
 */
export const AppsProvider = ({ children }: { children: ReactNode }) => {
  const apps = useCachedAsync(CACHE_KEYS.apps, fetchApps)
  return <AppsContext.Provider value={apps}>{children}</AppsContext.Provider>
}
