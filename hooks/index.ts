import { useEntity } from './useEntity';
import { Lead, Client, Deal, CRMTask, Activity, Contact, User, Quote, Proposal, Appointment, Campaign, Notification, Comment } from '@/types';
import { mockLeads, mockClients, mockDeals, mockTasks, mockActivities, mockContacts, mockUsers, mockProposals, mockQuotes, mockAppointments, mockCampaigns, mockNotifications, mockComments } from '@/lib/mock-data';

export const useLeads = () => useEntity<Lead>('leads', mockLeads);
export const useClients = () => useEntity<Client>('clients', mockClients);
export const useDeals = () => useEntity<Deal>('deals', mockDeals);
export const useTasks = () => useEntity<CRMTask>('tasks', mockTasks);
export const useActivities = () => useEntity<Activity>('activities', mockActivities);
export const useContacts = () => useEntity<Contact>('contacts', mockContacts);
export const useUsers = () => useEntity<User>('team', mockUsers);
export const useQuotes = () => useEntity<Quote>('quotes', mockQuotes);
export const useProposals = () => useEntity<Proposal>('proposals', mockProposals);
export const useAppointments = () => useEntity<Appointment>('appointments', mockAppointments);
export const useCampaigns = () => useEntity<Campaign>('campaigns', mockCampaigns);
export const useNotifications = () => useEntity<Notification>('notifications', mockNotifications);
export const useComments = () => useEntity<Comment>('comments', mockComments);
