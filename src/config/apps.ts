import type { PortalApp } from '@/types/portal'

/**
 * The app catalogue. `companies` decides who sees each tile:
 * a list of company ids, or '*' for the whole group.
 */
export const apps: PortalApp[] = [
  { id: 'booking-engine', name: 'Booking Engine', description: 'Search, price and book flights and hotels.', category: 'booking', url: '#booking-engine', companies: ['ota', 'holidays'] },
  { id: 'agent-console', name: 'Agent Console', description: 'Manage agent accounts, markups and commissions.', category: 'booking', url: '#agent-console', companies: ['b2b'] },
  { id: 'corporate-booking', name: 'Corporate Booking Tool', description: 'Book trips within company travel policy.', category: 'booking', url: '#corporate-booking', companies: ['tmc'] },
  { id: 'crm', name: 'CRM', description: 'Customer records, enquiries and follow-ups.', category: 'sales', url: '#crm', companies: ['ota', 'b2b', 'tmc', 'holidays'] },
  { id: 'supplier-portal', name: 'Supplier Portal', description: 'Airline, hotel and tour supplier contracts and rates.', category: 'operations', url: '#supplier-portal', companies: ['ota', 'b2b', 'holidays'] },
  { id: 'course-manager', name: 'Course Manager', description: 'Plan cohorts, timetables and trainer assignments.', category: 'learning', url: '#course-manager', companies: ['academy'] },
  { id: 'asset-tracker', name: 'Asset Tracker', description: 'Track equipment, keys and maintenance jobs.', category: 'operations', url: '#asset-tracker', companies: ['facilities'] },
  { id: 'learning-hub', name: 'Learning Hub', description: 'Mandatory and optional training for every employee.', category: 'learning', url: '#learning-hub', companies: '*' },
  { id: 'facilities-requests', name: 'Facilities Requests', description: 'Report a fault or request a room, desk or repair.', category: 'operations', url: '#facilities-requests', companies: '*' },
  { id: 'hr-self-service', name: 'HR Self-Service', description: 'Payslips, leave and personal details.', category: 'people', url: '#hr-self-service', companies: '*' },
  { id: 'finance-approvals', name: 'Finance Approvals', description: 'Approve expenses and purchase requests.', category: 'finance', url: '#finance-approvals', companies: '*' },
]
