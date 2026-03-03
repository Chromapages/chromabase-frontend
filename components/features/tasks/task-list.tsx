'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Clock, CheckCircle2, Trash2 } from 'lucide-react';
import { CRMTask } from '@/types';
import { cn } from '@/lib/utils';

import { TasksFilterBar } from './tasks-filter-bar';
import { TaskDialog } from './task-dialog';
import { TaskStats } from './task-stats';
import { TaskTable } from './task-table';
import { TaskKanban } from './task-kanban';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TableSkeleton } from '@/components/shared/loading-skeleton';

interface TaskListProps {
    tasks: CRMTask[] | undefined;
    isLoading: boolean;
    onUpdateStatus: (id: string, status: CRMTask['status']) => void;
    onDeleteTask?: (id: string) => void;
    onBulkDelete?: (ids: string[]) => void;
    onBulkUpdate?: (ids: string[], data: Partial<CRMTask>) => void;
}

export function TaskList({ tasks, isLoading, onUpdateStatus, onDeleteTask, onBulkDelete, onBulkUpdate }: TaskListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<CRMTask | null>(null);
    const [initialStatus, setInitialStatus] = useState<CRMTask['status'] | undefined>();
    const [view, setView] = useState<'list' | 'kanban'>('kanban');
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [selectedTaskDetail, setSelectedTaskDetail] = useState<CRMTask | null>(null);

    const handleToggleSelect = (taskId: string, selected: boolean) => {
        if (selected) {
            setSelectedTasks(prev => [...prev, taskId]);
        } else {
            setSelectedTasks(prev => prev.filter(id => id !== taskId));
        }
    };

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedTasks(filteredTasks.map(t => t.id));
        } else {
            setSelectedTasks([]);
        }
    };

    const handleBulkDelete = () => {
        if (onBulkDelete) {
            onBulkDelete(selectedTasks);
        }
        setSelectedTasks([]);
    };

    const handleBulkStatus = (status: CRMTask['status']) => {
        if (onBulkUpdate) {
            onBulkUpdate(selectedTasks, { status });
        } else {
            selectedTasks.forEach(id => {
                onUpdateStatus(id, status);
            });
        }
        setSelectedTasks([]);
    };

    const handleAddTask = (status?: CRMTask['status']) => {
        setEditingTask(null);
        setInitialStatus(status);
        setIsDialogOpen(true);
    };

    const handleEditTask = (task: CRMTask) => {
        setEditingTask(task);
        setIsDialogOpen(true);
    };

    const handleStatusToggle = (status: string) => {
        setSelectedStatuses(prev =>
            prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
        );
    };

    const handlePriorityToggle = (priority: string) => {
        setSelectedPriorities(prev =>
            prev.includes(priority) ? prev.filter(p => p !== priority) : [...prev, priority]
        );
    };

    const filteredTasks = tasks?.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(t.status);
        const matchesPriority = selectedPriorities.length === 0 || selectedPriorities.includes(t.priority);
        return matchesSearch && matchesStatus && matchesPriority;
    }).sort((a, b) => {
        if (a.status === 'completed' && b.status !== 'completed') return 1;
        if (a.status !== 'completed' && b.status === 'completed') return -1;
        return a.dueDate - b.dueDate;
    }) || [];

    const completedCount = tasks?.filter(t => t.status === 'completed').length || 0;
    const totalCount = tasks?.length || 0;

    return (
        <div className="space-y-6">
            <TaskStats tasks={tasks || []} isLoading={isLoading} />

            <TasksFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedStatuses={selectedStatuses}
                onStatusToggle={handleStatusToggle}
                selectedPriorities={selectedPriorities}
                onPriorityToggle={handlePriorityToggle}
                view={view}
                onViewChange={setView}
                onAddTask={() => handleAddTask()}
                taskCount={totalCount}
                completedCount={completedCount}
            />

            {isLoading ? (
                <TableSkeleton rows={8} />
            ) : (
                <div className="w-full min-h-[500px]">
                    {view === 'list' ? (
                        <TaskTable
                            tasks={filteredTasks}
                            onUpdateStatus={onUpdateStatus}
                            selectedTasks={selectedTasks}
                            onToggleSelect={handleToggleSelect}
                            onSelectAll={handleSelectAll}
                            onTaskClick={setSelectedTaskDetail}
                        />
                    ) : (
                        <TaskKanban
                            tasks={filteredTasks}
                            onUpdateStatus={onUpdateStatus}
                            onAddTask={handleAddTask}
                            onDeleteTask={onDeleteTask}
                            selectedTasks={selectedTasks}
                            onToggleSelect={handleToggleSelect}
                            onTaskClick={setSelectedTaskDetail}
                        />
                    )}
                </div>
            )}

            <TaskDialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        setEditingTask(null);
                        setInitialStatus(undefined);
                    }
                }}
                task={editingTask}
                initialStatus={initialStatus}
            />

            {/* Task Detail Drawer */}
            <Sheet open={!!selectedTaskDetail} onOpenChange={(open) => !open && setSelectedTaskDetail(null)}>
                <SheetContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-l border-border/40 p-0 overflow-y-auto">
                    {selectedTaskDetail && (
                        <div className="h-full flex flex-col">
                            <div className={cn(
                                "h-1.5 w-full",
                                selectedTaskDetail.priority === 'low' && "bg-slate-500",
                                selectedTaskDetail.priority === 'medium' && "bg-blue-500",
                                selectedTaskDetail.priority === 'high' && "bg-orange-500",
                                selectedTaskDetail.priority === 'urgent' && "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                            )} />
                            <div className="p-6 space-y-6">
                                <SheetHeader className="text-left">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest border-primary/20 text-primary bg-primary/5">
                                            {selectedTaskDetail.status.replace('_', ' ')}
                                        </Badge>
                                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest">
                                            Priority: {selectedTaskDetail.priority}
                                        </Badge>
                                    </div>
                                    <SheetTitle className="text-2xl font-bold tracking-tight text-foreground">
                                        {selectedTaskDetail.title}
                                    </SheetTitle>
                                </SheetHeader>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Due Date</span>
                                            <div className="flex items-center gap-2 text-sm font-semibold">
                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                {format(new Date(selectedTaskDetail.dueDate), 'MMMM d, yyyy')}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Assignee</span>
                                            <div className="flex items-center gap-2 text-sm font-semibold">
                                                <Avatar className="w-5 h-5 ring-1 ring-border/20">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedTaskDetail.assignedTo}`} />
                                                    <AvatarFallback>{selectedTaskDetail.assignedTo?.[0]}</AvatarFallback>
                                                </Avatar>
                                                {selectedTaskDetail.assignedTo}
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-border/40" />

                                    <div className="space-y-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</span>
                                        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                            {selectedTaskDetail.description || 'No description provided.'}
                                        </p>
                                    </div>

                                    {selectedTaskDetail.relatedTo && (
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Related {selectedTaskDetail.relatedTo.type}</span>
                                            <div className="p-3 rounded-lg border border-border/40 bg-muted/20 flex items-center justify-between group cursor-pointer hover:bg-muted/30 transition-all">
                                                <span className="text-xs font-semibold">{selectedTaskDetail.relatedTo.id}</span>
                                                <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                    View
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <Separator className="bg-border/40" />

                                    <div className="flex items-center gap-3 pt-4">
                                        {selectedTaskDetail.status !== 'completed' && (
                                            <Button
                                                className="flex-1 font-bold uppercase tracking-widest text-[11px] gap-2 h-11"
                                                onClick={() => {
                                                    onUpdateStatus(selectedTaskDetail.id, 'completed');
                                                    setSelectedTaskDetail(null);
                                                }}
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                Complete Task
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            className="font-bold uppercase tracking-widest text-[11px] h-11 border-border/40"
                                            onClick={() => handleEditTask(selectedTaskDetail)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-11 w-11 text-destructive hover:bg-destructive/10 transition-colors"
                                            onClick={() => {
                                                onDeleteTask?.(selectedTaskDetail.id);
                                                setSelectedTaskDetail(null);
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Bulk Action Bar */}
            {selectedTasks.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="bg-popover/90 backdrop-blur-md text-popover-foreground shadow-2xl border border-border/40 rounded-full px-4 py-2.5 flex items-center gap-4 ring-1 ring-primary/10">
                        <span className="text-xs font-bold px-2 uppercase tracking-tight">
                            {selectedTasks.length} selected
                        </span>
                        <div className="w-px h-6 bg-border/40" />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-[11px] font-bold uppercase tracking-widest text-green-500 hover:text-green-400 hover:bg-green-500/10 rounded-full h-8"
                            onClick={() => handleBulkStatus('completed')}
                        >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Mark Done
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-[11px] font-bold uppercase tracking-widest text-destructive hover:text-red-400 hover:bg-destructive/10 rounded-full h-8"
                            onClick={handleBulkDelete}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                        </Button>
                        <div className="w-px h-6 bg-border/40" />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full px-4 h-8 text-[11px] font-bold uppercase tracking-widest hover:bg-muted"
                            onClick={() => setSelectedTasks([])}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

