'use client';

import { useState } from 'react';
import { DataTable, Column } from '@/components/shared/data-table';
import { CRMTask } from '@/types';
import { Badge } from '@/components/ui/badge';
import { format, isPast, isToday } from 'date-fns';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TaskTableProps {
    tasks: CRMTask[];
    onUpdateStatus: (id: string, status: CRMTask['status']) => void;
    selectedTasks: string[];
    onToggleSelect: (taskId: string, selected: boolean) => void;
    onSelectAll: (selected: boolean) => void;
    onTaskClick?: (task: CRMTask) => void;
}

export function TaskTable({ tasks, onUpdateStatus, selectedTasks, onToggleSelect, onSelectAll, onTaskClick }: TaskTableProps) {
    const [page, setPage] = useState(1);
    const itemsPerPage = 20; // Increased density

    const totalPages = Math.ceil(tasks.length / itemsPerPage);
    const paginatedTasks = tasks.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const toggleTaskStatus = (task: CRMTask) => {
        const newStatus = task.status === 'completed' ? 'todo' : 'completed';
        onUpdateStatus(task.id, newStatus);
    };

    const columns: Column<CRMTask>[] = [
        {
            header: '',
            headerCell: () => (
                <div className="flex items-center justify-center h-full">
                    <button
                        onClick={() => {
                            const allSelected = tasks.length > 0 && selectedTasks.length === tasks.length;
                            onSelectAll(!allSelected);
                        }}
                        className={cn(
                            "flex w-3.5 h-3.5 rounded border border-border/60 items-center justify-center transition-all",
                            (tasks.length > 0 && selectedTasks.length === tasks.length) ? "bg-primary border-primary text-primary-foreground" : "bg-transparent text-transparent hover:border-primary/60"
                        )}
                    >
                        <CheckCircle2 className="w-2.5 h-2.5" />
                    </button>
                </div>
            ),
            cell: (task) => {
                const isSelected = selectedTasks.includes(task.id);
                const priorityColors = {
                    low: 'bg-slate-500',
                    medium: 'bg-blue-500',
                    high: 'bg-orange-500',
                    urgent: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]',
                };

                return (
                    <div className="flex items-center gap-3 relative h-10 -my-2 -mx-4 px-4 overflow-hidden group">
                        {/* Priority Indicator */}
                        <div className={cn(
                            "absolute left-0 top-0 bottom-0 w-1 group-hover:w-1.5 transition-all",
                            priorityColors[task.priority as keyof typeof priorityColors]
                        )} />

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleSelect(task.id, !isSelected);
                            }}
                            className={cn(
                                "flex w-3.5 h-3.5 rounded border border-border/60 items-center justify-center transition-all shrink-0 ml-1",
                                isSelected ? "bg-primary border-primary text-primary-foreground" : "bg-transparent text-transparent hover:border-primary/60"
                            )}
                        >
                            <CheckCircle2 className="w-2.5 h-2.5" />
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); toggleTaskStatus(task); }}
                            className="text-muted-foreground hover:text-primary transition-all flex items-center justify-center cursor-pointer opacity-40 group-hover:opacity-100"
                        >
                            {task.status === 'completed' ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500 opacity-100" />
                            ) : (
                                <Circle className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                );
            },
            className: 'w-16 overflow-visible'
        },
        {
            header: 'Task Title',
            cell: (task) => (
                <div className="flex flex-col min-w-[200px]">
                    <span className={cn(
                        "font-semibold text-sm tracking-tight",
                        task.status === 'completed' ? 'line-through text-muted-foreground opacity-60' : 'text-foreground'
                    )}>
                        {task.title}
                    </span>
                    {task.description && (
                        <span className="text-[10px] text-muted-foreground truncate max-w-[300px] font-medium leading-none mt-0.5">
                            {task.description}
                        </span>
                    )}
                </div>
            )
        },
        {
            header: 'Assigned To',
            cell: (task) => (
                <div className="flex items-center gap-2">
                    <Avatar className="w-5 h-5 border border-background ring-1 ring-border/20">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignedTo}`} alt="User avatar" />
                        <AvatarFallback className="text-[8px]">{task.assignedTo?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{task.assignedTo}</span>
                </div>
            ),
            className: 'w-32'
        },
        {
            header: 'Priority',
            cell: (task) => {
                const colors = {
                    low: 'text-slate-500',
                    medium: 'text-blue-500',
                    high: 'text-orange-500 font-semibold',
                    urgent: 'text-red-500 font-bold',
                };
                return (
                    <span className={cn("text-[10px] uppercase tracking-wider font-bold", colors[task.priority as keyof typeof colors])}>
                        {task.priority}
                    </span>
                );
            },
            className: 'w-24'
        },
        {
            header: 'Due Date',
            cell: (task) => {
                if (!task.dueDate) return <span className="text-muted-foreground text-[11px]">-</span>;
                const date = new Date(task.dueDate);
                const isOverdue = isPast(date) && !isToday(date) && task.status !== 'completed';
                const isDueToday = isToday(date) && task.status !== 'completed';
                return (
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                        {isOverdue && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                        <span className={cn(
                            "text-[11px] font-medium transition-colors",
                            isOverdue ? "text-red-500" : isDueToday ? "text-orange-500" : "text-muted-foreground"
                        )}>
                            {format(date, 'MMM d, yyyy')}
                        </span>
                    </div>
                );
            },
            className: 'w-32'
        }
    ];

    return (
        <div className="bg-card/60 backdrop-blur-2xl border border-border/40 rounded-3xl overflow-hidden shadow-sm">
            <DataTable
                data={paginatedTasks}
                columns={columns}
                keyExtractor={(t) => t.id}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                onRowClick={onTaskClick}
            />
        </div>
    );
}

