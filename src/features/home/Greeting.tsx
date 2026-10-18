import { useState } from 'react'
import { getCompany } from '@/configs/companies'
import type { Employee } from '@/data/mockData'
import { useAlerts } from '@/features/alerts/alertsContext'
import { useCompany } from '@/features/company/companyContext'
import { useApps } from '@/features/launcher/appsContext'
import { formatLongDate } from '@/lib/formatPublished'
import { filterForCompany } from '@/lib/visibility'
import { incidentsAffecting, summariseDay } from './daySummary'
import { greetingFor } from './greetingFor'

interface Props {
  employee: Employee
  /** Injected so tests do not depend on the real clock. */
  now?: Date
}

export const Greeting = ({ employee, now }: Props) => {
  const { company } = useCompany()
  const alerts = useAlerts()
  const apps = useApps()
  // Read the clock once when the component first mounts, not on every render.
  const [greetingTime] = useState(() => now ?? new Date())

  const employeeCompany = getCompany(employee.companyId)
  const isPreviewing = company.id !== employeeCompany.id

  // The sentence about the day needs both the apps and the alerts. Until they are there, show nothing rather than guess.
  const hasData = alerts.status === 'success' && (apps.status === 'success' || apps.status === 'stale')
  const summary = hasData
    ? (() => {
        const visibleApps = filterForCompany(apps.data, company.id)
        const incidents = incidentsAffecting([...alerts.critical, ...alerts.other], visibleApps)
        const waiting = visibleApps.flatMap((app) => (app.waiting ? [app.waiting] : []))
        return summariseDay(incidents.length, waiting)
      })()
    : null

  return (
    <section aria-labelledby="greeting-heading">
      <p className="text-sm text-muted">{formatLongDate(greetingTime)}</p>
      <h1 id="greeting-heading" className="mt-1 text-3xl font-extrabold sm:text-4xl">
        {greetingFor(greetingTime.getHours())}, {employee.firstName}
      </h1>

      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-muted">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent">
          <span aria-hidden="true" className="size-2 rounded-full bg-current" />
          {company.name}
        </span>
        <span>
          {employee.role} · {employee.location}
        </span>
      </p>

      {isPreviewing && (
        <p className="mt-2 text-sm text-muted">
          You are viewing {company.name}. You work at {employeeCompany.name}.
        </p>
      )}

      {summary && <p className="mt-3 text-base">{summary}</p>}
    </section>
  )
}
