import { CompanyLogo } from '@/components/ui/CompanyLogo'
import { CompanySwitcher } from '@/features/company/CompanySwitcher'
import { SyncStatus } from '@/features/offline/components/SyncStatus'
import { useCompany } from '@/context/companyContext'

export const Header = () => {
  const { company } = useCompany()

  return (
    <header className="border-t-4 border-accent border-b border-b-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center rounded-xl px-3 py-2" style={{ backgroundColor: company.logoBackground }}>
            <CompanyLogo logo={company.logo} className="h-7 w-auto" />
          </span>
          <p className="hidden border-l border-line pl-4 text-sm text-muted sm:block">{company.tagline}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <CompanySwitcher />
          <SyncStatus />
        </div>
      </div>
    </header>
  )
}
