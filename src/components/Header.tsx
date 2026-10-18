import { useCompany } from '@/context/companyContext'
import { CompanyMark } from './CompanyMark'
import { CompanySwitcher } from './CompanySwitcher'

export const Header = () => {
  const { company } = useCompany()

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <CompanyMark company={company} />
          <div>
            <p className="text-base font-semibold leading-tight">{company.name}</p>
            <p className="text-sm text-muted">{company.tagline}</p>
          </div>
        </div>
        <CompanySwitcher />
      </div>
    </header>
  )
}
