import { formatDistanceToNow, isToday, isYesterday, startOfDay } from 'date-fns';
import { Activity as ActivityRecord, Appointment, Lead } from '@/types';
import { User, Phone, Mail, Calendar, FileText, CheckCircle2, MessageSquare, Plus, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
    activities?: ActivityRecord[];
    appointments?: Appointment[];
    leads?: Lead[];
}

type TimelineItem = {
    id: string;
    timestamp: number;
    title: string;
    subtitle?: string;
    icon: any;
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

    return Object.entries(groups).filter(([_, items]) => items.length > 0);
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

export function ActivityFeed({ activities = [], appointments = [], leads = [] }: ActivityFeedProps) {
    const timeline = generateTimeline(activities, appointments, leads);
    const groups = groupTimeline(timeline);

    if (timeline.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center gap-2">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2"
                >
                    <Activity className="w-6 h-6 text-muted-foreground/30" />
                </motion.div>
                <p className="text-[13px] font-medium text-foreground/70">No recent activity</p>
                <p className="text-[11px] text-muted-foreground/60 max-w-[150px]">
                    Activities, leads, and events will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="px-4 py-2 h-full overflow-hidden flex flex-col">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative flex-1"
            >
                {/* Visual Timeline Connector Line */}
                <div className="absolute left-4 top-4 bottom-4 w-[1px] bg-linear-to-b from-primary/30 via-border/40 to-transparent" />

                <div className="space-y-8 pb-4">
                    {groups.map(([label, items]) => (
                        <div key={label} className="relative">
                            {/* Date Group Header */}
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-4 pl-8 bg-background/50 backdrop-blur-xs sticky top-0 py-1 z-10">
                                {label}
                            </h3>

                            <div className="space-y-4">
                                {items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.div
                                            key={item.id}
                                            variants={itemVariants}
                                            whileHover={{ x: 4 }}
                                            className="relative flex items-start group pl-8"
                                        >
                                            {/* Connector point */}
                                            <div className={cn(
                                                "absolute left-[-4.5px] top-2 w-[10px] h-[10px] rounded-full border-2 border-background shadow-xs ring-1 ring-border/20 z-10 transition-transform duration-300 group-hover:scale-125",
                                                item.isHighPriority ? "bg-primary animate-pulse" : "bg-muted-foreground/40 group-hover:bg-primary/60"
                                            )} />

                                            <div className="w-full flex gap-3 p-2 rounded-xl transition-all duration-300 hover:bg-muted/50 hover:glass-sm cursor-pointer">
                                                {/* Icon Container */}
                                                <div className={cn(
                                                    "w-9 h-9 rounded-xl flex shrink-0 items-center justify-center border shadow-xs transition-transform duration-300 group-hover:rotate-6",
                                                    item.color
                                                )}>
                                                    <Icon className="w-4.5 h-4.5" />
                                                </div>

                                                {/* Text Content */}
                                                <div className="flex flex-col min-w-0 justify-center">
                                                    <p className="text-[13px] font-semibold text-foreground leading-none group-hover:text-primary transition-colors">
                                                        {item.title}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 mt-1.5">
                                                        {item.subtitle && (
                                                            <span className="text-[11px] text-muted-foreground/80 truncate font-medium">
                                                                {item.subtitle}
                                                            </span>
                                                        )}
                                                        <span className="text-[11px] text-muted-foreground/30">•</span>
                                                        <span className="text-[10px] text-muted-foreground/60 tabular-nums">
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

