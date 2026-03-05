export type Role = 'admin' | 'sales_manager' | 'account_manager' | 'marketing' | 'member';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatarUrl: string | null;
  createdAt: number;
  updatedAt: number;
}

export type LeadStatus = 'new' | 'contacted' | 'meeting_scheduled' | 'proposal_sent' | 'won' | 'lost';

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  source: string;
  status: LeadStatus;
  value: number;
  assignedTo: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export type ClientStatus = 'active' | 'inactive' | 'onboarding';

export interface Client {
  id: string;
  companyName: string;
  industry: string;
  website: string | null;
  primaryContactId: string | null;
  accountManagerId: string;
  status: ClientStatus;
  totalRevenue: number;
  onboardingProgress: number;
  tier?: 'Gold' | 'Silver' | 'Bronze' | 'Standard';
  createdAt: number;
  updatedAt: number;
}

export interface Contact {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  jobTitle: string;
  isPrimary: boolean;
  notes?: string;
  lastContactedAt?: number | null;
  createdAt: number;
  updatedAt: number;
}

export type DealStage = 'discovery' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface Deal {
  id: string;
  name: string;
  clientId: string;
  value: number;
  stage: DealStage;
  closeDate: number | null;
  ownerId: string;
  notes?: string;
  probability?: number;
  createdAt: number;
  updatedAt: number;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly';

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval: number;
  endDate?: number | null;
  lastGeneratedAt?: number | null;
}

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface CRMTask {
  id: string;
  title: string;
  description: string;
  type?: 'call' | 'meeting' | 'email' | 'todo';
  dueDate: number;
  assignedTo: string;
  accountId?: string;
  relatedTo: {
    type: 'lead' | 'client' | 'deal' | 'task';
    id: string;
  } | null;
  status: TaskStatus;
  priority: TaskPriority;
  subtasks?: SubTask[];
  tags?: string[];
  timeSpent?: number;
  timerStartTime?: number | null;
  blockedBy?: string[];
  blocking?: string[];
  recurrence?: RecurrenceRule;
  createdAt: number;
  updatedAt: number;
}

export type ActivityType = 'email' | 'call' | 'meeting' | 'note' | 'status_change' | 'task_created' | 'task_updated' | 'comment';

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  createdBy: string;
  relatedTo: {
    type: 'lead' | 'client' | 'deal' | 'task';
    id: string;
  };
  timestamp: number;
}

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined';

export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  title: string;
  clientId: string;
  dealId: string | null;
  status: QuoteStatus;
  validUntil: number;
  subtotal: number;
  tax: number;
  total: number;
  lineItems: QuoteLineItem[];
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export type ProposalStatus = 'draft' | 'sent' | 'under_review' | 'approved' | 'rejected' | 'expired';

export interface Proposal {
  id: string;
  title: string;
  clientId: string;
  leadId: string | null;
  status: ProposalStatus;
  value: number;
  validUntil: number;
  content: string; // Markdown or rich text content
  attachments: string[]; // URLs to files
  createdAt: number;
  updatedAt: number;
}

export type AppointmentType = 'call' | 'meeting' | 'consultation' | 'follow_up';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  type: AppointmentType;
  status: AppointmentStatus;
  clientId: string | null;
  leadId: string | null;
  assignedTo: string;
  location?: string;
  videoLink?: string;
  createdAt: number;
  updatedAt: number;
}

export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
export type CampaignType = 'email' | 'social' | 'ad' | 'webinar' | 'other';

export interface CampaignMetrics {
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
}

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  startDate: number;
  endDate: number | null;
  budget: number;
  spent: number;
  metrics: CampaignMetrics;
  createdAt: number;
  updatedAt: number;
}

export interface Comment {
  id: string;
  body: string;
  authorId: string;
  createdAt: number;
  updatedAt: number;
}

export type NotificationType = 'task_assigned' | 'mention' | 'task_completed' | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  href?: string;
  isRead: boolean;
  readAt?: number;
  createdAt: number;
}

export interface WorkflowTrigger {
  type: 'task_completed' | 'client_created' | 'task_overdue' | 'task_status_changed';
  conditions?: Record<string, unknown>;
}

export interface WorkflowAction {
  type: 'create_task' | 'send_notification' | 'update_task';
  payload?: Record<string, unknown>;
}

export interface WorkflowLog {
  id: string;
  workflowId: string;
  triggeredAt: number;
  status: 'success' | 'failed';
  details?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: WorkflowTrigger;
  action: WorkflowAction;
  lastTriggeredAt?: number;
  createdAt: number;
  updatedAt: number;
}
