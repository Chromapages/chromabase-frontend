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
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-[18px] font-bold tracking-tight text-foreground uppercase">Operational Tasks</h3>
                    <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest font-sans">Strategic task queue & execution management</p>
                </div>
                <Button
                    size="sm"
                    variant="glass"
                    className="h-10 px-6 border-white/10 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all hover:border-chroma-orange/30 group"
                    onClick={handleCreateTask}
                >
                    <Plus className="w-3.5 h-3.5 mr-2 text-chroma-orange" />
                    New Objective
                </Button>
            </div>

            <div className="glass-md border-white/10 rounded-sm overflow-hidden shadow-2xl">
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
                    <div className="p-20 text-center glass-sm border border-dashed border-white/5 m-4 rounded-sm">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/20">
                            Zero Delta: No Tasks assigned to this unit
                        </p>
                    </div>
                )}
            </div>

            <TaskDialog
                open={isTaskDialogOpen}
                onOpenChange={setIsTaskDialogOpen}
                task={editingTask}
                defaultAccountId={clientId}
            />
        </div>
    );
}
