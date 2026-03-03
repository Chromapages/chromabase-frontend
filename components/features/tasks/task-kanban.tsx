'use client';

import React, { useState, useMemo } from 'react';
import {
    DndContext,
    DragOverlay,
    rectIntersection,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    useDroppable,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CRMTask, TaskStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, isPast, isToday } from 'date-fns';
import { Clock, AlertCircle, GripVertical, CheckCircle2, MoreHorizontal, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useRouter } from 'next/navigation';

import { TaskCard } from './task-card';

const COLUMNS: { id: TaskStatus; label: string }[] = [
    { id: 'todo', label: 'To Do' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'review', label: 'Review' },
    { id: 'completed', label: 'Completed' },
];

interface TaskKanbanProps {
    tasks: CRMTask[];
    onUpdateStatus: (id: string, status: TaskStatus) => void;
    onAddTask: (status?: TaskStatus) => void;
    onDeleteTask?: (id: string) => void;
    selectedTasks: string[];
    onToggleSelect: (taskId: string, selected: boolean) => void;
    onTaskClick?: (task: CRMTask) => void;
}

export function TaskKanban({
    tasks,
    onUpdateStatus,
    onAddTask,
    onDeleteTask,
    selectedTasks,
    onToggleSelect,
    onTaskClick
}: TaskKanbanProps) {
    const [activeTask, setActiveTask] = useState<CRMTask | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const tasksByStatus = useMemo(() => {
        return COLUMNS.reduce((acc, col) => {
            acc[col.id] = tasks.filter((t) => t.status === col.id);
            return acc;
        }, {} as Record<TaskStatus, CRMTask[]>);
    }, [tasks]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = tasks.find((t) => t.id === active.id);
        if (task) setActiveTask(task);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const activeId = active.id as string;
        const activeData = active.data.current;
        const overData = over.data.current;

        if (!activeData || activeData.type !== 'Task') return;

        let newStatus: TaskStatus | null = null;

        if (overData?.type === 'Column') {
            newStatus = overData.status;
        } else if (overData?.type === 'Task') {
            newStatus = overData.task.status;
        }

        if (newStatus && newStatus !== activeData.task.status) {
            onUpdateStatus(activeId, newStatus);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={rectIntersection}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar min-h-[600px]">
                {COLUMNS.map((column) => (
                    <KanbanColumn
                        key={column.id}
                        id={column.id}
                        label={column.label}
                        tasks={tasksByStatus[column.id]}
                        onAddTask={() => onAddTask(column.id)}
                        onDeleteTask={onDeleteTask}
                        selectedTasks={selectedTasks}
                        onToggleSelect={onToggleSelect}
                        onUpdateStatus={onUpdateStatus}
                        onTaskClick={onTaskClick}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeTask ? (
                    <div className="w-[320px]">
                        <TaskCard task={activeTask} isOverlay />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

interface KanbanColumnProps {
    id: TaskStatus;
    label: string;
    tasks: CRMTask[];
    onAddTask: () => void;
    onDeleteTask?: (id: string) => void;
    selectedTasks: string[];
    onToggleSelect: (taskId: string, selected: boolean) => void;
    onUpdateStatus: (id: string, status: TaskStatus) => void;
    onTaskClick?: (task: CRMTask) => void;
}

function KanbanColumn({
    id,
    label,
    tasks,
    onAddTask,
    onDeleteTask,
    selectedTasks,
    onToggleSelect,
    onUpdateStatus,
    onTaskClick
}: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id: id,
        data: {
            type: 'Column',
            status: id,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className="flex flex-col gap-3 p-3 rounded-xl bg-muted/20 border border-border/30 flex-1 min-w-[300px] shrink-0 h-full"
        >
            <div className="flex items-center justify-between px-1.5 py-1 underline-offset-4">
                <h3 className="font-bold text-[11px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    {label}
                    <span className="text-[10px] bg-muted/50 px-2 py-0.5 rounded border border-border/20 font-medium">
                        {tasks.length}
                    </span>
                </h3>
                <button
                    onClick={onAddTask}
                    className="text-muted-foreground hover:text-primary transition-all p-1 rounded-md hover:bg-muted/50"
                >
                    <Plus className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="flex flex-col gap-2 min-h-[150px] flex-1">
                <SortableContext
                    items={tasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            isSelected={selectedTasks.includes(task.id)}
                            onToggleSelect={(selected) => onToggleSelect(task.id, selected)}
                            onStatusUpdate={(status) => onUpdateStatus(task.id, status)}
                            onDelete={() => onDeleteTask?.(task.id)}
                            onClick={() => onTaskClick?.(task)}
                        />
                    ))}
                </SortableContext>

                <button
                    onClick={onAddTask}
                    className="group flex items-center justify-center gap-2 p-2.5 mt-1 rounded-lg border border-dashed border-border/40 text-muted-foreground hover:text-primary hover:bg-muted/30 hover:border-primary/30 transition-all text-[11px] font-semibold tracking-tight"
                >
                    <Plus className="w-3 h-3 transition-transform group-hover:scale-110" />
                    Quick Add Task
                </button>
            </div>
        </div>
    );
}

