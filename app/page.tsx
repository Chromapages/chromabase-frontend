'use client';

import { PageHeader } from '@/components/layout/page-header';
import { useLeads, useClients, useDeals, useTasks, useActivities, useAppointments } from '@/hooks';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ROUTES } from '@/constants';
import { DashboardView } from '@/components/features/dashboard/dashboard-view';

export default function DashboardPage() {
    const { useList: useLeadsList } = useLeads();
    const { useList: useClientsList } = useClients();
    const { useList: useDealsList } = useDeals();
    const { useList: useTasksList } = useTasks();
    const { useList: useActivitiesList } = useActivities();
    const { useList: useAppointmentsList } = useAppointments();

    const { data: leads, isLoading: leadsLoading, error: leadsError } = useLeadsList();
    const { data: clients, isLoading: clientsLoading, error: clientsError } = useClientsList();
    const { data: deals, isLoading: dealsLoading, error: dealsError } = useDealsList();
    const { data: tasks, isLoading: tasksLoading, error: tasksError } = useTasksList();
    const { data: activities, isLoading: activitiesLoading, error: activitiesError } = useActivitiesList();
    const { data: appointments, isLoading: appointmentsLoading, error: appointmentsError } = useAppointmentsList();

    const isLoading = leadsLoading || clientsLoading || dealsLoading || tasksLoading || activitiesLoading || appointmentsLoading;
    const error = leadsError || clientsError || dealsError || tasksError || activitiesError || appointmentsError;

    return (
        <div className="p-6 max-w-full mx-auto space-y-6">
            <PageHeader
                title="Dashboard"
                description="Welcome back. Here's what's happening with your pipeline today."
            >
                <Button asChild>
                    <Link href={ROUTES.LEADS}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Lead
                    </Link>
                </Button>
            </PageHeader>

            <DashboardView
                leads={leads}
                clients={clients}
                deals={deals}
                tasks={tasks}
                activities={activities}
                appointments={appointments}
                isLoading={isLoading}
                error={error as Error}
            />
        </div>
    );
}
