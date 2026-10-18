import { AlertsFeed } from '@/components/AlertsFeed'
import { CriticalAlert } from '@/components/CriticalAlert'
import { ErrorMessage } from '@/components/feedback'
import { Greeting } from '@/components/Greeting'
import { LauncherSection } from '@/components/LauncherSection'
import { NewsFeed } from '@/components/NewsFeed'
import type { Employee } from '@/data/mockData'
import { useVisibleAlerts } from '@/hooks/useVisibleAlerts'

/** Everything inside <main> once the employee is signed in. Critical alerts come first. */
export const PortalHome = ({ employee }: { employee: Employee }) => {
  const alerts = useVisibleAlerts()

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
      <LauncherSection />

      <div className="grid gap-8 lg:grid-cols-2">
        {alerts.status === 'success' && <AlertsFeed alerts={alerts.other} />}
        <NewsFeed />
      </div>
    </div>
  )
}
