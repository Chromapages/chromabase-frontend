'use client';

import { useState } from 'react';
import { CardGridSkeleton } from '@/components/shared/loading-skeleton';
import { formatDistanceToNow } from 'date-fns';
import {
    ExternalLink, CheckCircle2, CalendarDays, CheckSquare, Activity, Building2
} from 'lucide-react';
import { Lead, Client, Activity as ActivityType, Deal, CRMTask, Appointment } from '@/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CalendarView } from '@/components/features/calendar/calendar-view';
import { MobileVerticalFeed } from '@/components/features/dashboard/mobile-vertical-feed';
import { KPICards } from './kpi-cards';
import { ActivityFeed } from './activity-feed';
import { PipelineStrip } from './pipeline-strip';

interface DashboardViewProps {
    leads: Lead[] | undefined;
    clients: Client[] | undefined;
    deals: Deal[] | undefined;
    tasks: CRMTask[] | undefined;
    activities?: ActivityType[] | undefined;
    appointments: Appointment[] | undefined;
    isLoading: boolean;
    error?: Error | null;
}

/* ── Priority colour mapping — Swiss semantic colour system ── */
const priorityConfig = {
    high: { dot: 'bg-destructive/70', label: 'text-destructive/80' },
    medium: { dot: 'bg-warning/70', label: 'text-warning/90' },
    low: { dot: 'bg-primary/50', label: 'text-muted-foreground' },
} as const;

