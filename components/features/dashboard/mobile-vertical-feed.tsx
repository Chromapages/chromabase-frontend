'use client';

import * as React from 'react';
import { format, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, CheckCircle2, Circle, Clock, Users, TrendingUp, Briefcase, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Appointment, CRMTask, Client, Lead, Deal } from '@/types';
import { motion, useAnimation, useReducedMotion } from 'framer-motion';
import { useTasks, useAppointments } from '@/hooks';

interface MobileVerticalFeedProps {
    appointments: Appointment[];
    tasks: CRMTask[];
    clients: Client[];
    leads?: Lead[];
    deals?: Deal[];
}

type FeedItem =
    | { type: 'appointment'; data: Appointment; timestamp: number }
    | { type: 'task'; data: CRMTask; timestamp: number };

function MetricCard({ icon: Icon, label, value, colorClass }: { icon: any, label: string, value: string | number, colorClass: string }) {
    return (
        <div className="flex-shrink-0 w-32 bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl p-4 shadow-sm">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center mb-3", colorClass.replace('text-', 'bg-').replace('600', '500/10').replace('500', '400/10'))}>
                <Icon className={cn("w-4 h-4", colorClass)} />
            </div>
            <div className="space-y-0.5">
                <p className="text-xl font-bold tracking-tight text-foreground">{value}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">{label}</p>
            </div>
        </div>
    );
}

