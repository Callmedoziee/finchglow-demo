import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { getCompany } from '@/configs/companies'
import { applyTheme } from '@/utils/helpers/applyTheme'
import type { CompanyId } from '@/types/portal'
import { CompanyContext, type CompanyContextValue } from './companyContext'

interface Props {
  initialCompanyId: CompanyId
  children: ReactNode
}

/** Holds the selected company and re-themes the page whenever it changes. */
export const CompanyProvider = ({ initialCompanyId, children }: Props) => {
  const [companyId, setCompanyId] = useState(initialCompanyId)
  const company = getCompany(companyId)

  useEffect(() => {
    applyTheme(company)
  }, [company])

  const contextValue: CompanyContextValue = useMemo(() => ({ company, setCompanyId }), [company])
  return <CompanyContext.Provider value={contextValue}>{children}</CompanyContext.Provider>
}
