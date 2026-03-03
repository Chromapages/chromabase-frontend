'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { useTasks, useAppointments } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CalendarView } from '@/components/features/calendar/calendar-view';
import { EventDialog } from '@/components/features/calendar/event-dialog';

export default function CalendarPage() {
    const { useList: useTasksList } = useTasks();
    const { useList: useAppointmentsList } = useAppointments();

    const { data: tasks, isLoading: tasksLoading } = useTasksList();
    const { data: appointments, isLoading: appointmentsLoading } = useAppointmentsList();

    const isLoading = tasksLoading || appointmentsLoading;
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="p-6 max-w-[1600px] mx-auto flex flex-col h-[calc(100vh-4rem)] space-y-4">
            <PageHeader
                title="Calendar"
                description="Manage your appointments, tasks, and team schedule in one place."
            >
                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Event
                </Button>
            </PageHeader>

            <CalendarView
                tasks={tasks}
                appointments={appointments}
                isLoading={isLoading}
            />

            <EventDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </div>
    );
}
