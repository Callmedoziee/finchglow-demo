import { createContext, useContext } from 'react'
import type { Company, CompanyId } from '@/types/portal'

export interface CompanyContextValue {
  company: Company
  setCompanyId: (id: CompanyId) => void
}

export const CompanyContext = createContext<CompanyContextValue | null>(null)

/** The company the portal is currently showing. Must be used under CompanyProvider. */
export const useCompany = (): CompanyContextValue => {
  const value = useContext(CompanyContext)
  if (!value) throw new Error('useCompany must be used inside a CompanyProvider')
  return value
}
