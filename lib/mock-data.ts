import type {
  Lead, Client, Deal, CRMTask, Activity, Contact, User, Quote, Proposal, Appointment, Campaign, Notification, Comment
} from '@/types';

export const mockUsers: User[] = [
  { id: 'user-1', email: 'eric@chromapages.com', firstName: 'Eric', lastName: 'Lew', role: 'admin', avatarUrl: 'https://i.pravatar.cc/150?u=eric', createdAt: Date.now() - 86400000 * 30, updatedAt: Date.now() },
  { id: 'user-2', email: 'sarah@chromapages.com', firstName: 'Sarah', lastName: 'Jenkins', role: 'account_manager', avatarUrl: 'https://i.pravatar.cc/150?u=sarah', createdAt: Date.now() - 86400000 * 20, updatedAt: Date.now() }
];

export const mockClients: Client[] = [
  { id: 'client-1', companyName: 'Global Tech', industry: 'Technology', website: 'https://globaltech.com', primaryContactId: 'contact-1', accountManagerId: 'user-1', status: 'active', totalRevenue: 150000, onboardingProgress: 100, tier: 'Gold', createdAt: Date.now() - 86400000 * 60, updatedAt: Date.now() },
  { id: 'client-2', companyName: 'Nexus Industries', industry: 'Manufacturing', website: 'https://nexusind.com', primaryContactId: 'contact-2', accountManagerId: 'user-2', status: 'active', totalRevenue: 85000, onboardingProgress: 100, tier: 'Silver', createdAt: Date.now() - 86400000 * 45, updatedAt: Date.now() },
  { id: 'client-3', companyName: 'Stellar Logistics', industry: 'Logistics', website: 'https://stellarlog.com', primaryContactId: 'contact-3', accountManagerId: 'user-1', status: 'onboarding', totalRevenue: 12000, onboardingProgress: 40, tier: 'Bronze', createdAt: Date.now() - 86400000 * 5, updatedAt: Date.now() }
];

export const mockContacts: Contact[] = [
  { id: 'contact-1', clientId: 'client-1', firstName: 'Mike', lastName: 'Wilson', email: 'mike@globaltech.com', phone: '+1111111111', jobTitle: 'CTO', isPrimary: true, createdAt: Date.now() - 86400000 * 60, updatedAt: Date.now() },
  { id: 'contact-2', clientId: 'client-2', firstName: 'Amanda', lastName: 'Chen', email: 'amanda@nexusind.com', phone: '+2222222222', jobTitle: 'Operations Director', isPrimary: true, createdAt: Date.now() - 86400000 * 45, updatedAt: Date.now() },
  { id: 'contact-3', clientId: 'client-3', firstName: 'Robert', lastName: 'Fox', email: 'robert@stellarlog.com', phone: '+3333333333', jobTitle: 'CEO', isPrimary: true, createdAt: Date.now() - 86400000 * 5, updatedAt: Date.now() }
];

export const mockLeads: Lead[] = [
  { id: 'lead-1', companyName: 'Acme Corp', contactName: 'John Smith', contactEmail: 'john@acme.com', contactPhone: '+1234567890', source: 'Website', status: 'new', value: 50000, assignedTo: 'user-1', notes: 'Interested in enterprise plan', createdAt: Date.now() - 86400000 * 5, updatedAt: Date.now() },
  { id: 'lead-2', companyName: 'TechStart Inc', contactName: 'Sarah Johnson', contactEmail: 'sarah@techstart.io', contactPhone: '+1987654321', source: 'Referral', status: 'contacted', value: 75000, assignedTo: 'user-2', notes: 'Follow up next week', createdAt: Date.now() - 86400000 * 10, updatedAt: Date.now() },
  { id: 'lead-3', companyName: 'Pinnacle Systems', contactName: 'James Dean', contactEmail: 'james@pinnacle.com', contactPhone: '+1555555555', source: 'Cold Call', status: 'meeting_scheduled', value: 30000, assignedTo: 'user-1', notes: 'Needs demo of new features', createdAt: Date.now() - 86400000 * 2, updatedAt: Date.now() }
];

