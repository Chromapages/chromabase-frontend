'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTasks } from '@/hooks';
import { TaskDetail } from '@/components/features/tasks/task-detail';
import { Skeleton } from '@/components/ui/skeleton';

export default function TaskDetailPage() {
    const { id } = useParams() as { id: string };
    const tasksEntity = useTasks();
    const { data: task, isLoading } = tasksEntity.useGet(id);
    const updateTask = tasksEntity.useUpdate();

    if (isLoading) {
        return (
            <div className="p-8 space-y-6">
                <Skeleton className="h-12 w-64" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-[400px] w-full" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-[400px] w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="p-8 text-center bg-muted/30 rounded-xl border border-dashed border-border">
                <h2 className="text-xl font-semibold mb-2">Task Not Found</h2>
                <p className="text-muted-foreground">The task you are looking for does not exist or has been deleted.</p>
            </div>
        );
    }

    return (
        <TaskDetail
            task={task}
            onUpdate={(updates) => updateTask.mutate({ id, data: updates })}
        />
    );
}
