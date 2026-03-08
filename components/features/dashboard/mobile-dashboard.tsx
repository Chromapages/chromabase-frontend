'use client';

import { useState } from 'react';
import { Lead, CRMTask, Activity, Deal, Appointment, Client } from '@/types';
import { MobileFAB } from './mobile-fab';
import { MobileQuickSheet } from './mobile-quick-sheet';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { format, formatDistanceToNow, isToday } from 'date-fns';
import Link from 'next/link';
import {
    Users, DollarSign,
    Bell, Briefcase, CheckSquare, FileText,
    Clock, ChevronRight, CalendarDays,
    TrendingUp, UserCheck, CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
interface MobileDashboardProps {
    leads: Lead[] | undefined;
    clients: Client[] | undefined;
    deals: Deal[] | undefined;
    tasks: CRMTask[] | undefined;
    activities: Activity[] | undefined;
    appointments: Appointment[] | undefined;
}

const ACTIVITY_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
    lead: { icon: Users, color: 'bg-blue-500/15 text-blue-400' },
    deal: { icon: Briefcase, color: 'bg-emerald-500/15 text-emerald-400' },
    task: { icon: CheckSquare, color: 'bg-amber-500/15 text-amber-400' },
    appointment: { icon: CalendarDays, color: 'bg-indigo-500/15 text-indigo-400' },
    note: { icon: FileText, color: 'bg-purple-500/15 text-purple-400' },
};

const SCHEDULE_DOT_COLORS = ['bg-blue-400', 'bg-violet-400', 'bg-emerald-400', 'bg-amber-400', 'bg-rose-400'];

