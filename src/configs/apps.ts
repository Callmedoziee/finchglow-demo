import type { PortalApp } from '@/types/portal'

/**
 * The app catalogue. `companies` decides who sees each tile:
 * a list of company ids, or '*' for the whole group.
 * `waiting` is sample work waiting for the signed-in person (it feeds the summary sentence and the tile badge).
 */
export const apps: PortalApp[] = [
  { id: 'booking-engine', name: 'Booking Engine', description: 'Search, price and book flights and hotels.', icon: 'plane', url: '#booking-engine', companies: ['ota', 'holidays'] },
  { id: 'agent-console', name: 'Agent Console', description: 'Manage agent accounts, markups and commissions.', icon: 'users', url: '#agent-console', companies: ['b2b'] },
  { id: 'corporate-booking', name: 'Corporate Booking Tool', description: 'Book trips within company travel policy.', icon: 'briefcase', url: '#corporate-booking', companies: ['tmc'], waiting: { count: 3, singular: 'trip approval', plural: 'trip approvals' } },
  { id: 'crm', name: 'CRM', description: 'Customer records, enquiries and follow-ups.', icon: 'contact', url: '#crm', companies: ['ota', 'b2b', 'tmc', 'holidays'] },
  { id: 'supplier-portal', name: 'Supplier Portal', description: 'Airline, hotel and tour supplier contracts and rates.', icon: 'handshake', url: '#supplier-portal', companies: ['ota', 'b2b', 'holidays'] },
  { id: 'course-manager', name: 'Course Manager', description: 'Plan cohorts, timetables and trainer assignments.', icon: 'calendar', url: '#course-manager', companies: ['academy'], waiting: { count: 12, singular: 'attendance sheet', plural: 'attendance sheets' } },
  { id: 'asset-tracker', name: 'Asset Tracker', description: 'Track equipment, keys and maintenance jobs.', icon: 'package', url: '#asset-tracker', companies: ['facilities'], waiting: { count: 2, singular: 'stock request', plural: 'stock requests' } },
  { id: 'learning-hub', name: 'Learning Hub', description: 'Mandatory and optional training for every employee.', icon: 'graduation-cap', url: '#learning-hub', companies: '*' },
  { id: 'facilities-requests', name: 'Facilities Requests', description: 'Report a fault or request a room, desk or repair.', icon: 'wrench', url: '#facilities-requests', companies: '*' },
  { id: 'hr-self-service', name: 'HR Self-Service', description: 'Payslips, leave and personal details.', icon: 'id-card', url: '#hr-self-service', companies: '*' },
  { id: 'finance-approvals', name: 'Finance Approvals', description: 'Approve expenses and purchase requests.', icon: 'receipt', url: '#finance-approvals', companies: '*', waiting: { count: 3, singular: 'expense approval', plural: 'expense approvals' } },
]
