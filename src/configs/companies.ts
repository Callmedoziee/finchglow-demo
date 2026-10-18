import type { Company } from '@/types/portal'

/**
 * Add a subsidiary by adding one entry here (and its logo to public/brands), then list its apps in apps.ts
 * and its content in the mock data. No component changes are needed.
 *
 * Colours come from the design. Every accent must reach 4.5:1 on white and on its own soft tint, and the
 * white logo must reach 3:1 on its pill. companies.test.ts fails if any of these drop below that.
 */
export const companies: Company[] = [
  {
    id: 'academy',
    name: 'Lagos Aviation Academy',
    logo: { src: '/brands/lagos-aviation-academy-white.svg', width: 152, height: 66, alt: 'Lagos Aviation Academy' },
    logoBackground: '#204d74',
    tagline: 'Aviation school',
    accent: '#204d74',
    onAccent: '#ffffff',
    accentSoft: '#e9eff5',
  },
  {
    id: 'ota',
    name: 'Travelden',
    logo: { src: '/brands/travelden-white.png', width: 216, height: 66, alt: 'Travelden' },
    logoBackground: '#d9650f',
    tagline: 'Online travel agency',
    accent: '#b54a00',
    onAccent: '#ffffff',
    accentSoft: '#fef1e6',
  },
  {
    id: 'b2b',
    name: 'Finchglow Travels',
    logo: { src: '/brands/finchglow-travels-white.svg', width: 276, height: 66, alt: 'Finchglow Travels' },
    logoBackground: '#002d4f',
    tagline: 'Travel consolidator for agencies',
    accent: '#0b3b63',
    onAccent: '#ffffff',
    accentSoft: '#e7eef5',
  },
  {
    id: 'tmc',
    name: 'FCM Travel Nigeria',
    logo: { src: '/brands/fcm-travel-nigeria-white.svg', width: 197, height: 66, alt: 'FCM Travel Nigeria' },
    logoBackground: '#1d2029',
    tagline: 'Corporate travel management',
    accent: '#127a12',
    onAccent: '#ffffff',
    accentSoft: '#eaf7ea',
  },
  {
    id: 'holidays',
    name: 'Finchglow Holidays',
    logo: { src: '/brands/finchglow-holidays-white.svg', width: 228, height: 66, alt: 'Finchglow Holidays' },
    logoBackground: '#900090',
    tagline: 'Tour operator',
    accent: '#900090',
    onAccent: '#ffffff',
    accentSoft: '#f8eaf8',
  },
  {
    id: 'facilities',
    name: 'Finchglow Shared Services',
    logo: { src: '/brands/finchglow-holdings.webp', width: 429, height: 96, alt: 'Finchglow Holdings' },
    logoBackground: '#ffffff',
    tagline: 'Shared facilities for the group',
    accent: '#0b5e9c',
    onAccent: '#ffffff',
    accentSoft: '#e8f3fb',
  },
]

export const defaultCompanyId = companies[0].id

export const getCompany = (id: string): Company => companies.find((company) => company.id === id) ?? companies[0]

/** The parent group, shown in the footer. */
export const groupBrand = {
  name: 'Finchglow Holdings',
  logo: { src: '/brands/finchglow-holdings.webp', width: 429, height: 96, alt: 'Finchglow Holdings' },
} as const
