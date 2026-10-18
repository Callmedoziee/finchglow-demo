import { useId } from 'react'
import { companies } from '../config/companies'
import { useCompany } from '../context/companyContext'

/** A native <select>: keyboard, screen reader and mobile pickers all work without extra code. */
export const CompanySwitcher = () => {
  const { company, setCompanyId } = useCompany()
  const id = useId()

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
      <label htmlFor={id} className="text-sm font-medium text-muted">
        Company
      </label>
      <select
        id={id}
        value={company.id}
        onChange={(event) => setCompanyId(event.target.value)}
        className="min-h-11 rounded-lg border border-line bg-surface px-3 text-base text-foreground"
      >
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  )
}
