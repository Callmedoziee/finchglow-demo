import { useState } from 'react'
import { getCompany } from '../config/companies'
import { useCompany } from '../context/companyContext'
import type { Employee } from '../data/mockData'
import { greetingFor } from '../lib/greeting'

interface Props {
  employee: Employee
  /** Injected so tests do not depend on the real clock. */
  now?: Date
}

export const Greeting = ({ employee, now }: Props) => {
  const { company } = useCompany()
  // Read the clock once when the component first mounts, not on every render.
  const [greetingTime] = useState(() => now ?? new Date())
  const employeeCompany = getCompany(employee.companyId)
  const isPreviewing = company.id !== employeeCompany.id

  return (
    <section aria-labelledby="greeting-heading">
      <h1 id="greeting-heading" className="text-2xl font-bold sm:text-3xl">
        {greetingFor(greetingTime.getHours())}, {employee.firstName}
      </h1>
      <p className="mt-1 text-base text-muted">
        {isPreviewing ? `You are viewing ${company.name}. You work at ${employeeCompany.name}.` : `You work at ${employeeCompany.name}.`}
      </p>
    </section>
  )
}
