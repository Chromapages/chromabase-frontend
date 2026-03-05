import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { evaluateWorkflows, WorkflowEvent } from '@/lib/workflow-engine';
import { useEntity } from './useEntity';
import { Lead, Client, Deal, CRMTask, Activity, Contact, User, Quote, Proposal, Appointment, Campaign, Notification, Comment, Workflow } from '@/types';
import { mockLeads, mockClients, mockDeals, mockTasks, mockActivities, mockContacts, mockUsers, mockProposals, mockQuotes, mockAppointments, mockCampaigns, mockNotifications, mockComments, mockWorkflows } from '@/lib/mock-data';

export const useLeads = () => useEntity<Lead>('leads', mockLeads);
export const useDeals = () => useEntity<Deal>('deals', mockDeals);
export const useActivities = () => useEntity<Activity>('activities', mockActivities);
export const useContacts = () => useEntity<Contact>('contacts', mockContacts);
export const useUsers = () => useEntity<User>('team', mockUsers);
export const useQuotes = () => useEntity<Quote>('quotes', mockQuotes);
export const useProposals = () => useEntity<Proposal>('proposals', mockProposals);
export const useAppointments = () => useEntity<Appointment>('appointments', mockAppointments);
export const useCampaigns = () => useEntity<Campaign>('campaigns', mockCampaigns);
export const useNotifications = () => useEntity<Notification>('notifications', mockNotifications);
export const useComments = () => useEntity<Comment>('comments', mockComments);
export const useWorkflows = () => useEntity<Workflow>('workflows', mockWorkflows);

// Define useClients with workflow integration
export const useClients = () => {
    const base = useEntity<Client>('clients', mockClients);
    const { data: workflows } = useWorkflows().useList();
    const tasksHook = useEntity<CRMTask>('tasks', mockTasks);
    const createTask = tasksHook.useCreate();

    const useCreate = () => {
        const mutation = base.useCreate();
        return {
            ...mutation,
            mutate: (variables: any, options?: any) => {
                mutation.mutate(variables, {
                    ...options,
                    onSuccess: (data: any, vars: any, context: any) => {
                        options?.onSuccess?.(data, vars, context);
                        if (!workflows || !data) return;

                        const event: WorkflowEvent = { type: 'CLIENT_CREATED', payload: { client: data } };
                        const results = evaluateWorkflows(event, workflows);

                        results.forEach(res => {
                            if (res.triggered && res.actionTaken) {
                                toast.success(`Workflow Triggered: ${res.message}`);
                                if (res.actionTaken.type === 'create_task' && res.actionTaken.payload) {
                                    createTask.mutate({
                                        title: res.actionTaken.payload.title || 'Onboarding Task',
                                        type: res.actionTaken.payload.type || 'todo',
                                        priority: res.actionTaken.payload.priority || 'high',
                                        status: 'todo',
                                        accountId: data.id,
                                        dueDate: Date.now() + 86400000 * 7,
                                        createdAt: Date.now(),
                                        updatedAt: Date.now(),
                                    } as Partial<CRMTask>);
                                }
                            }
                        });
                    }
                });
            }
        };
    };

    return { ...base, useCreate };
};

// Define useTasks with workflow integration
export const useTasks = () => {
    const base = useEntity<CRMTask>('tasks', mockTasks);
    const { data: workflows } = useWorkflows().useList();
    const { data: clients } = useEntity<Client>('clients', mockClients).useList();
    const createTask = base.useCreate();

    const useUpdate = () => {
        const mutation = base.useUpdate();
        return {
            ...mutation,
            mutate: (variables: any, options?: any) => {
                mutation.mutate(variables, {
                    ...options,
                    onSuccess: (data: any, vars: any, context: any) => {
                        options?.onSuccess?.(data, vars, context);
                        if (!workflows || !clients || !data) return;

                        const taskClient = clients.find(c => c.id === data.accountId || c.id === data.relatedTo?.id);

                        let eventType: 'TASK_STATUS_CHANGED' | 'TASK_COMPLETED' | 'TASK_OVERDUE' | null = null;
                        if (data.status === 'completed' && vars.data?.status === 'completed') {
                            eventType = 'TASK_COMPLETED';
                        } else if (vars.data?.status) {
                            eventType = 'TASK_STATUS_CHANGED';
                        }

                        if (eventType) {
                            const event: WorkflowEvent = { type: eventType, payload: { task: data, client: taskClient } };
                            const results = evaluateWorkflows(event, workflows);

                            results.forEach(res => {
                                if (res.triggered && res.actionTaken) {
                                    toast.success(res.message);
                                    if (res.actionTaken.type === 'create_task' && res.actionTaken.payload) {
                                        createTask.mutate({
                                            title: res.actionTaken.payload.title || 'Auto Follow-up',
                                            type: res.actionTaken.payload.type || 'todo',
                                            priority: res.actionTaken.payload.priority || 'medium',
                                            status: 'todo',
                                            accountId: taskClient?.id,
                                            dueDate: Date.now() + 86400000 * 2,
                                            createdAt: Date.now(),
                                            updatedAt: Date.now(),
                                        } as Partial<CRMTask>);
                                    } else if (res.actionTaken.type === 'send_notification' && res.actionTaken.payload) {
                                        // A real app would post a notification here
                                        console.log('Sending notification:', res.actionTaken.payload.message);
                                    } else if (res.actionTaken.type === 'update_task' && res.actionTaken.payload) {
                                        mutation.mutate({ id: data.id, data: res.actionTaken.payload as Partial<CRMTask> });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        };
    };

    return { ...base, useUpdate };
};
