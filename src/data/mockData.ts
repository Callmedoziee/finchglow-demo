import type { Alert, NewsItem } from '@/types/portal'

export interface Employee {
  id: string
  firstName: string
  /** The company the employee works for. They can still preview the others. */
  companyId: string
}

export const currentEmployee: Employee = { id: 'e-1042', firstName: 'Amara', companyId: 'ota' }

export const alerts: Alert[] = [
  {
    id: 'a-1',
    severity: 'critical',
    title: 'Payment gateway failure',
    body: 'Card payments are failing across all booking tools. Do not retry payments. Take bookings on hold and use the manual payment link until this is resolved.',
    publishedAt: '2026-10-17T08:05:00Z',
    companies: '*',
  },
  {
    id: 'a-2',
    severity: 'warning',
    title: 'Booking platform running slowly',
    body: 'Searches are taking up to 20 seconds. Engineers are investigating.',
    publishedAt: '2026-10-17T07:40:00Z',
    companies: ['ota', 'holidays'],
  },
  {
    id: 'a-3',
    severity: 'warning',
    title: 'Agent login scheduled maintenance',
    body: 'The agent console will be unavailable from 22:00 to 23:00 tonight.',
    publishedAt: '2026-10-16T16:00:00Z',
    companies: ['b2b'],
  },
  {
    id: 'a-4',
    severity: 'information',
    title: 'New expense policy from 1 November',
    body: 'Receipts are now required for every claim above 20 pounds.',
    publishedAt: '2026-10-15T09:00:00Z',
    companies: '*',
  },
  {
    id: 'a-5',
    severity: 'information',
    title: 'Lift 2 out of service',
    body: 'Lift 2 in the main building is closed for inspection until Friday.',
    publishedAt: '2026-10-16T11:30:00Z',
    companies: ['facilities', 'academy'],
  },
]

export const news: NewsItem[] = [
  { id: 'n-1', title: 'Staff recognition week starts Monday', summary: 'Nominate a colleague who went the extra mile for a customer. Nominations close on Friday.', publishedAt: '2026-10-14T10:00:00Z', companies: '*' },
  { id: 'n-2', title: 'Summer holiday packages open for booking', summary: 'The Holidays team has published next summer\'s packages. Sales training starts next week.', publishedAt: '2026-10-13T12:00:00Z', companies: ['holidays', 'ota'] },
  { id: 'n-3', title: 'Academy autumn cohort begins', summary: 'Forty new trainees start the foundations programme on Monday.', publishedAt: '2026-10-12T09:00:00Z', companies: ['academy'] },
  { id: 'n-4', title: 'Corporate client onboarding checklist updated', summary: 'The TMC onboarding steps now include a policy review call in week one.', publishedAt: '2026-10-11T15:30:00Z', companies: ['tmc'] },
  { id: 'n-5', title: 'Agent commission statements now monthly', summary: 'Agents will receive statements on the first working day of each month.', publishedAt: '2026-10-10T08:00:00Z', companies: ['b2b'] },
  { id: 'n-6', title: 'Car park changes at head office', summary: 'Bays 20 to 40 move to the shared facilities visitor allocation from Monday.', publishedAt: '2026-10-09T14:00:00Z', companies: ['facilities'] },
]
