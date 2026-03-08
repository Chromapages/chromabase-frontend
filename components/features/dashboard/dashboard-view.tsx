'use client';

import { useState } from 'react';
import { CalendarSkeleton } from '@/components/shared/loading-skeleton';
import { formatDistanceToNow } from 'date-fns';
import {
    CheckCircle2, CalendarDays, CheckSquare, Activity, Building2
} from 'lucide-react';
import { Lead, Client, Activity as ActivityType, Deal, CRMTask, Appointment } from '@/types';
import { cn } from '@/lib/utils';
import { CalendarView } from '@/components/features/calendar/calendar-view';
import { MobileDashboard } from './mobile-dashboard';
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
    const [nowTimestamp] = useState(() => Date.now());
    const [todayDateString] = useState(() => new Date().toDateString());

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 p-6 animate-pulse">
                {/* KPI Skeletons */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="aspect-square rounded-2xl bg-muted/20 border border-border/40" />
                    ))}
                </div>
                {/* Main Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                    <div className="lg:col-span-3 rounded-2xl bg-muted/10 border border-border/40" />
                    <div className="lg:col-span-6 rounded-3xl bg-card border border-border/50 overflow-hidden shadow-sm">
                        <div className="p-5 border-b border-border/40 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-muted/30" />
                                <div className="h-6 w-40 rounded-md bg-muted/20" />
                            </div>
                            <div className="h-9 w-32 rounded-xl bg-muted/20" />
                        </div>
                        <CalendarSkeleton />
                    </div>
                    <div className="lg:col-span-3 rounded-2xl bg-muted/10 border border-border/40" />
                </div>
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
        <div className="flex flex-col min-h-screen lg:min-h-0 lg:h-[calc(100vh-3.5rem)] overflow-hidden">

            {/* MOBILE (< lg) — Full Independent Experience */}
            <div className="flex lg:hidden flex-1 relative">
                <MobileDashboard
                    leads={leads}
                    clients={clients}
                    deals={deals}
                    tasks={tasks}
                    activities={activities}
                    appointments={appointments}
                />
            </div>

            {/* DESKTOP (>= lg) — Existing Grid Layout */}
            <div className="hidden lg:flex flex-col gap-6 p-6 flex-1 overflow-y-auto scrollbar-thin">

                {/* KPI Header Row */}
                <KPICards leads={leads} clients={clients} deals={deals} tasks={tasks} />

                {/* 3-6-3 Grid Layout */}
                <div className="grid grid-cols-12 gap-6 flex-1 min-h-[580px] max-h-[680px]">

                    {/* ── LEFT: Activity Feed ── */}
                    <section className="col-span-3 flex flex-col h-full glass-md border border-white/10 rounded-sm overflow-hidden shadow-2xl transition-all duration-300">
                        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/5">
                            <div className="flex items-center gap-3">
                                <Activity className="w-4 h-4 text-primary" />
                                <h2 className="text-xs font-bold text-foreground uppercase tracking-[0.2em] font-sans">
                                    Activity Stream
                                </h2>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto scrollbar-thin bg-black/20">
                            <ActivityFeed activities={activities} appointments={appointments} leads={leads} />
                        </div>
                    </section>

                    {/* ── CENTER: Calendar ── */}
                    <section className="col-span-6 flex flex-col h-full glass-lg border border-white/20 rounded-sm overflow-hidden shadow-2xl transition-all duration-300">
                        <div className="flex-1 overflow-hidden bg-black/10">
                            <CalendarView tasks={tasks} appointments={appointments} isLoading={false} />
                        </div>
                    </section>

                    {/* ── RIGHT: Priority Tasks ── */}
                    <section className="col-span-3 flex flex-col h-full glass-md border border-white/10 rounded-sm overflow-hidden shadow-2xl transition-all duration-300">
                        <div className="px-5 py-4 border-b border-white/5 flex flex-col gap-4 shrink-0 bg-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckSquare className="w-4 h-4 text-primary" />
                                    <h2 className="text-xs font-bold text-foreground uppercase tracking-[0.2em] font-sans">
                                        Action Items
                                    </h2>
                                </div>
                            </div>
                            {/* Task Filters */}
                            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-sm border border-white/5">
                                {(['all', 'high', 'medium', 'low'] as const).map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setTaskFilter(filter)}
                                        className={cn(
                                            "flex-1 text-[10px] font-bold uppercase tracking-[0.1em] py-1.5 rounded-sm transition-all font-sans",
                                            taskFilter === filter
                                                ? "bg-primary shadow-lg text-white"
                                                : "text-muted-foreground/40 hover:text-foreground/80 hover:bg-white/5"
                                        )}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-y-auto scrollbar-thin p-3 bg-black/20">
                            {priorityTasks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500/20 mb-2" />
                                    <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest font-sans">
                                        Clear Slate
                                    </p>
                                    <p className="text-[10px] text-muted-foreground/30 font-medium italic">
                                        All objectives reached for this cycle
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {priorityTasks.map(task => {
                                        const pCfg = priorityConfig[task.priority as keyof typeof priorityConfig]
                                            ?? priorityConfig.low;
                                        const isOverdue = task.dueDate && task.dueDate < nowTimestamp;
                                        const isToday = task.dueDate && new Date(task.dueDate).toDateString() === todayDateString;

                                        return (
                                            <div
                                                key={task.id}
                                                className="flex items-start gap-4 px-4 py-3 rounded-sm glass-xs hover:glass-sm border border-transparent hover:border-white/10 transition-all group cursor-pointer"
                                            >
                                                <button
                                                    className="mt-0.5 w-5 h-5 rounded-sm border border-white/10 hover:border-primary hover:bg-primary/10 shrink-0 flex items-center justify-center transition-all cursor-pointer"
                                                    title="Resolve Task"
                                                >
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-transparent group-hover:text-primary/70 transition-colors" />
                                                </button>

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[13px] font-bold text-foreground leading-tight group-hover:text-primary transition-colors truncate font-display tracking-tight">
                                                        {task.title}
                                                    </p>

                                                    <div className="flex items-center justify-between mt-2 gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className={cn('w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px_currentColor]', pCfg.label.replace('text-', 'bg-'))} />
                                                            <span className={cn('text-[10px] font-bold uppercase tracking-widest font-sans opacity-60', pCfg.label)}>
                                                                {task.priority}
                                                            </span>
                                                        </div>

                                                        {task.dueDate && (
                                                            <span className={cn(
                                                                'text-[10px] font-bold shrink-0 px-2 py-0.5 rounded-sm uppercase tracking-tighter font-sans',
                                                                isOverdue ? 'bg-rose-500/20 text-rose-400'
                                                                    : isToday ? 'bg-amber-500/20 text-amber-400'
                                                                        : 'text-muted-foreground/40 italic'
                                                            )}>
                                                                {isOverdue ? 'Overdue' : isToday ? 'Today' : formatDistanceToNow(task.dueDate, { addSuffix: true })}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {task.accountId && clients?.some(c => c.id === task.accountId) && (
                                                        <p className="text-[10px] text-muted-foreground/30 mt-2 truncate flex items-center gap-1.5 font-medium italic">
                                                            <Building2 className="w-3 h-3" />
                                                            {clients.find(c => c.id === task.accountId)?.companyName}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Phase 3: Pipeline Strip */}
                <div className="mt-2">
                    <PipelineStrip deals={deals} />
                </div>
            </div>
        </div>
    );
}
