import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { getCompany } from '../config/companies'
import { applyTheme } from '../theme/applyTheme'
import type { CompanyId } from '../types/portal'
import { CompanyContext } from './companyContext'

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

  const value = useMemo(() => ({ company, setCompanyId }), [company])
  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
}
