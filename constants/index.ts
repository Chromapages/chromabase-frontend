// Routes configuration
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/',
  ACCOUNTS: '/accounts',
  ACCOUNT_DETAIL: (id: string) => `/accounts/${id}`,
  LEADS: '/leads',
  DEALS: '/deals',
  TASKS: '/tasks',
  CALENDAR: '/calendar',
  SETTINGS: '/settings',
  QUOTES: '/quotes',
  QUOTE_DETAIL: (id: string) => `/quotes/${id}`,
  API_DOCS: '/api-docs',
  PROPOSALS: '/proposals',
  TEAM: '/team',
  REPORTS: '/reports',
  CONTACTS: '/contacts',
  CAMPAIGNS: '/campaigns',
  WORKFLOWS: '/workflows',
  GUIDE: '/guide',
} as const;

// Deal stage options
export const DEAL_STAGE_OPTIONS = [
  { value: 'lead', label: 'Lead' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed_won', label: 'Closed Won' },
  { value: 'closed_lost', label: 'Closed Lost' },
] as const;

// Lead status options
export const LEAD_STATUS_OPTIONS = [
  { value: 'new', label: 'New Lead' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'meeting_scheduled', label: 'Meeting Scheduled' },
  { value: 'proposal_sent', label: 'Proposal Sent' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
] as const;

// Quote status options
export const QUOTE_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'viewed', label: 'Viewed' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
] as const;

// Task status options
export const TASK_STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'completed', label: 'Completed' },
] as const;

// Task priority options
export const TASK_PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
] as const;
