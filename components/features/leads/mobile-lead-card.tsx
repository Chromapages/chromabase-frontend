'use client';

import { Lead } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Calendar, MoreVertical } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';

interface MobileLeadCardProps {
    lead: Lead;
}

const statusColors: Record<string, string> = {
    new: 'border-l-blue-500',
    contacted: 'border-l-amber-500',
    meeting_scheduled: 'border-l-indigo-500',
    proposal_sent: 'border-l-purple-500',
    won: 'border-l-emerald-500',
    lost: 'border-l-rose-500',
};

const statusBadgeStyles: Record<string, string> = {
    new: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    contacted: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    meeting_scheduled: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    proposal_sent: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    won: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    lost: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
};

const statusLabel: Record<string, string> = {
    new: 'New',
    contacted: 'Contacted',
    meeting_scheduled: 'Meeting',
    proposal_sent: 'Proposal',
    won: 'Won',
    lost: 'Lost',
};

export function MobileLeadCard({ lead }: MobileLeadCardProps) {
    const router = useRouter();
    const x = useMotionValue(0);

    // Swipe left (negative x) to reveal actions on the right
    const actionOpacity = useTransform(x, [-60, -20, 0], [1, 0.5, 0]);
    const actionScale = useTransform(x, [-60, -20, 0], [1, 0.8, 0.5]);

    return (
        <div className="relative overflow-hidden mb-3 group">
            {/* Quick Actions (Reveal on swipe) */}
            <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-4 z-0">
                <motion.div style={{ opacity: actionOpacity, scale: actionScale }}>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-lg"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `mailto:${lead.contactEmail}`;
                        }}
                    >
                        <Mail className="h-4.5 w-4.5" />
                    </Button>
                </motion.div>
                <motion.div style={{ opacity: actionOpacity, scale: actionScale }}>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-lg"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`${ROUTES.CALENDAR}?leadId=${lead.id}`);
                        }}
                    >
                        <Calendar className="h-4.5 w-4.5" />
                    </Button>
                </motion.div>
            </div>

            <motion.div
                drag="x"
                dragConstraints={{ left: -120, right: 0 }}
                dragElastic={0.1}
                style={{ x }}
                className={cn(
                    "relative z-10 bg-card/85 backdrop-blur-md border border-border/40 rounded-2xl p-4 shadow-sm active:shadow-md transition-shadow cursor-pointer border-l-4",
                    statusColors[lead.status] || 'border-l-muted-foreground/30'
                )}
                onClick={() => router.push(`${ROUTES.LEADS}/${lead.id}`)}
            >
                <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col min-w-0 pr-4">
                            <span className="text-[15px] font-bold text-foreground leading-tight truncate">
                                {lead.companyName}
                            </span>
                            <span className="text-[12px] text-muted-foreground font-medium mt-0.5">
                                {lead.contactName}
                            </span>
                        </div>
                        <span className={cn(
                            'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap',
                            statusBadgeStyles[lead.status] || 'bg-muted text-muted-foreground'
                        )}>
                            {statusLabel[lead.status] || lead.status}
                        </span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                        <span className="text-[16px] font-bold text-foreground tabular-nums">
                            ${lead.value.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <span className="opacity-60 italic">Updated</span>
                            <span className="font-medium">
                                {formatDistanceToNow(lead.updatedAt, { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
