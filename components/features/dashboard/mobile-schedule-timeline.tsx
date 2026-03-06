'use client';

import { Appointment, CRMTask } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Clock, Briefcase, Calendar } from 'lucide-react';

interface MobileScheduleTimelineProps {
    appointments: Appointment[] | undefined;
    tasks: CRMTask[] | undefined;
}

export function MobileScheduleTimeline({ appointments, tasks }: MobileScheduleTimelineProps) {
    // Combine and sort today's items
    const today = new Date();
    const todayItems = [
        ...(appointments?.filter(a => new Date(a.startTime).toDateString() === today.toDateString()) || []).map(a => ({
            id: a.id,
            time: new Date(a.startTime),
            title: a.title,
            subtitle: a.description || 'Discovery Call',
            type: 'appointment' as const,
        })),
        ...(tasks?.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === today.toDateString()) || []).map(t => ({
            id: t.id,
            time: t.dueDate ? new Date(t.dueDate) : today,
            title: t.title,
            subtitle: t.priority.toUpperCase() + ' Priority',
            type: 'task' as const,
        }))
    ].sort((a, b) => a.time.getTime() - b.time.getTime());

    if (todayItems.length === 0) {
        return (
            <div className="py-8 flex flex-col items-center gap-2 text-center opacity-40">
                <Calendar className="w-8 h-8" />
                <p className="text-sm font-medium">Clear schedule for today</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {todayItems.map((item, i) => (
                <div
                    key={`${item.type}-${item.id}`}
                    className="p-4 rounded-2xl bg-card border border-border/40 flex gap-4 relative overflow-hidden group active:scale-[0.98] transition-all"
                >
                    {/* Time Column */}
                    <div className="w-12 flex flex-col items-center shrink-0 border-r border-border/40 pr-4">
                        <span className="text-xs font-bold text-foreground">
                            {format(item.time, 'HH:mm')}
                        </span>
                        <span className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter">
                            {format(item.time, 'aa')}
                        </span>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 py-0.5">
                        <div className="flex items-center gap-2 mb-0.5">
                            {item.type === 'appointment' ? (
                                <Briefcase className="w-3 h-3 text-primary" />
                            ) : (
                                <Clock className="w-3 h-3 text-amber-500" />
                            )}
                            <p className="text-[13px] font-bold text-foreground leading-tight tracking-tight">
                                {item.title}
                            </p>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-tight">
                            {item.subtitle}
                        </p>
                    </div>

                    {/* Status Indicator Bar */}
                    <div className={cn(
                        "absolute right-0 top-0 bottom-0 w-1",
                        item.type === 'appointment' ? "bg-primary/40" : "bg-amber-500/40"
                    )} />
                </div>
            ))}
        </div>
    );
}
