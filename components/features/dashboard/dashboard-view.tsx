'use client';

import { CardGridSkeleton } from '@/components/shared/loading-skeleton';
import { format, formatDistanceToNow } from 'date-fns';
import { Phone, Mail, User as UserIcon, ExternalLink, CheckCircle2, Building2, Briefcase, CalendarDays, CheckSquare } from 'lucide-react';
import { Lead, Client, Activity, Deal, CRMTask, Appointment } from '@/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CalendarView } from '@/components/features/calendar/calendar-view';
import { MobileVerticalFeed } from '@/components/features/dashboard/mobile-vertical-feed';

interface DashboardViewProps {
    leads: Lead[] | undefined;
    clients: Client[] | undefined;
    deals: Deal[] | undefined;
    tasks: CRMTask[] | undefined;
    activities: Activity[] | undefined;
    appointments: Appointment[] | undefined;
    isLoading: boolean;
    error?: Error | null;
}

export function DashboardView({ leads, clients, deals, tasks, activities, appointments, isLoading, error }: DashboardViewProps) {
    if (isLoading) {
        return <CardGridSkeleton count={3} />;
    }

    if (error) {
        return (
            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg text-destructive text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                Error loading data: {error.message}
            </div>
        );
    }

    const priorityTasks = tasks?.filter(t => t.status !== 'completed')
        .sort((a, b) => {
            if (a.priority === 'high' && b.priority !== 'high') return -1;
            if (b.priority === 'high' && a.priority !== 'high') return 1;
            return (a.dueDate || 0) - (b.dueDate || 0);
        }).slice(0, 10) || [];

    const recentAccounts = clients?.sort((a, b) => b.createdAt - a.createdAt).slice(0, 8) || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px] pt-2">

            {/* LEFT PANEL: Active Clients & Activity */}
            <div className="lg:col-span-3 flex flex-col bg-card/60 backdrop-blur-2xl border border-border/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="px-6 py-5 border-b border-border/30 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        <h3 className="text-sm font-semibold tracking-wide text-foreground">Accounts</h3>
                    </div>
                </div>

                <div className="flex flex-col gap-1 p-3 overflow-y-auto custom-scrollbar flex-1 z-10">
                    {recentAccounts.map(client => {
                        const clientTasks = tasks?.filter(t => t.accountId === client.id && t.status !== 'completed').length || 0;
                        return (
                            <Link href={`/clients/${client.id}`} key={client.id} className="px-4 py-3 rounded-2xl hover:bg-muted/50 transition-colors flex items-center justify-between group block">
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{client.companyName}</p>
                                    <div className="flex flex-col gap-1 mt-1">
                                        <p className="text-[10px] text-muted-foreground truncate">{client.industry || 'General'}</p>
                                        <div className="flex items-center gap-2">
                                            {client.tier === 'Gold' && <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-yellow-500/20 text-yellow-600 font-bold uppercase">Gold Tier</span>}
                                            {clientTasks > 0 && <span className="text-[9px] font-medium text-muted-foreground">{clientTasks} open tasks</span>}
                                        </div>
                                    </div>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* CENTER PANEL: Interactive Calendar & Mobile Feed */}
            <div className="lg:col-span-6 flex flex-col bg-card/60 backdrop-blur-2xl border border-border/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative p-4 lg:p-6">
                <div className="absolute top-0 left-0 -ml-20 -mt-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none opacity-50" />

                <div className="flex items-center gap-2 mb-6 z-10 px-2 lg:px-0">
                    <CalendarDays className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-semibold tracking-wide text-foreground">
                        <span className="hidden lg:inline">Unified Calendar</span>
                        <span className="inline lg:hidden">Your Feed</span>
                    </h3>
                </div>

                <div className="flex-1 min-h-0 z-10 overflow-y-auto lg:overflow-hidden custom-scrollbar">
                    <div className="hidden lg:block h-full">
                        <CalendarView tasks={tasks} appointments={appointments} isLoading={false} />
                    </div>
                    <div className="block lg:hidden">
                        <MobileVerticalFeed
                            appointments={appointments || []}
                            tasks={tasks || []}
                            clients={clients || []}
                            leads={leads || []}
                            deals={deals || []}
                        />
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Priority Task List */}
            <div className="lg:col-span-3 flex flex-col bg-card/60 backdrop-blur-2xl border border-border/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">

                <div className="px-6 py-5 border-b border-border/30 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                        <CheckSquare className="w-5 h-5 text-primary" />
                        <h3 className="text-sm font-semibold tracking-wide text-foreground">Priority Tasks</h3>
                    </div>
                </div>

                <div className="flex flex-col gap-1 p-3 overflow-y-auto custom-scrollbar flex-1 z-10">
                    {priorityTasks.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-xs italic">All caught up</div>
                    ) : (
                        priorityTasks.map(task => (
                            <div key={task.id} className="px-4 py-3 rounded-2xl hover:bg-muted/50 transition-colors flex items-start gap-4 group cursor-pointer relative">
                                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full border border-border/60 hover:bg-success hover:border-success shrink-0 mt-0.5 group-hover:bg-muted opacity-80 group-hover:opacity-100">
                                    <CheckCircle2 className="h-4 w-4 text-transparent group-hover:text-success/80 transition-colors" />
                                </Button>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{task.title}</p>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-1.5">
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                task.priority === 'high' ? "bg-destructive/60" :
                                                    task.priority === 'medium' ? "bg-warning/60" : "bg-primary/60"
                                            )} />
                                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{task.priority}</span>
                                        </div>
                                        {task.dueDate && (
                                            <span className={cn(
                                                "text-[10px] font-medium",
                                                task.dueDate < Date.now() ? "text-destructive" : "text-muted-foreground"
                                            )}>
                                                {formatDistanceToNow(task.dueDate, { addSuffix: true })}
                                            </span>
                                        )}
                                    </div>

                                    {task.accountId && clients?.some(c => c.id === task.accountId) && (
                                        <p className="text-[10px] text-muted-foreground/60 mt-1 truncate">
                                            {clients.find(c => c.id === task.accountId)?.companyName}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
}
