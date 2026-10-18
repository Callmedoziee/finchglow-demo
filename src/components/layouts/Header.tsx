import { CompanyLogo } from '@/components/ui/CompanyLogo'
import { CompanySwitcher } from '@/features/company/CompanySwitcher'
import { useCompany } from '@/features/company/companyContext'

export const Header = () => {
  const { company } = useCompany()

  return (
    <header className="border-t-4 border-accent border-b border-b-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-4">
          <CompanyLogo logo={company.logo} className="h-10 w-auto" />
          <p className="hidden border-l border-line pl-4 text-sm text-muted sm:block">{company.tagline}</p>
        </div>
        <CompanySwitcher />
      </div>
    </header>
  )
}
