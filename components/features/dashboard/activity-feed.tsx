import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { Activity as ActivityRecord, Appointment, Lead } from '@/types';
import { Phone, Mail, Calendar, FileText, CheckCircle2, MessageSquare, Plus, Activity } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
    activities?: ActivityRecord[];
    appointments?: Appointment[];
    leads?: Lead[];
    compact?: boolean;
}

type TimelineItem = {
    id: string;
    timestamp: number;
    title: string;
    subtitle?: string;
    icon: LucideIcon;
    color: string;
    isHighPriority?: boolean;
};

function generateTimeline(activities: ActivityRecord[] = [], appointments: Appointment[] = [], leads: Lead[] = []) {
    const timeline: TimelineItem[] = [];

    activities.forEach(a => {
        let icon = FileText;
        let color = 'text-blue-500 bg-blue-500/10 border-blue-500/20';

        if (a.type === 'call') { icon = Phone; color = 'text-green-500 bg-green-500/10 border-green-500/20'; }
        else if (a.type === 'email') { icon = Mail; color = 'text-purple-500 bg-purple-500/10 border-purple-500/20'; }
        else if (a.type === 'meeting') { icon = Calendar; color = 'text-orange-500 bg-orange-500/10 border-orange-500/20'; }
        else if (a.type === 'task_updated') { icon = CheckCircle2; color = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'; }
        else if (a.type === 'note') { icon = MessageSquare; color = 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'; }

        timeline.push({
            id: a.id,
            timestamp: a.timestamp,
            title: a.description,
            subtitle: a.type === 'note' ? 'Added a note' : 'Logged an activity',
            icon,
            color
        });
    });

    appointments.forEach(a => {
        if (a.startTime > Date.now()) {
            timeline.push({
                id: `app-${a.id}`,
                timestamp: a.createdAt,
                title: `Scheduled: ${a.title}`,
                subtitle: `With ${a.assignedTo}`,
                icon: Calendar,
                color: 'text-orange-500 bg-orange-500/10 border-orange-500/20'
            });
        }
    });

    leads.forEach(l => {
        timeline.push({
            id: `lead-${l.id}`,
            timestamp: l.createdAt,
            title: `New Lead: ${l.companyName}`,
            subtitle: l.contactName,
            icon: Plus,
            color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
            isHighPriority: true
        });
    });

    return timeline.sort((a, b) => b.timestamp - a.timestamp).slice(0, 15);
}

function groupTimeline(items: TimelineItem[]) {
    const groups: { [key: string]: TimelineItem[] } = {
        'Today': [],
        'Yesterday': [],
        'Earlier': []
    };

    items.forEach(item => {
        const date = new Date(item.timestamp);
        if (isToday(date)) groups['Today'].push(item);
        else if (isYesterday(date)) groups['Yesterday'].push(item);
        else groups['Earlier'].push(item);
    });

    return Object.entries(groups).filter(([, items]) => items.length > 0);
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { type: 'spring', stiffness: 300, damping: 30 } as const
    }
};

export function ActivityFeed({
    activities = [],
    appointments = [],
    leads = [],
    compact = false
}: ActivityFeedProps) {
    const timeline = generateTimeline(activities, appointments, leads);
    const groups = groupTimeline(timeline);

    if (timeline.length === 0) {
        return (
            <div className={cn(
                "flex flex-col items-center justify-center text-center gap-2",
                compact ? "p-4" : "p-8"
            )}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-1"
                >
                    <Activity className="w-5 h-5 text-muted-foreground/30" />
                </motion.div>
                <p className="text-[12px] font-medium text-foreground/70">No activity</p>
            </div>
        );
    }

    if (compact) {
        return (
            <div className="flex flex-col gap-4">
                {timeline.slice(0, 5).map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.id} className="flex gap-4 group cursor-pointer p-2 rounded-sm hover:bg-white/5 hover:glass-xs transition-all">
                            <div className={cn(
                                "w-10 h-10 rounded-sm flex shrink-0 items-center justify-center border shadow-sm transition-all duration-300",
                                item.color
                            )}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col justify-center min-w-0">
                                <p className="text-[13px] font-bold text-foreground leading-tight truncate group-hover:text-primary transition-colors font-display tracking-tight">
                                    {item.title}
                                </p>
                                <p className="text-[11px] text-muted-foreground/40 mt-1 uppercase tracking-widest font-sans font-medium italic">
                                    {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="px-4 py-2 h-full min-h-0 flex flex-col">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin"
            >
                {/* Visual Timeline Connector Line */}
                <div className="absolute left-4 top-4 bottom-4 w-[1px] bg-linear-to-b from-primary/30 via-border/40 to-transparent" />

                <div className="space-y-8 pb-4">
                    {groups.map(([label, items]) => (
                        <div key={label} className="relative">
                            {/* Date Group Header */}
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mb-4 pl-8 font-sans">
                                {label}
                            </h3>

                            <div className="space-y-4">
                                {items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.div
                                            key={item.id}
                                            variants={itemVariants}
                                            whileHover={{ x: 2 }}
                                            className="relative flex items-start group pl-8"
                                        >
                                            {/* Connector point */}
                                            <div className={cn(
                                                "absolute left-[-4px] top-2.5 w-2 h-2 rounded-full border border-background shadow-xs z-10 transition-transform duration-300 group-hover:scale-125",
                                                item.isHighPriority ? "bg-primary animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.5)]" : "bg-muted-foreground/20 group-hover:bg-primary/40"
                                            )} />

                                            <div className="w-full flex gap-3 p-3 rounded-sm transition-all duration-300 hover:bg-white/5 hover:glass-xs border border-transparent hover:border-white/10 cursor-pointer">
                                                {/* Icon Container */}
                                                <div className={cn(
                                                    "w-10 h-10 rounded-sm flex shrink-0 items-center justify-center border shadow-xs transition-all duration-300 group-hover:bg-white/10",
                                                    item.color
                                                )}>
                                                    <Icon className="w-5 h-5" />
                                                </div>

                                                {/* Text Content */}
                                                <div className="flex flex-col min-w-0 justify-center">
                                                    <p className="text-[13px] font-bold text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors font-display">
                                                        {item.title}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        {item.subtitle && (
                                                            <span className="text-[11px] text-muted-foreground/60 truncate font-semibold uppercase tracking-wider font-sans">
                                                                {item.subtitle}
                                                            </span>
                                                        )}
                                                        <span className="text-[11px] text-muted-foreground/20">•</span>
                                                        <span className="text-[10px] text-muted-foreground/40 tabular-nums font-medium font-sans italic">
                                                            {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
