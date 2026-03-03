'use client';

import { Search, LayoutGrid, List, Plus, Filter, SortAsc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from '@/constants';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

interface TasksFilterBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedStatuses: string[];
    onStatusToggle: (status: string) => void;
    selectedPriorities: string[];
    onPriorityToggle: (priority: string) => void;
    view: 'kanban' | 'list';
    onViewChange: (view: 'kanban' | 'list') => void;
    onAddTask: () => void;
    taskCount: number;
    completedCount: number;
}

export function TasksFilterBar({
    searchQuery,
    onSearchChange,
    selectedStatuses,
    onStatusToggle,
    selectedPriorities,
    onPriorityToggle,
    view,
    onViewChange,
    onAddTask,
    taskCount,
    completedCount,
}: TasksFilterBarProps) {
    return (
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-card/40 backdrop-blur-md border border-border/40 p-2.5 rounded-xl shadow-sm">
            <div className="flex flex-1 items-center gap-4 min-w-0">
                <div className="relative w-full max-w-sm shrink-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tasks..."
                        className="pl-9 h-9 bg-background/50 border-border/40 focus-visible:ring-primary/20 transition-all"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <div className="hidden lg:block h-6 w-px bg-border/40 shrink-0" />

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    {TASK_STATUS_OPTIONS.map((status) => {
                        const isSelected = selectedStatuses.includes(status.value);
                        return (
                            <button
                                key={status.value}
                                onClick={() => onStatusToggle(status.value)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all border whitespace-nowrap shrink-0",
                                    isSelected
                                        ? "bg-primary/20 border-primary/50 text-primary shadow-sm"
                                        : "bg-muted/30 border-border/40 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                )}
                            >
                                {status.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
                <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 bg-muted/30 border border-border/40 rounded-full text-[11px] font-medium text-muted-foreground">
                    <span>Progress</span>
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden border border-border/20">
                        <div
                            className="h-full bg-primary/80 transition-all duration-500"
                            style={{ width: `${taskCount > 0 ? (completedCount / taskCount) * 100 : 0}%` }}
                        />
                    </div>
                    <span className="text-foreground">{completedCount}/{taskCount}</span>
                </div>

                <div className="hidden sm:block h-6 w-px bg-border/40 shrink-0" />

                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/40 shrink-0">
                        <Button
                            variant={view === 'kanban' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-7 w-7 rounded-sm transition-all"
                            onClick={() => onViewChange('kanban')}
                            title="Kanban View"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={view === 'list' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-7 w-7 rounded-sm transition-all"
                            onClick={() => onViewChange('list')}
                            title="List View"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 gap-2 bg-background/50 border-border/40 shrink-0">
                                <Filter className="h-4 w-4" />
                                <span className="hidden sm:inline">Priority</span>
                                {selectedPriorities.length > 0 && (
                                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                                        {selectedPriorities.length}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-md">
                            <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {TASK_PRIORITY_OPTIONS.map((priority) => (
                                <DropdownMenuCheckboxItem
                                    key={priority.value}
                                    checked={selectedPriorities.includes(priority.value)}
                                    onCheckedChange={() => onPriorityToggle(priority.value)}
                                >
                                    <span className={cn(
                                        "w-2 h-2 rounded-full mr-2",
                                        priority.value === 'low' && "bg-slate-400",
                                        priority.value === 'medium' && "bg-blue-400",
                                        priority.value === 'high' && "bg-orange-400",
                                        priority.value === 'urgent' && "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                    )} />
                                    {priority.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button onClick={onAddTask} size="sm" className="h-9 gap-2 shadow-sm shadow-primary/20 shrink-0">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">New Task</span>
                        <span className="sm:hidden">New</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
