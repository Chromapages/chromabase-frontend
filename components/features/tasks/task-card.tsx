'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CRMTask } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, isPast, isToday } from 'date-fns';
import { Clock, AlertCircle, GripVertical, CheckCircle2, MoreHorizontal, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface TaskCardProps {
    task: CRMTask;
    isOverlay?: boolean;
    isSelected?: boolean;
    onToggleSelect?: (selected: boolean) => void;
    onClick?: () => void;
    onStatusUpdate?: (status: CRMTask['status']) => void;
    onDelete?: () => void;
}

export function TaskCard({
    task,
    isOverlay,
    isSelected,
    onToggleSelect,
    onClick,
    onStatusUpdate,
    onDelete
}: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const priorityColors = {
        low: 'bg-slate-500',
        medium: 'bg-blue-500',
        high: 'bg-orange-500',
        urgent: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]',
    };

    const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && task.status !== 'completed';
    const isDueToday = task.dueDate && isToday(new Date(task.dueDate)) && task.status !== 'completed';

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={onClick}
            className={cn(
                "relative bg-card/60 backdrop-blur-sm border border-border/40 rounded-lg p-3 shadow-sm group active:cursor-grabbing cursor-pointer hover:border-primary/40 hover:bg-card transition-all duration-200 overflow-hidden",
                isDragging && "opacity-40 grayscale-[0.5]",
                isOverlay && "shadow-xl border-primary/50 cursor-grabbing bg-card z-50",
                isSelected && "border-primary/40 bg-primary/5"
            )}
        >
            {/* Priority Indicator Bar */}
            <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5",
                priorityColors[task.priority as keyof typeof priorityColors]
            )} />

            <div className="pl-2.5">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 overflow-hidden">
                        {onToggleSelect && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleSelect(!isSelected);
                                }}
                                className={cn(
                                    "flex w-3.5 h-3.5 rounded border border-border/60 items-center justify-center transition-all shrink-0",
                                    isSelected ? "bg-primary border-primary text-primary-foreground" : "bg-transparent text-transparent hover:border-primary/60"
                                )}
                            >
                                <CheckCircle2 className="w-2.5 h-2.5" />
                            </button>
                        )}
                        <h4 className={cn(
                            "font-semibold text-[13px] leading-tight truncate transition-all",
                            task.status === 'completed' ? "text-muted-foreground line-through opacity-60" : "text-foreground group-hover:text-primary/90"
                        )}>
                            {task.title}
                        </h4>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div
                            {...attributes}
                            {...listeners}
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded hover:bg-muted cursor-grab active:cursor-grabbing transition-colors"
                        >
                            <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        {task.dueDate && (
                            <div className={cn(
                                "flex items-center gap-1 text-[10px] font-medium shrink-0",
                                isOverdue ? "text-red-500" : isDueToday ? "text-orange-500" : "text-muted-foreground"
                            )}>
                                {isOverdue && <AlertCircle className="w-2.5 h-2.5" />}
                                {!isOverdue && <Clock className="w-2.5 h-2.5 opacity-70" />}
                                {format(new Date(task.dueDate), 'MMM d')}
                            </div>
                        )}

                        <div className="flex -space-x-1.5 overflow-hidden">
                            <Avatar className="w-5 h-5 border border-background ring-1 ring-border/20">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignedTo}`} />
                                <AvatarFallback className="text-[8px]">{task.assignedTo?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {task.status !== 'completed' && onStatusUpdate && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-6 h-6 rounded-full hover:bg-green-500/10 hover:text-green-500 opacity-0 group-hover:opacity-100 transition-all"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onStatusUpdate('completed');
                                }}
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            </Button>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-6 h-6 rounded-full hover:bg-muted opacity-0 group-hover:opacity-100 transition-all"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreHorizontal className="w-3.5 h-3.5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32 bg-background/95 backdrop-blur-md">
                                <DropdownMenuItem onClick={() => onClick?.()}>
                                    View Details
                                </DropdownMenuItem>
                                {onStatusUpdate && task.status !== 'completed' && (
                                    <DropdownMenuItem onClick={() => onStatusUpdate('completed')}>
                                        Complete
                                    </DropdownMenuItem>
                                )}
                                {onDelete && (
                                    <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => onDelete()}
                                    >
                                        <Trash2 className="mr-2 w-3.5 h-3.5" />
                                        Delete
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    );
}
