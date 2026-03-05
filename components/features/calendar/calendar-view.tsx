'use client';

import { useState } from 'react';
import {
    ChevronLeft, ChevronRight,
    Clock, CalendarDays
} from 'lucide-react';
import {
    addDays,
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek,
    subMonths,
} from 'date-fns';
import { CalendarSkeleton } from '@/components/shared/loading-skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CRMTask, Appointment } from '@/types';
import { formatEventTime } from '@/lib/format-event-time';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
    tasks: CRMTask[] | undefined;
    appointments: Appointment[] | undefined;
    isLoading: boolean;
}

export function CalendarView({ tasks, appointments, isLoading }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'month' | 'week'>('month');
    const MAX_VISIBLE = 2;

    const handlePrev = () => setCurrentDate(v => view === 'month' ? subMonths(v, 1) : addDays(v, -7));
    const handleNext = () => setCurrentDate(v => view === 'month' ? addMonths(v, 1) : addDays(v, 7));
    const handleToday = () => setCurrentDate(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = view === 'month' ? startOfWeek(monthStart) : startOfWeek(currentDate);
    const endDate = view === 'month' ? endOfWeek(monthEnd) : endOfWeek(currentDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
        <div className="flex flex-col h-full gap-4 p-5">

            {/* ── Header Toolbar ────────────────────────────────── */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0 shadow-inner">
                        <CalendarDays className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground tabular-nums min-w-[180px]">
                        {format(currentDate, view === 'month' ? 'MMMM yyyy' : "'Week of' MMM d")}
                    </h2>

                    <div className="flex items-center bg-muted/30 backdrop-blur-md rounded-xl p-1 border border-border/40 shadow-sm">
                        <button
                            onClick={handlePrev}
                            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-background/90 text-muted-foreground hover:text-foreground transition-all duration-200"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleToday}
                            className="px-4 h-8 rounded-lg text-[12px] font-bold tracking-tight text-primary hover:bg-primary/5 transition-all duration-200"
                        >
                            Today
                        </button>
                        <button
                            onClick={handleNext}
                            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-background/90 text-muted-foreground hover:text-foreground transition-all duration-200"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex bg-muted/30 p-1 rounded-xl border border-border/40 backdrop-blur-md shadow-sm">
                    {(['month', 'week'] as const).map(v => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={cn(
                                'px-4 py-1.5 text-[12px] font-semibold rounded-lg capitalize transition-all duration-200',
                                view === v
                                    ? 'bg-background shadow-md text-foreground'
                                    : 'text-muted-foreground hover:text-foreground',
                            )}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Calendar Grid ─────────────────────────────────── */}
            <div className="flex-1 min-h-[450px] rounded-2xl overflow-hidden border border-border/40 bg-card/40 backdrop-blur-xl flex flex-col shadow-2xl shadow-primary/5">
                {isLoading ? (
                    <CalendarSkeleton weeks={view === 'month' ? 6 : 1} />
                ) : (
                    <TooltipProvider delayDuration={200}>
                        {/* Day Labels */}
                        <div className="grid grid-cols-7 border-b border-border/10 bg-muted/5">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="py-3 text-center text-[10px] font-bold tracking-widest uppercase text-muted-foreground/40">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Grid Body */}
                        <div className={cn(
                            'flex-1 grid grid-cols-7',
                            view === 'month' ? 'grid-rows-6' : 'grid-rows-1',
                        )}>
                            {days.map((day) => {
                                const dayTasks = tasks?.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day)) || [];
                                const dayAppointments = (appointments ?? [])
                                    .filter(a => isSameDay(new Date(a.startTime), day))
                                    .sort((a, b) => a.startTime - b.startTime);

                                const isCurrentMonth = isSameMonth(day, monthStart);
                                const todayDay = isToday(day);

                                const allItems = [
                                    ...dayAppointments.map(app => ({ kind: 'appointment' as const, key: `a-${app.id}`, ts: app.startTime, app })),
                                    ...dayTasks.map(task => ({ kind: 'task' as const, key: `t-${task.id}`, ts: task.dueDate, task })),
                                ].sort((a, b) => a.ts - b.ts);

                                const visible = allItems.slice(0, MAX_VISIBLE);
                                const overflowCount = Math.max(0, allItems.length - MAX_VISIBLE);

                                return (
                                    <div
                                        key={day.toString()}
                                        className={cn(
                                            'border-r border-b border-border/10 last:border-r-0',
                                            'flex flex-col gap-1 p-1.5 transition-all duration-300 group',
                                            !isCurrentMonth && 'bg-muted/5 opacity-40',
                                            todayDay && 'bg-primary/[0.03]',
                                            'hover:bg-muted/20'
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className={cn(
                                                'w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold tabular-nums transition-all duration-300',
                                                todayDay
                                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110'
                                                    : 'text-foreground/80 group-hover:text-primary group-hover:scale-105'
                                            )}>
                                                {format(day, 'd')}
                                            </span>
                                            {allItems.length > 0 && isCurrentMonth && !todayDay && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/20 animate-pulse" />
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-0.5 overflow-hidden">
                                            {visible.map((item) => {
                                                if (item.kind === 'appointment') {
                                                    const { app } = item;
                                                    const isCompleted = app.status === 'completed';
                                                    const compactTime = formatEventTime(app.startTime).replace(' ', '');
                                                    return (
                                                        <Tooltip key={item.key}>
                                                            <TooltipTrigger asChild>
                                                                <div className={cn(
                                                                    'flex items-center gap-1 px-1.5 py-0.5 rounded-md border-l-2 text-[10px] font-medium leading-tight transition-all duration-200 cursor-pointer backdrop-blur-sm',
                                                                    isCompleted
                                                                        ? 'bg-muted/30 border-l-muted-foreground/30 text-muted-foreground/60'
                                                                        : 'bg-violet-500/10 border-l-violet-500 text-violet-700 dark:text-violet-300 hover:bg-violet-500/20'
                                                                )}>
                                                                    <span className="w-1 h-1 rounded-full bg-current/70 shrink-0" />
                                                                    <span className="tabular-nums opacity-70 text-[9px]">{compactTime}</span>
                                                                    <span className="truncate">{app.title}</span>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top" className="p-0 border-none bg-transparent shadow-none">
                                                                <div className="p-4 rounded-2xl bg-card border border-border/50 shadow-2xl backdrop-blur-2xl max-w-[260px] animate-in zoom-in-95">
                                                                    <div className="space-y-3">
                                                                        <div className="flex items-start justify-between gap-4">
                                                                            <h4 className="font-bold text-sm leading-tight text-foreground">{app.title}</h4>
                                                                            <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 text-[10px] font-bold uppercase tracking-wider">{app.type}</span>
                                                                        </div>
                                                                        {app.description && <p className="text-xs text-muted-foreground">{app.description}</p>}
                                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                                                            <Clock className="w-3.5 h-3.5" />
                                                                            <span className="tabular-nums">{formatEventTime(app.startTime)} – {formatEventTime(app.endTime)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    );
                                                }

                                                const { task } = item;
                                                const isCompleted = task.status === 'completed';
                                                return (
                                                    <div key={item.key} className={cn(
                                                        'flex items-center gap-1 px-1.5 py-0.5 rounded-md border-l-2 text-[10px] font-medium leading-tight transition-all duration-200 cursor-pointer backdrop-blur-sm',
                                                        isCompleted
                                                            ? 'bg-muted/20 border-l-muted-foreground/20 text-muted-foreground/40 line-through'
                                                            : 'bg-amber-500/10 border-l-amber-500 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20'
                                                    )}>
                                                        <span className="w-1 h-1 rounded-full bg-current/70 shrink-0" />
                                                        <span className="truncate">{task.title}</span>
                                                    </div>
                                                );
                                            })}

                                            {overflowCount > 0 && (
                                                <div className="px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground/60 tracking-tight">
                                                    +{overflowCount} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </TooltipProvider>
                )}
            </div>
        </div>
    );
}
