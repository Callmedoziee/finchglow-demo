import { ServiceStatus } from '@/features/alerts/ServiceStatus'
import type { Employee } from '@/data/mockData'
import { LauncherSection } from '@/features/launcher/LauncherSection'
import { Search } from '@/features/search/Search'
import { UpdatesCard } from '@/features/updates/UpdatesCard'
import { Greeting } from './Greeting'

/** The page itself, inside <main>. The critical alert band and offline bar sit above it (see AlertsBar). */
export const PortalHome = ({ employee }: { employee: Employee }) => (
  <div className="flex flex-col gap-8">
    <Greeting employee={employee} />
    <Search />
    <ServiceStatus />
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="min-w-0 lg:col-span-2">
        <LauncherSection />
      </div>
      <div className="min-w-0">
        <UpdatesCard />
      </div>
    </div>
  </div>
)
