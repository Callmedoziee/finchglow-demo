import { useState } from 'react'
import { AlertsFeed } from '@/components/AlertsFeed'
import { CriticalAlert } from '@/components/CriticalAlert'
import { ErrorMessage } from '@/components/feedback'
import { Greeting } from '@/components/Greeting'
import { LauncherSection } from '@/components/LauncherSection'
import { NewsFeed } from '@/components/NewsFeed'
import { SearchBar } from '@/components/SearchBar'
import { SearchResultsSection } from '@/components/SearchResultsSection'
import { useCompany } from '@/context/companyContext'
import type { Employee } from '@/data/mockData'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useVisibleAlerts } from '@/hooks/useVisibleAlerts'

const SEARCH_DELAY_MS = 250

/** Everything inside <main> once the employee is signed in. Critical alerts come first. */
export const PortalHome = ({ employee }: { employee: Employee }) => {
  const { company } = useCompany()
  const alerts = useVisibleAlerts()
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query.trim(), SEARCH_DELAY_MS)
  // Emptying the box returns to the normal page straight away; only typing waits for the pause.
  const activeQuery = query.trim() === '' ? '' : debouncedQuery

  return (
    <div className="flex flex-col gap-8">
      {alerts.status === 'error' && (
        // If alerts cannot load, say so loudly: staff must not assume "no alerts" means "all clear".
        <ErrorMessage message={`Alerts could not be loaded. ${alerts.error.message}`} onRetry={alerts.reload} />
      )}

      {alerts.status === 'success' && alerts.critical.length > 0 && (
        <div className="flex flex-col gap-3">
          {alerts.critical.map((alert) => (
            <CriticalAlert key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      <Greeting employee={employee} />
      <SearchBar value={query} onChange={setQuery} />

      {activeQuery !== '' ? (
        <SearchResultsSection key={`${company.id}:${activeQuery}`} query={activeQuery} onClear={() => setQuery('')} />
      ) : (
        <>
          <LauncherSection />
          <div className="grid gap-8 lg:grid-cols-2">
            {alerts.status === 'success' && <AlertsFeed alerts={alerts.other} />}
            <NewsFeed />
          </div>
        </>
      )}
    </div>
  )
}
