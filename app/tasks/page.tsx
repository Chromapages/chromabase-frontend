'use client';

import { PageHeader } from '@/components/layout/page-header';
import { useTasks, useClients } from '@/hooks';
import { TaskList } from '@/components/features/tasks/task-list';
import { MobileTasksPage } from '@/components/features/tasks/mobile-tasks-page';
import { CRMTask, TaskStatus } from '@/types';

export default function TasksPage() {
    const { useList, useUpdate, useDelete, useBulkDelete, useBulkUpdate } = useTasks();
    const { useList: useClientsList } = useClients();
    const { data: tasks, isLoading } = useList();
    const { data: clients } = useClientsList();
    const updateTask = useUpdate();
    const deleteTask = useDelete();
    const bulkDelete = useBulkDelete();
    const bulkUpdate = useBulkUpdate();

    const handleUpdateStatus = (id: string, status: TaskStatus) => {
        updateTask.mutate({ id, data: { status } });
    };

    const handleDeleteTask = (id: string) => {
        deleteTask.mutate(id);
    };

    const handleBulkDelete = (ids: string[]) => {
        bulkDelete.mutate(ids);
    };

    const handleBulkUpdate = (ids: string[], data: Partial<CRMTask>) => {
        bulkUpdate.mutate({ ids, data });
    };

    return (
        <div className="h-full flex flex-col">
            {/* Desktop View */}
            <div className="hidden lg:block p-6 max-w-[1700px] mx-auto space-y-6 flex-1">
                <PageHeader
                    title="Tasks"
                    description="Manage your to-dos, calls, meetings, and follow-ups."
                />

                <TaskList
                    tasks={tasks}
                    isLoading={isLoading}
                    onUpdateStatus={handleUpdateStatus}
                    onDeleteTask={handleDeleteTask}
                    onBulkDelete={handleBulkDelete}
                    onBulkUpdate={handleBulkUpdate}
                />
            </div>

            {/* Mobile View */}
            <div className="lg:hidden flex-1 overflow-hidden">
                <MobileTasksPage
                    tasks={tasks}
                    clients={clients}
                    onUpdateStatus={handleUpdateStatus}
                    onDeleteTask={handleDeleteTask}
                />
            </div>
        </div>
    );
}
