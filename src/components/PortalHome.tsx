import { useState } from 'react'
import { AlertsFeed } from '@/components/AlertsFeed'
import { CriticalAlert } from '@/components/CriticalAlert'
import { ErrorMessage, LoadingMessage } from '@/components/feedback'
import { Greeting } from '@/components/Greeting'
import { LauncherSection } from '@/components/LauncherSection'
import { NewsFeed } from '@/components/NewsFeed'
import { OfflineBanner } from '@/components/OfflineBanner'
import { SearchBar } from '@/components/SearchBar'
import { SearchResultsSection } from '@/components/SearchResultsSection'
import { StaleNotice } from '@/components/StaleNotice'
import { useCompany } from '@/context/companyContext'
import type { Employee } from '@/data/mockData'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useHasElapsed } from '@/hooks/useHasElapsed'
import { useVisibleAlerts } from '@/hooks/useVisibleAlerts'

const SEARCH_DELAY_MS = 250
/** The longest we hold the page back while waiting for alerts. */
const ALERTS_WAIT_LIMIT_MS = 1500

/** Everything inside <main> once the employee is signed in. Critical alerts come first. */
export const PortalHome = ({ employee }: { employee: Employee }) => {
  const { company } = useCompany()
  const alerts = useVisibleAlerts()
  const waitedLongEnough = useHasElapsed(ALERTS_WAIT_LIMIT_MS)
  // Alerts settle first. If they arrived after the rest of the page, a critical banner would be inserted
  // above everything and shove the page down. A slow alerts service can only hold the page for a limited time.
  const isCheckingAlerts = alerts.status === 'loading' && !waitedLongEnough
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query.trim(), SEARCH_DELAY_MS)
  // Emptying the box returns to the normal page straight away; only typing waits for the pause.
  const activeQuery = query.trim() === '' ? '' : debouncedQuery

  return (
    <div className="flex flex-col gap-8">
      <OfflineBanner />

      {alerts.status === 'error' && (
        // If alerts cannot load, say so loudly: staff must not assume "no alerts" means "all clear".
        <ErrorMessage message={`Alerts could not be loaded. ${alerts.error.message}`} onRetry={alerts.reload} />
      )}

      {alerts.status === 'success' && alerts.savedAt !== null && (
        // Old alerts must say they are old: a critical alert may already have been resolved, or a new one missed.
        <StaleNotice what="alerts" savedAt={alerts.savedAt} isRefreshing={alerts.isRefreshing} onRetry={alerts.reload} />
      )}

      {alerts.status === 'success' && alerts.critical.length > 0 && (
        <div className="flex flex-col gap-3">
          {alerts.critical.map((alert) => (
            <CriticalAlert key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      {isCheckingAlerts ? (
        <LoadingMessage label="Checking for alerts..." />
      ) : (
        <>
          <Greeting employee={employee} />
          <SearchBar value={query} onChange={setQuery} />

          {activeQuery !== '' ? (
            <SearchResultsSection key={`${company.id}:${activeQuery}`} query={activeQuery} onClear={() => setQuery('')} />
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="min-w-0 lg:col-span-2">
                <LauncherSection />
              </div>
              <div className="flex min-w-0 flex-col gap-8">
                {alerts.status === 'success' && <AlertsFeed alerts={alerts.other} />}
                <NewsFeed />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
