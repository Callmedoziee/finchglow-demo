import { useId } from 'react'
import { companies } from '@/configs/companies'
import { useCompany } from './companyContext'

/** A native <select>: keyboard, screen reader and mobile pickers all work without extra code. */
export const CompanySwitcher = () => {
  const { company, setCompanyId } = useCompany()
  const selectId = useId()

  return (
    <div className="flex w-full flex-col gap-1 sm:w-auto sm:flex-row sm:items-center sm:gap-2">
      <label htmlFor={selectId} className="text-sm font-medium text-muted">
        Company
      </label>
      <select
        id={selectId}
        value={company.id}
        onChange={(event) => setCompanyId(event.target.value)}
        className="min-h-11 w-full min-w-0 rounded-lg border border-line bg-surface px-3 text-base text-foreground sm:w-auto"
      >
        {companies.map((companyOption) => (
          <option key={companyOption.id} value={companyOption.id}>
            {companyOption.name}
          </option>
        ))}
      </select>
    </div>
  )
}