function SwipeableCard({ children, onComplete, onReschedule, isTask }: { children: React.ReactNode, onComplete?: () => void, onReschedule?: () => void, isTask: boolean }) {
    const controls = useAnimation();
    const shouldReduceMotion = useReducedMotion();

    const handleDragEnd = async (event: any, info: any) => {
        const threshold = 80;
        if (info.offset.x > threshold && onComplete) {
            // Swiped right (Complete)
            onComplete();
            controls.start({ x: 0 }); // snap back after action or let parent remove it
        } else if (info.offset.x < -threshold && onReschedule) {
            // Swiped left (Reschedule)
            onReschedule();
            controls.start({ x: 0 }); // snap back
        } else {
            // Snap back
            controls.start({ x: 0 });
        }
    };

    if (shouldReduceMotion) {
        return (
            <div className="relative w-full rounded-xl group/card">
                {children}
                <div className="flex gap-2 mt-2 opacity-100 sm:opacity-0 sm:group-hover/card:opacity-100 transition-opacity">
                    {onComplete && (
                        <button onClick={onComplete} className="text-xs bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-md border border-emerald-500/20 font-medium">Complete</button>
                    )}
                    {onReschedule && (
                        <button onClick={onReschedule} className="text-xs bg-amber-500/10 text-amber-500 px-3 py-1 rounded-md border border-amber-500/20 font-medium">Reschedule</button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full rounded-xl">
            {/* Background actions */}
            <div className="absolute inset-0 flex items-center justify-between px-4 pb-1 font-bold text-xs uppercase tracking-widest rounded-xl bg-gradient-to-r from-emerald-500/20 via-transparent to-amber-500/20">
                <div className="text-emerald-500 opacity-80">Complete</div>
                <div className="text-amber-500 opacity-80">Reschedule</div>
            </div>
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                animate={controls}
                className="relative z-10 w-full touch-pan-y cursor-grab active:cursor-grabbing"
            >
                {children}
            </motion.div>
        </div>
    );
}

export function MobileVerticalFeed({ appointments, tasks, clients, leads = [], deals = [] }: MobileVerticalFeedProps) {
    const { useUpdate: useUpdateTask } = useTasks();
    const { mutate: updateTask } = useUpdateTask();

    const { useUpdate: useUpdateAppointment } = useAppointments();
    const { mutate: updateAppointment } = useUpdateAppointment();

    // Calculate metrics
    const openTasksCount = tasks.filter(t => t.status !== 'completed').length;
    const activeLeadsCount = leads.length;
    const pipelineValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
    const formattedPipeline = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(pipelineValue);
    const meetingsTodayCount = appointments.filter(a => isSameDay(new Date(a.startTime), new Date())).length;

    // Combine and sort events and tasks
    const feedItems: FeedItem[] = React.useMemo(() => {
        const items: FeedItem[] = [
            ...appointments.map(a => ({ type: 'appointment' as const, data: a, timestamp: a.startTime })),
            ...tasks.map(t => ({ type: 'task' as const, data: t, timestamp: t.dueDate }))
        ];

        return items.sort((a, b) => a.timestamp - b.timestamp);
    }, [appointments, tasks]);

    // Group by day
    const groupedItems = React.useMemo(() => {
        const groups: { date: Date; items: FeedItem[] }[] = [];

        feedItems.forEach(item => {
            const date = new Date(item.timestamp);
            const existingGroup = groups.find(g => isSameDay(g.date, date));

            if (existingGroup) {
                existingGroup.items.push(item);
            } else {
                groups.push({ date, items: [item] });
            }
        });

        return groups;
    }, [feedItems]);

    const handleCompleteTask = (task: CRMTask) => {
        updateTask({ id: task.id, data: { status: 'completed' } });
    };

    const handleCompleteAppointment = (appt: Appointment) => {
        updateAppointment({ id: appt.id, data: { status: 'completed' } });
    };

    const handleRescheduleTask = (task: CRMTask) => {
        // Mock reschedule to +1 day
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        updateTask({ id: task.id, data: { dueDate: nextDay.getTime() } });
    };

    const handleRescheduleAppointment = (appt: Appointment) => {
        // Mock reschedule to +1 day
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        updateAppointment({ id: appt.id, data: { startTime: nextDay.getTime(), endTime: nextDay.getTime() + 3600000 } });
    };

    return (
        <div className="flex flex-col gap-6 pt-2 pb-10">
            {/* Metrics Dashboard Section */}
            <div className="px-4 overflow-x-auto no-scrollbar py-2">
                <div className="flex gap-4 w-max">
                    <MetricCard
                        icon={TrendingUp}
                        label="Pipeline"
                        value={formattedPipeline}
                        colorClass="text-emerald-500"
                    />
                    <MetricCard
                        icon={Zap}
                        label="Open Tasks"
                        value={openTasksCount}
                        colorClass="text-amber-500"
                    />
                    <MetricCard
                        icon={Users}
                        label="Active Leads"
                        value={activeLeadsCount}
                        colorClass="text-blue-500"
                    />
                    <MetricCard
                        icon={CalendarIcon}
                        label="Meetings"
                        value={meetingsTodayCount}
                        colorClass="text-purple-500"
                    />
                </div>
            </div>

            <div className="px-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold tracking-tight">Timeline</h2>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 bg-muted/30 px-2 py-0.5 rounded-full border border-border/20">
                        {feedItems.length} items
                    </span>
                </div>

                {groupedItems.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground bg-card/30 rounded-xl border border-border/40">
                        <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No upcoming events or tasks.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {groupedItems.map((group, i) => (
                            <div key={i} className="space-y-4">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
                                    {format(group.date, 'EEEE, MMM d')}
                                </h3>

                                <div className="space-y-4">
                                    {group.items.map((item, j) => {
                                        if (item.type === 'appointment') {
                                            const appt = item.data;
                                            const client = clients.find(c => c.id === appt.clientId);
                                            const isDone = appt.status === 'completed';

                                            return (
                                                <div key={j} className="relative pl-7 before:absolute before:left-[11px] before:top-3 before:bottom-[-20px] before:w-[1px] before:bg-border/30 last:before:hidden group">
                                                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center border-2 border-background ring-1 ring-primary/10 z-10 shadow-sm">
                                                        <CalendarIcon className="w-3 h-3 text-primary" />
                                                    </div>
                                                    <SwipeableCard
                                                        isTask={false}
                                                        onComplete={() => handleCompleteAppointment(appt)}
                                                        onReschedule={() => handleRescheduleAppointment(appt)}
                                                    >
                                                        <div className={cn(
                                                            "bg-card/70 backdrop-blur-xl rounded-2xl p-4 border shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all",
                                                            isDone ? "opacity-60 border-border/20" : "border-border/40"
                                                        )}>
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className={cn("font-bold text-sm tracking-tight", isDone ? "line-through text-muted-foreground" : "text-foreground")}>{appt.title}</h4>
                                                                <span className="text-[10px] font-bold text-muted-foreground/80 whitespace-nowrap bg-muted/30 px-2 py-0.5 rounded-full border border-border/10">
                                                                    {format(appt.startTime, 'h:mm a')}
                                                                </span>
                                                            </div>
                                                            {client && (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-1 h-3 bg-primary/40 rounded-full" />
                                                                    <p className="text-[11px] font-medium text-muted-foreground tracking-wide">{client.companyName}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </SwipeableCard>
                                                </div>
                                            );
                                        } else {
                                            const task = item.data;
                                            const client = clients.find(c => c.id === task.accountId);
                                            const isDone = task.status === 'completed';

                                            return (
                                                <div key={j} className="relative pl-7 before:absolute before:left-[11px] before:top-3 before:bottom-[-20px] before:w-[1px] before:bg-border/30 last:before:hidden group">
                                                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-background flex items-center justify-center z-10 shadow-sm">
                                                        {isDone ? (
                                                            <CheckCircle2 className="w-6 h-6 text-emerald-500 bg-background rounded-full" />
                                                        ) : (
                                                            <Circle className={cn(
                                                                "w-6 h-6 bg-background rounded-full",
                                                                task.priority === 'high' ? "text-destructive" :
                                                                    task.priority === 'medium' ? "text-warning" : "text-primary/40"
                                                            )} />
                                                        )}
                                                    </div>
                                                    <SwipeableCard
                                                        isTask={true}
                                                        onComplete={() => handleCompleteTask(task)}
                                                        onReschedule={() => handleRescheduleTask(task)}
                                                    >
                                                        <div className={cn(
                                                            "bg-card/70 backdrop-blur-xl rounded-2xl p-4 border shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all",
                                                            isDone ? "opacity-60 border-border/20" : "border-border/40"
                                                        )}>
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className={cn("font-bold text-sm tracking-tight", isDone ? "line-through text-muted-foreground" : "text-foreground")}>
                                                                    {task.title}
                                                                </h4>
                                                                {task.dueDate && (
                                                                    <span className={cn(
                                                                        "text-[10px] font-bold whitespace-nowrap px-2 py-0.5 rounded-full border border-border/10 flex items-center gap-1.5",
                                                                        task.dueDate < Date.now() && !isDone ? "text-destructive bg-destructive/5 border-destructive/20" : "text-muted-foreground/80 bg-muted/30"
                                                                    )}>
                                                                        <Clock className="w-3 h-3" />
                                                                        {format(task.dueDate, 'h:mm a')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {client && (
                                                                <div className="flex items-center gap-2">
                                                                    <div className={cn(
                                                                        "w-1 h-3 rounded-full",
                                                                        task.priority === 'high' ? "bg-destructive/40" :
                                                                            task.priority === 'medium' ? "bg-warning/40" : "bg-primary/40"
                                                                    )} />
                                                                    <p className="text-[11px] font-medium text-muted-foreground tracking-wide">{client.companyName}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </SwipeableCard>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
