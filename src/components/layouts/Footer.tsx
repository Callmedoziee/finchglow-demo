import { CompanyLogo } from '@/components/ui/CompanyLogo'
import { groupBrand } from '@/configs/companies'

export const Footer = () => (
  <footer className="mt-12 border-t border-border bg-surface">
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <CompanyLogo logo={groupBrand.logo} className="h-8 w-auto" />
        <p className="text-sm font-semibold">Group Staff Portal</p>
      </div>
      <p className="max-w-xl text-sm text-muted">
        A prototype. Every person, alert and news item is invented sample data. Icons by Lucide (ISC licence).
      </p>
    </div>
  </footer>
)
