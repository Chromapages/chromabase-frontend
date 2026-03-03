'use client';

import { StatsCard } from '@/components/shared/stats-card';
import { CardGridSkeleton } from '@/components/shared/loading-skeleton';
import { formatDistanceToNow, format } from 'date-fns';
import { Phone, Mail, User as UserIcon, Plus, ExternalLink, CheckCircle2, Clock } from 'lucide-react';
import { Lead, Client, Activity, Deal, CRMTask } from '@/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DashboardViewProps {
    leads: Lead[] | undefined;
    clients: Client[] | undefined;
    deals: Deal[] | undefined;
    tasks: CRMTask[] | undefined;
    activities: Activity[] | undefined;
    isLoading: boolean;
    error?: Error | null;
}

export function DashboardView({ leads, clients, deals, tasks, activities, isLoading, error }: DashboardViewProps) {
    if (isLoading) {
        return <CardGridSkeleton count={4} />;
    }

    if (error) {
        return (
            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg text-destructive text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                Error loading data: {error.message}
            </div>
        );
    }

    const activeLeadsCount = leads?.filter(l => l.status !== 'won' && l.status !== 'lost').length || 0;
    const totalAccounts = clients?.length || 0;
    const openTasksCount = tasks?.filter(t => t.status !== 'completed').length || 0;
    const wonDealsCount = deals?.filter(d => d.stage === 'closed_won').length || 0;

    const pipelineValue = leads?.filter(l => l.status !== 'won' && l.status !== 'lost')
        .reduce((sum, lead) => sum + (lead.value || 0), 0) || 0;

    const recentLeads = leads?.sort((a, b) => b.createdAt - a.createdAt).slice(0, 6) || [];
    const recentActivities = activities?.sort((a, b) => b.timestamp - a.timestamp).slice(0, 6) || [];
    const upcomingTasks = tasks?.filter(t => t.status !== 'completed')
        .sort((a, b) => (a.dueDate || 0) - (b.dueDate || 0)).slice(0, 6) || [];

    return (
        <div className="space-y-4 pt-1">

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatsCard title="Active Leads" value={activeLeadsCount} trend={{ value: 12, isPositive: true }} />
                <StatsCard title="Accounts" value={totalAccounts} />
                <StatsCard title="Pipeline" value={`$${(pipelineValue / 1000).toFixed(1)}k`} trend={{ value: 5, isPositive: true }} />
                <StatsCard title="Open Tasks" value={openTasksCount} trend={{ value: 10, isPositive: false }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Recent Leads */}
                <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-xl overflow-hidden flex flex-col h-[320px]">
                    <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between bg-muted/10">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recent Leads</h3>
                        <Link href="/leads" className="text-[10px] text-primary hover:underline font-bold">View All</Link>
                    </div>
                    <div className="divide-y divide-border/20 overflow-y-auto custom-scrollbar">
                        {recentLeads.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-xs italic">No recent leads</div>
                        ) : (
                            recentLeads.map(lead => (
                                <div key={lead.id} className="px-4 py-2.5 hover:bg-primary/5 transition-colors flex items-center justify-between group cursor-default relative">
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-foreground truncate">{lead.companyName}</p>
                                        <p className="text-[10px] text-muted-foreground truncate">{lead.contactName}</p>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 bg-background/95 backdrop-blur-sm p-1 rounded-md border border-border/40 shadow-sm">
                                        <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                                            <Link href={`/leads/${lead.id}`}>
                                                <ExternalLink className="h-3 w-3" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                            <Mail className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    <div className="text-right shrink-0 ml-2 group-hover:opacity-0 transition-opacity">
                                        <p className="text-xs font-bold text-primary">${(lead.value / 1000).toFixed(1)}k</p>
                                        <span className="text-[9px] font-medium text-muted-foreground/70 uppercase">
                                            {lead.status.split('_')[0]}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Upcoming Tasks */}
                <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-xl overflow-hidden flex flex-col h-[320px]">
                    <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between bg-muted/10">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Priority Tasks</h3>
                        <Link href="/tasks" className="text-[10px] text-primary hover:underline font-bold">Manage</Link>
                    </div>
                    <div className="divide-y divide-border/20 overflow-y-auto custom-scrollbar">
                        {upcomingTasks.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-xs italic">All caught up</div>
                        ) : (
                            upcomingTasks.map(task => (
                                <div key={task.id} className="px-4 py-2.5 hover:bg-primary/5 transition-colors flex items-center gap-3 group cursor-default relative">
                                    <div className={cn(
                                        "w-1 h-8 rounded-full shrink-0",
                                        task.priority === 'high' ? "bg-destructive/60" :
                                            task.priority === 'medium' ? "bg-warning/60" : "bg-primary/60"
                                    )} />
                                    <div className="min-w-0 flex-1 group-hover:opacity-20 transition-opacity">
                                        <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{task.title}</p>
                                        <p className="text-[10px] text-muted-foreground truncate">
                                            {task.dueDate ? format(task.dueDate, 'MMM d, h:mm a') : 'No due date'}
                                        </p>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 bg-background/95 backdrop-blur-sm p-1 rounded-md border border-border/40 shadow-sm">
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-success hover:text-success hover:bg-success/10">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                                            <Link href={`/tasks/${task.id}`}>
                                                <ExternalLink className="h-3 w-3" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-xl overflow-hidden flex flex-col h-[320px]">
                    <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between bg-muted/10">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Activity</h3>
                    </div>
                    <div className="divide-y divide-border/20 overflow-y-auto custom-scrollbar">
                        {recentActivities.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-xs italic">Quiet day so far</div>
                        ) : (
                            recentActivities.map(activity => {
                                const Icon = activity.type === 'call' ? Phone : activity.type === 'email' ? Mail : UserIcon;
                                const entityPath = activity.relatedTo ?
                                    (activity.relatedTo.type === 'lead' ? `/leads/${activity.relatedTo.id}` :
                                        activity.relatedTo.type === 'client' ? `/clients/${activity.relatedTo.id}` :
                                            activity.relatedTo.type === 'task' ? `/tasks/${activity.relatedTo.id}` :
                                                activity.relatedTo.type === 'deal' ? `/deals/${activity.relatedTo.id}` : '#') : '#';

                                return (
                                    <div key={activity.id} className="px-4 py-3 flex gap-3 hover:bg-primary/5 transition-colors group cursor-default relative">
                                        <div className="bg-muted/40 p-1.5 rounded-lg shrink-0 h-fit group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <Icon className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[13px] font-medium text-foreground leading-tight group-hover:text-primary transition-colors">{activity.description}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1">
                                                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                            </p>
                                        </div>

                                        {/* Quick Action */}
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center bg-background/95 backdrop-blur-sm p-1 rounded-md border border-border/40 shadow-sm">
                                            <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                                                <Link href={entityPath}>
                                                    <ExternalLink className="h-3 w-3" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