export function DashboardView({
    leads, clients, deals, tasks, activities, appointments, isLoading, error,
}: DashboardViewProps) {
    const [taskFilter, setTaskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

    if (isLoading) {
        return (
            <div className="p-6">
                <CardGridSkeleton count={3} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="m-6 bg-destructive/8 border border-destructive/20 p-4 rounded-xl text-destructive text-[13px] flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse shrink-0" />
                Error loading data: {error.message}
            </div>
        );
    }

    // Filter and sort tasks
    const priorityTasks = tasks
        ?.filter(t => t.status !== 'completed')
        ?.filter(t => taskFilter === 'all' ? true : t.priority === taskFilter)
        .sort((a, b) => {
            if (a.priority === 'high' && b.priority !== 'high') return -1;
            if (b.priority === 'high' && a.priority !== 'high') return 1;
            return (a.dueDate || 0) - (b.dueDate || 0);
        })
        .slice(0, 15) || [];

    return (
        <div className="flex flex-col gap-4 p-6 min-h-[640px] h-[calc(100vh-3.5rem)] overflow-y-auto scrollbar-thin">

            {/* Phase 1: KPI Header Row */}
            <KPICards leads={leads} clients={clients} deals={deals} tasks={tasks} />

            {/* 3-6-3 Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">

                {/* ── LEFT: Activity Feed (Replaces Accounts) ── */}
                <section className="lg:col-span-3 flex flex-col bg-card border border-border/60 rounded-xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow duration-200">
                    <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-primary/70" />
                            <h2 className="text-[13px] font-semibold text-foreground tracking-[-0.02em]">
                                Activity Feed
                            </h2>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar-thin">
                        <ActivityFeed activities={activities} appointments={appointments} leads={leads} />
                    </div>
                </section>

                {/* ── CENTER: Calendar / Mobile Feed ─────────────── */}
                <section className="lg:col-span-6 flex flex-col bg-card border border-border/60 rounded-xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow duration-200">
                    <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-primary/70" />
                        <h2 className="text-[13px] font-semibold text-foreground tracking-[-0.02em]">
                            <span className="hidden lg:inline">Unified Calendar</span>
                            <span className="inline lg:hidden">Your Feed</span>
                        </h2>
                    </div>
                    <div className="flex-1 min-h-[400px] overflow-hidden">
                        <div className="hidden lg:flex h-full overflow-y-auto scrollbar-thin">
                            <CalendarView tasks={tasks} appointments={appointments} isLoading={false} />
                        </div>
                        <div className="block lg:hidden overflow-y-auto scrollbar-thin h-full">
                            <MobileVerticalFeed
                                appointments={appointments || []}
                                tasks={tasks || []}
                                clients={clients || []}
                                leads={leads || []}
                                deals={deals || []}
                            />
                        </div>
                    </div>
                </section>

                {/* ── RIGHT: Priority Tasks ───────────────────────── */}
                <section className="lg:col-span-3 flex flex-col bg-card border border-border/60 rounded-xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow duration-200">
                    <div className="px-4 py-3 border-b border-border/50 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckSquare className="w-4 h-4 text-primary/70" />
                                <h2 className="text-[13px] font-semibold text-foreground tracking-[-0.02em]">
                                    Priority Tasks
                                </h2>
                            </div>
                        </div>
                        {/* Task Filters */}
                        <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-md">
                            {(['all', 'high', 'medium', 'low'] as const).map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setTaskFilter(filter)}
                                    className={cn(
                                        "flex-1 text-[10px] font-semibold uppercase tracking-wider py-1 rounded transition-colors",
                                        taskFilter === filter
                                            ? "bg-background shadow-sm text-foreground"
                                            : "text-muted-foreground/60 hover:text-foreground/80 hover:bg-black/5 dark:hover:bg-white/5"
                                    )}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
                        {priorityTasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full py-8 text-center gap-1">
                                <CheckCircle2 className="w-8 h-8 text-success/40 mb-1" />
                                <p className="text-[12px] font-medium text-muted-foreground/60">
                                    All caught up
                                </p>
                                <p className="text-[11px] text-muted-foreground/40">
                                    No pending tasks for this filter
                                </p>
                            </div>
                        ) : (
                            priorityTasks.map(task => {
                                const pCfg = priorityConfig[task.priority as keyof typeof priorityConfig]
                                    ?? priorityConfig.low;
                                const isOverdue = task.dueDate && task.dueDate < Date.now();
                                const isToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();

                                return (
                                    <div
                                        key={task.id}
                                        className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-colors group cursor-pointer"
                                    >
                                        {/* Check button */}
                                        <button
                                            className="mt-0.5 w-4 h-4 rounded-full border border-border/60 hover:border-success hover:bg-success/10 shrink-0 flex items-center justify-center transition-all duration-150 cursor-pointer"
                                            title="Mark as complete"
                                        >
                                            <CheckCircle2 className="h-3 w-3 text-transparent group-hover:text-success/70 transition-colors" />
                                        </button>

                                        {/* Task content */}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[13px] font-medium text-foreground leading-snug group-hover:text-primary transition-colors truncate">
                                                {task.title}
                                            </p>

                                            <div className="flex items-center justify-between mt-1 gap-1">
                                                {/* Priority */}
                                                <div className="flex items-center gap-1.5">
                                                    <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', pCfg.dot)} />
                                                    <span className={cn('text-label-micro', pCfg.label)}>
                                                        {task.priority}
                                                    </span>
                                                </div>

                                                {/* Due date */}
                                                {task.dueDate && (
                                                    <span className={cn(
                                                        'text-[10px] font-bold shrink-0 px-1.5 py-0.5 rounded-sm',
                                                        isOverdue ? 'bg-destructive/10 text-destructive'
                                                            : isToday ? 'bg-warning/10 text-warning-foreground'
                                                                : 'text-muted-foreground/60'
                                                    )}>
                                                        {isOverdue ? 'Overdue' : isToday ? 'Today' : formatDistanceToNow(task.dueDate, { addSuffix: true })}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Account name */}
                                            {task.accountId && clients?.some(c => c.id === task.accountId) && (
                                                <p className="text-[10px] text-muted-foreground/40 mt-1 truncate flex items-center gap-1">
                                                    <Building2 className="w-3 h-3" />
                                                    {clients.find(c => c.id === task.accountId)?.companyName}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>
            </div>

            {/* Phase 3: Pipeline Strip */}
            <PipelineStrip deals={deals} />

        </div>
    );
}
