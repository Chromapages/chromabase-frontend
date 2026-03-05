'use client';

import { useState } from 'react';
import { CRMTask } from '@/types';
import { useTasks } from '@/hooks';
import { TaskTable } from '@/components/features/tasks/task-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskDialog } from '@/components/features/tasks/task-dialog';

interface AccountTasksPanelProps {
    clientId: string;
    tasks: CRMTask[];
}

export function AccountTasksPanel({ clientId, tasks }: AccountTasksPanelProps) {
    const { useUpdate } = useTasks();
    const updateTask = useUpdate();

    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<CRMTask | null>(null);

    const handleUpdateStatus = (id: string, status: CRMTask['status']) => {
        updateTask.mutate({ id, data: { status, updatedAt: Date.now() } });
    };

    const handleToggleSelect = (taskId: string, selected: boolean) => {
        if (selected) {
            setSelectedTasks(prev => [...prev, taskId]);
        } else {
            setSelectedTasks(prev => prev.filter(id => id !== taskId));
        }
    };

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedTasks(tasks.map(t => t.id));
        } else {
            setSelectedTasks([]);
        }
    };

    const handleTaskClick = (task: CRMTask) => {
        setEditingTask(task);
        setIsTaskDialogOpen(true);
    };

    const handleCreateTask = () => {
        setEditingTask(null);
        setIsTaskDialogOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium">Tasks</h3>
                    <p className="text-sm text-muted-foreground">Manage tasks associated with this account.</p>
                </div>
                <Button size="sm" className="shadow-sm" onClick={handleCreateTask}>
                    <Plus className="w-4 h-4 mr-2" /> Add Task
                </Button>
            </div>

            {tasks.length > 0 ? (
                <TaskTable
                    tasks={tasks}
                    onUpdateStatus={handleUpdateStatus}
                    selectedTasks={selectedTasks}
                    onToggleSelect={handleToggleSelect}
                    onSelectAll={handleSelectAll}
                    onTaskClick={handleTaskClick}
                />
            ) : (
                <div className="p-8 text-center text-muted-foreground bg-card border border-dashed rounded-xl">
                    No tasks yet
                </div>
            )}

            <TaskDialog
                open={isTaskDialogOpen}
                onOpenChange={setIsTaskDialogOpen}
                task={editingTask}
                defaultAccountId={clientId}
            />
        </div>
    );
}