export const mockDeals: Deal[] = [
  { id: 'deal-1', name: 'Enterprise License', clientId: 'client-1', value: 120000, stage: 'proposal', closeDate: Date.now() + 86400000 * 30, ownerId: 'user-1', probability: 60, createdAt: Date.now() - 86400000 * 15, updatedAt: Date.now() },
  { id: 'deal-2', name: 'Q3 Renewal', clientId: 'client-2', value: 85000, stage: 'negotiation', closeDate: Date.now() + 86400000 * 10, ownerId: 'user-2', probability: 80, createdAt: Date.now() - 86400000 * 20, updatedAt: Date.now() },
  { id: 'deal-3', name: 'Initial Implementation', clientId: 'client-3', value: 12000, stage: 'closed_won', closeDate: Date.now() - 86400000 * 2, ownerId: 'user-1', probability: 100, createdAt: Date.now() - 86400000 * 5, updatedAt: Date.now() }
];

export const mockTasks: CRMTask[] = [
  { id: 'task-1', title: 'Follow up with Acme Corp', description: 'Schedule demo call', type: 'call', dueDate: Date.now() + 86400000 * 2, assignedTo: 'user-1', accountId: 'client-1', relatedTo: { type: 'lead', id: 'lead-1' }, status: 'todo', priority: 'high', createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { id: 'task-2', title: 'Prepare proposal for Global Tech', description: 'Q2 renewal proposal', type: 'todo', dueDate: Date.now() + 86400000 * 5, assignedTo: 'user-1', accountId: 'client-1', relatedTo: { type: 'deal', id: 'deal-1' }, status: 'in_progress', priority: 'medium', createdAt: Date.now() - 86400000 * 2, updatedAt: Date.now() },
  { id: 'task-3', title: 'Onboarding Check-in', description: 'Call Stellar Logistics to verify system setup', type: 'call', dueDate: Date.now() - 86400000 * 1, assignedTo: 'user-1', accountId: 'client-3', relatedTo: { type: 'client', id: 'client-3' }, status: 'todo', priority: 'high', createdAt: Date.now() - 86400000 * 3, updatedAt: Date.now() },
  { id: 'task-4', title: 'Contract Negotiation', description: 'Finalize terms with Nexus', type: 'meeting', dueDate: Date.now() + 86400000 * 1, assignedTo: 'user-2', accountId: 'client-2', relatedTo: { type: 'deal', id: 'deal-2' }, status: 'todo', priority: 'urgent', createdAt: Date.now() - 86400000 * 1, updatedAt: Date.now() }
];

export const mockActivities: Activity[] = [
  { id: 'activity-1', type: 'email', description: 'Sent introductory email to Acme Corp', createdBy: 'user-1', relatedTo: { type: 'lead', id: 'lead-1' }, timestamp: Date.now() - 86400000 },
  { id: 'activity-2', type: 'call', description: 'Discovery call with TechStart Inc', createdBy: 'user-1', relatedTo: { type: 'lead', id: 'lead-2' }, timestamp: Date.now() - 86400000 * 2 },
  { id: 'activity-3', type: 'meeting', description: 'Product Demo with Global Tech CTO', createdBy: 'user-1', relatedTo: { type: 'client', id: 'client-1' }, timestamp: Date.now() - 86400000 * 5 }
];

export const mockAppointments: Appointment[] = [
  { id: 'appt-1', title: 'Acme Corp Demo', description: 'Platform walkthrough', startTime: Date.now() + 86400000 * 2 + 3600000, endTime: Date.now() + 86400000 * 2 + 7200000, type: 'meeting', status: 'scheduled', clientId: null, leadId: 'lead-1', assignedTo: 'user-1', videoLink: 'https://meet.google.com/abc-defg-hij', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'appt-2', title: 'Nexus Negotiation', description: 'Finalize SLA terms', startTime: Date.now() + 86400000 * 1 + 3600000, endTime: Date.now() + 86400000 * 1 + 7200000, type: 'consultation', status: 'scheduled', clientId: 'client-2', leadId: null, assignedTo: 'user-2', videoLink: 'https://meet.google.com/xyz-uvw-rst', createdAt: Date.now(), updatedAt: Date.now() }
];

export const mockQuotes: Quote[] = [];
export const mockProposals: Proposal[] = [];
export const mockCampaigns: Campaign[] = [];
export const mockNotifications: Notification[] = [];
export const mockComments: Comment[] = [];
