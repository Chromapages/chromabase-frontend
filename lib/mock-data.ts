import type {
  Lead,
  Client,
  Deal,
  CRMTask,
  Activity,
  Contact,
  User,
  Quote,
  Proposal,
  Appointment,
  Campaign,
  Notification,
  Comment,
} from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'eric@chromapages.com',
    firstName: 'Eric',
    lastName: 'Lew',
    role: 'admin',
    avatarUrl: null,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now(),
  },
];

export const mockLeads: Lead[] = [
  {
    id: 'lead-1',
    companyName: 'Acme Corp',
    contactName: 'John Smith',
    contactEmail: 'john@acme.com',
    contactPhone: '+1234567890',
    source: 'Website',
    status: 'new',
    value: 50000,
    assignedTo: 'user-1',
    notes: 'Interested in enterprise plan',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now(),
  },
  {
    id: 'lead-2',
    companyName: 'TechStart Inc',
    contactName: 'Sarah Johnson',
    contactEmail: 'sarah@techstart.io',
    contactPhone: '+1987654321',
    source: 'Referral',
    status: 'contacted',
    value: 75000,
    assignedTo: 'user-1',
    notes: 'Follow up next week',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now(),
  },
];

export const mockClients: Client[] = [
  {
    id: 'client-1',
    companyName: 'Global Tech',
    industry: 'Technology',
    website: 'https://globaltech.com',
    primaryContactId: 'contact-1',
    accountManagerId: 'user-1',
    status: 'active',
    totalRevenue: 150000,
    onboardingProgress: 100,
    createdAt: Date.now() - 86400000 * 60,
    updatedAt: Date.now(),
  },
];

export const mockContacts: Contact[] = [
  {
    id: 'contact-1',
    clientId: 'client-1',
    firstName: 'Mike',
    lastName: 'Wilson',
    email: 'mike@globaltech.com',
    phone: '+1111111111',
    jobTitle: 'CTO',
    isPrimary: true,
    createdAt: Date.now() - 86400000 * 60,
    updatedAt: Date.now(),
  },
];

export const mockDeals: Deal[] = [
  {
    id: 'deal-1',
    name: 'Enterprise License',
    clientId: 'client-1',
    value: 120000,
    stage: 'proposal',
    closeDate: Date.now() + 86400000 * 30,
    ownerId: 'user-1',
    probability: 60,
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now(),
  },
];

export const mockTasks: CRMTask[] = [
  {
    id: 'task-1',
    title: 'Follow up with Acme Corp',
    description: 'Schedule demo call',
    type: 'call',
    dueDate: Date.now() + 86400000 * 2,
    assignedTo: 'user-1',
    relatedTo: { type: 'lead', id: 'lead-1' },
    status: 'todo',
    priority: 'high',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now(),
  },
  {
    id: 'task-2',
    title: 'Prepare proposal for Global Tech',
    description: 'Q2 renewal proposal',
    type: 'todo',
    dueDate: Date.now() + 86400000 * 5,
    assignedTo: 'user-1',
    relatedTo: { type: 'deal', id: 'deal-1' },
    status: 'in_progress',
    priority: 'medium',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now(),
  },
];

export const mockActivities: Activity[] = [
  {
    id: 'activity-1',
    type: 'email',
    description: 'Sent introductory email to Acme Corp',
    createdBy: 'user-1',
    relatedTo: { type: 'lead', id: 'lead-1' },
    timestamp: Date.now() - 86400000,
  },
  {
    id: 'activity-2',
    type: 'call',
    description: 'Discovery call with TechStart Inc',
    createdBy: 'user-1',
    relatedTo: { type: 'lead', id: 'lead-2' },
    timestamp: Date.now() - 86400000 * 2,
  },
];

export const mockQuotes: Quote[] = [];

export const mockProposals: Proposal[] = [];

export const mockAppointments: Appointment[] = [];

export const mockCampaigns: Campaign[] = [];

export const mockNotifications: Notification[] = [];

export const mockComments: Comment[] = [];
