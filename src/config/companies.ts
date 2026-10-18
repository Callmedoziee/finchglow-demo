import type { Company } from '@/types/portal'

/**
 * Add a subsidiary by adding one entry here, then list its apps in apps.ts
 * and its content in the mock data. No component changes are needed.
 */
export const companies: Company[] = [
  { id: 'academy', name: 'Finchglow Academy', mark: 'FA', tagline: 'Training for travel professionals', accent: '#1d4ed8', onAccent: '#ffffff', accentSoft: '#eff4ff' },
  { id: 'ota', name: 'Finchglow Travel', mark: 'FT', tagline: 'Online travel agency', accent: '#c2410c', onAccent: '#ffffff', accentSoft: '#fff3ec' },
  { id: 'b2b', name: 'Finchglow Agents', mark: 'FG', tagline: 'B2B platform for travel agents', accent: '#0f766e', onAccent: '#ffffff', accentSoft: '#ebf8f6' },
  { id: 'tmc', name: 'Finchglow Corporate', mark: 'FC', tagline: 'Travel management for business', accent: '#6d28d9', onAccent: '#ffffff', accentSoft: '#f4effe' },
  { id: 'holidays', name: 'Finchglow Holidays', mark: 'FH', tagline: 'Packaged holidays', accent: '#be185d', onAccent: '#ffffff', accentSoft: '#fdeff5' },
  { id: 'facilities', name: 'Finchglow Facilities', mark: 'FF', tagline: 'Shared facilities for the group', accent: '#374151', onAccent: '#ffffff', accentSoft: '#f1f2f4' },
]

export const defaultCompanyId = companies[0].id

export const getCompany = (id: string): Company => companies.find((company) => company.id === id) ?? companies[0]
