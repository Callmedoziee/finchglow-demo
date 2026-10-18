import type { Company } from '@/types/portal'

/**
 * Add a subsidiary by adding one entry here (and its logo to public/brands), then list its apps in apps.ts
 * and its content in the mock data. No component changes are needed.
 *
 * Accent colours start from each brand's real logo colour. Where that colour is too light to read
 * (below 4.5:1 against white) it is darkened, keeping the same hue, to meet WCAG AA.
 * companies.test.ts fails if any accent drops below that.
 */
export const companies: Company[] = [
  {
    id: 'academy',
    name: 'Lagos Aviation Academy',
    logo: { src: '/brands/lagos-aviation-academy.webp', width: 289, height: 96, alt: 'Lagos Aviation Academy' },
    tagline: 'Aviation school',
    accent: '#046184',
    onAccent: '#ffffff',
    accentSoft: '#ebf2f5',
  },
  {
    id: 'ota',
    name: 'Travelden',
    logo: { src: '/brands/travelden.webp', width: 289, height: 96, alt: 'Travelden' },
    tagline: 'Online travel agency',
    accent: '#be5306',
    onAccent: '#ffffff',
    accentSoft: '#faf1eb',
  },
  {
    id: 'b2b',
    name: 'Finchglow Travels',
    logo: { src: '/brands/finchglow-travels.webp', width: 398, height: 96, alt: 'Finchglow Travels' },
    tagline: 'Travel consolidator for agencies',
    accent: '#05274b',
    onAccent: '#ffffff',
    accentSoft: '#ebeef1',
  },
  {
    id: 'tmc',
    name: 'FCM Travel Nigeria',
    logo: { src: '/brands/fcm-travel-nigeria.webp', width: 284, height: 96, alt: 'FCM Travel Nigeria' },
    tagline: 'Corporate travel management',
    accent: '#018601',
    onAccent: '#ffffff',
    accentSoft: '#ebf5eb',
  },
  {
    id: 'holidays',
    name: 'Finchglow Holidays',
    logo: { src: '/brands/finchglow-holidays.webp', width: 289, height: 96, alt: 'Finchglow Holidays' },
    tagline: 'Tour operator',
    accent: '#277aaa',
    onAccent: '#ffffff',
    accentSoft: '#eef4f8',
  },
  {
    id: 'facilities',
    name: 'Finchglow Shared Services',
    logo: { src: '/brands/finchglow-holdings.webp', width: 429, height: 96, alt: 'Finchglow Holdings' },
    tagline: 'Shared facilities for the group',
    accent: '#354052',
    onAccent: '#ffffff',
    accentSoft: '#eff0f1',
  },
]

export const defaultCompanyId = companies[0].id

export const getCompany = (id: string): Company => companies.find((company) => company.id === id) ?? companies[0]

/** The parent group, shown in the footer. */
export const groupBrand = {
  name: 'Finchglow Holdings',
  logo: { src: '/brands/finchglow-holdings.webp', width: 429, height: 96, alt: 'Finchglow Holdings' },
} as const