export function MobileDashboard({
    leads, clients, deals, tasks, activities, appointments
}: MobileDashboardProps) {
    const [isQuickSheetOpen, setIsQuickSheetOpen] = useState(false);
    const { user } = useAuth();

    // --- Data Computations ---
    const totalValue = deals?.reduce((sum, d) => sum + d.value, 0) || 0;
    const activeLeadsCount = leads?.length || 0;
    const dealsWonCount = deals?.filter(d => d.stage === 'closed_won').length || 0;
    const tasksDueCount = tasks?.filter(t => t.status !== 'completed').length || 0;
    const appointmentsToday = appointments?.filter(a =>
        isToday(new Date(a.startTime))
    ) || [];
    const meetingsTodayCount = appointmentsToday.length;
    const nextMeeting = appointmentsToday[0];


    return (
        <div className="fixed inset-0 bg-background z-[45] overflow-hidden flex flex-col pt-14">
            {/* ── Scrollable Content ── */}
            <div className="flex-1 overflow-y-auto scrollbar-none pb-32">
                {/* ── HERO BADGES (Pipeline Value + Next Meeting) ── */}
                <div className="flex gap-2.5 px-5 pb-6">
                    <Link
                        href="/deals"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent/30 border border-border/40 flex-1 active:scale-[0.97] transition-transform cursor-pointer"
                    >
                        <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center shrink-0">
                            <DollarSign className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest leading-none mb-0.5">Pipeline value</p>
                            <p className="text-sm font-bold text-foreground tracking-tight">
                                ${totalValue >= 1_000_000
                                    ? `${(totalValue / 1_000_000).toFixed(1)}M`
                                    : totalValue >= 1_000
                                        ? `${(totalValue / 1_000).toFixed(0)}K`
                                        : totalValue.toFixed(0)}
                            </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 ml-auto" />
                    </Link>
                    <Link
                        href="/tasks"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent/30 border border-border/40 flex-1 active:scale-[0.97] transition-transform cursor-pointer"
                    >
                        <div className="w-6 h-6 rounded-md bg-violet-500/20 flex items-center justify-center shrink-0">
                            <Clock className="w-3.5 h-3.5 text-violet-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest leading-none mb-0.5">Next Meeting</p>
                            <p className="text-sm font-bold text-foreground tracking-tight">
                                {nextMeeting
                                    ? format(new Date(nextMeeting.startTime), 'h:mm aa')
                                    : 'None today'}
                            </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 ml-auto" />
                    </Link>
                </div>

                {/* ── MAIN CONTENT SURFACE ── */}
                <div className="bg-card/40 backdrop-blur-xl rounded-t-[28px] flex flex-col gap-0 border-t border-border/40 min-h-full shadow-2xl shadow-black/5">

                    {/* ── KPI SECTION ── */}
                    <div className="px-5 pt-7 pb-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold text-foreground tracking-tight">KPI</h2>
                            <Link href="/leads" className="flex items-center gap-0.5 text-[12px] text-primary font-semibold active:opacity-70 cursor-pointer">
                                See all <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-3 gap-2.5">
                            {[
                                { label: 'New Leads', value: activeLeadsCount, href: '/leads', colorTop: 'from-blue-500/10', dot: 'bg-blue-500' },
                                { label: 'Deals Won', value: dealsWonCount, href: '/deals', colorTop: 'from-emerald-500/10', dot: 'bg-emerald-500' },
                                { label: 'Tasks Due', value: tasksDueCount, href: '/tasks', colorTop: 'from-amber-500/10', dot: 'bg-amber-500' },
                            ].map((kpi, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                >
                                    <Link
                                        href={kpi.href}
                                        className={cn(
                                            "flex flex-col gap-2 p-3.5 rounded-2xl border border-border/40",
                                            "bg-gradient-to-b", kpi.colorTop, "to-transparent",
                                            "bg-card active:scale-95 transition-all cursor-pointer"
                                        )}
                                    >
                                        <p className="text-[10px] text-muted-foreground font-semibold leading-none">{kpi.label}</p>
                                        <div className="flex items-end justify-between">
                                            <span className="text-2xl font-bold text-foreground tracking-tighter leading-none">{kpi.value}</span>
                                            <div className={cn('w-2 h-2 rounded-full mb-0.5', kpi.dot)} />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* ── DIVIDER ── */}
                    <div className="h-px bg-border/40 mx-5" />

                    {/* ── QUICK ACTIONS ── */}
                    <div className="px-5 py-5">
                        <h2 className="text-sm font-bold text-foreground tracking-tight mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'New Lead', icon: Users, color: 'bg-blue-500', onClick: () => setIsQuickSheetOpen(true) },
                                { label: 'New Deal', icon: Briefcase, color: 'bg-emerald-500', onClick: () => setIsQuickSheetOpen(true) },
                                { label: 'New Task', icon: CheckSquare, color: 'bg-amber-500', onClick: () => setIsQuickSheetOpen(true) },
                                { label: 'Add Note', icon: FileText, color: 'bg-violet-500', onClick: () => setIsQuickSheetOpen(true) },
                            ].map((action, i) => (
                                <button
                                    key={i}
                                    onClick={action.onClick}
                                    className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/40 active:scale-[0.96] transition-all cursor-pointer text-left shadow-sm"
                                >
                                    <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0', action.color)}>
                                        <action.icon className="w-4.5 h-4.5" />
                                    </div>
                                    <span className="text-[13px] font-semibold text-foreground/90">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── DIVIDER ── */}
                    <div className="h-px bg-border/40 mx-5" />

                    {/* ── TODAY'S SCHEDULE ── */}
                    <div className="px-5 py-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold text-foreground tracking-tight">Today's Schedule</h2>
                            <Link href="/tasks" className="flex items-center gap-0.5 text-[12px] text-primary font-semibold active:opacity-70 cursor-pointer">
                                All <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {appointmentsToday.length === 0 ? (
                            <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground/30">
                                <CalendarDays className="w-4 h-4" />
                                <p className="text-[13px]">No meetings scheduled today</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {appointmentsToday.slice(0, 4).map((appt, i) => {
                                    const start = new Date(appt.startTime);
                                    const end = new Date(appt.endTime);
                                    const durationMin = Math.round((end.getTime() - start.getTime()) / 60000);
                                    return (
                                        <div key={appt.id} className="flex items-start gap-3">
                                            {/* Time */}
                                            <div className="w-12 shrink-0 pt-0.5 text-right">
                                                <p className="text-[11px] font-semibold text-muted-foreground leading-none">{format(start, 'h aa')}</p>
                                            </div>
                                            {/* Dot + Line */}
                                            <div className="flex flex-col items-center gap-1 mt-1">
                                                <div className={cn('w-2.5 h-2.5 rounded-full ring-2 ring-background', SCHEDULE_DOT_COLORS[i % SCHEDULE_DOT_COLORS.length])} />
                                                {i < appointmentsToday.slice(0, 4).length - 1 && (
                                                    <div className="w-px flex-1 bg-border/40 h-4" />
                                                )}
                                            </div>
                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13px] font-semibold text-foreground truncate">{appt.title}</p>
                                                <p className="text-[11px] text-muted-foreground mt-0.5">{durationMin} min</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* ── DIVIDER ── */}
                    <div className="h-px bg-border/40 mx-5" />

                    {/* ── RECENT ACTIVITY ── */}
                    <div className="px-5 py-5 pb-8">
                        <h2 className="text-sm font-bold text-foreground tracking-tight mb-4">Recent Activity</h2>

                        {!activities || activities.length === 0 ? (
                            <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground/30">
                                <TrendingUp className="w-4 h-4" />
                                <p className="text-[13px]">No recent activity</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1.5">
                                {activities.slice(0, 5).map((activity, i) => {
                                    const config = ACTIVITY_ICONS[activity.type] || ACTIVITY_ICONS.note;
                                    const Icon = config.icon;
                                    return (
                                        <motion.div
                                            key={activity.id}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.04 }}
                                            className="flex items-center gap-3 px-3 py-3 rounded-xl bg-card border border-border/40 shadow-sm"
                                        >
                                            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', config.color)}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13px] font-medium text-foreground truncate">{activity.description}</p>
                                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Persistent Controls ── */}
            <MobileFAB onClick={() => setIsQuickSheetOpen(true)} />
            <MobileQuickSheet
                isOpen={isQuickSheetOpen}
                onClose={() => setIsQuickSheetOpen(false)}
            />
        </div>
    );
}
