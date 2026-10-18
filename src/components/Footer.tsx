import { CompanyLogo } from '@/components/CompanyLogo'
import { groupBrand } from '@/config/companies'

export const Footer = () => (
  <footer className="mt-12 border-t border-line bg-surface">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
      <CompanyLogo logo={groupBrand.logo} className="h-8 w-auto" />
      <p className="text-sm text-muted">Group staff portal prototype. All content shown is invented sample data.</p>
    </div>
  </footer>
)
