import { useState } from 'react'
import { ServiceStatus } from '@/features/alerts/ServiceStatus'
import { Greeting } from './Greeting'
import { LauncherSection } from '@/features/launcher/LauncherSection'
import { UpdatesCard } from '@/features/updates/UpdatesCard'
import { SearchBar } from '@/features/search/SearchBar'
import { SearchResultsSection } from '@/features/search/SearchResultsSection'
import { useCompany } from '@/features/company/companyContext'
import type { Employee } from '@/data/mockData'
import { useDebouncedValue } from '@/features/search/useDebouncedValue'

const SEARCH_DELAY_MS = 250

/** The page itself, inside <main>. The critical alert band and offline bar sit above it (see AlertsBar). */
export const PortalHome = ({ employee }: { employee: Employee }) => {
  const { company } = useCompany()
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query.trim(), SEARCH_DELAY_MS)
  // Emptying the box returns to the normal page straight away; only typing waits for the pause.
  const activeQuery = query.trim() === '' ? '' : debouncedQuery

  return (
    <div className="flex flex-col gap-8">
      <Greeting employee={employee} />
      <SearchBar value={query} onChange={setQuery} />

      {activeQuery !== '' ? (
        <SearchResultsSection key={`${company.id}:${activeQuery}`} query={activeQuery} onClear={() => setQuery('')} />
      ) : (
        <>
        <ServiceStatus />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <LauncherSection />
          </div>
          <div className="min-w-0">
            <UpdatesCard />
          </div>
        </div>
        </>
      )}
    </div>
  )
}
