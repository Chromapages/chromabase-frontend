'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Video, Phone, Users, Clock } from 'lucide-react';
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
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CRMTask, Appointment } from '@/types';

interface CalendarViewProps {
    tasks: CRMTask[] | undefined;
    appointments: Appointment[] | undefined;
    isLoading: boolean;
}

export function CalendarView({ tasks, appointments, isLoading }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'month' | 'week'>('month');

    const handlePrev = () => setCurrentDate(view === 'month' ? subMonths(currentDate, 1) : addDays(currentDate, -7));
    const handleNext = () => setCurrentDate(view === 'month' ? addMonths(currentDate, 1) : addDays(currentDate, 7));
    const handleToday = () => setCurrentDate(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = view === 'month' ? startOfWeek(monthStart) : startOfWeek(currentDate);
    const endDate = view === 'month' ? endOfWeek(monthEnd) : endOfWeek(currentDate);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const getAppointmentIcon = (type: string) => {
        switch (type) {
            case 'call': return <Phone className="w-3 h-3" />;
            case 'meeting': return <Users className="w-3 h-3" />;
            case 'consultation': return <Video className="w-3 h-3" />;
            default: return <Clock className="w-3 h-3" />;
        }
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold w-48">
                        {format(currentDate, view === 'month' ? 'MMMM yyyy' : 'MMM yyyy')}
                    </h2>
                    <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border/50">
                        <Button variant="ghost" size="icon" onClick={handlePrev} className="h-8 w-8 rounded-md hover:bg-background">
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleToday} className="h-8 rounded-md px-3 font-medium text-xs hover:bg-background mx-1">
                            Today
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleNext} className="h-8 w-8 rounded-md hover:bg-background">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex bg-muted/50 p-1 rounded-lg border border-border/50">
                    <button
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'month' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => setView('month')}
                    >
                        Month
                    </button>
                    <button
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'week' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => setView('week')}
                    >
                        Week
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm flex flex-col backdrop-blur-sm bg-card/50">
                {isLoading ? (
                    <div className="p-6 h-full"><TableSkeleton rows={10} /></div>
                ) : (
                    <TooltipProvider>
                        <div className="grid grid-cols-7 border-b border-border/50 bg-muted/10">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="py-3 text-center text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className={`flex-1 grid grid-cols-7 ${view === 'month' ? 'grid-rows-6' : 'grid-rows-1'} min-h-0`}>
                            {days.map((day, idx) => {
                                const dayTasks = tasks?.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day)) || [];
                                const dayAppointments = appointments?.filter(a => isSameDay(new Date(a.startTime), day)) || [];
                                const isCurrentMonth = isSameMonth(day, monthStart);

                                return (
                                    <div
                                        key={day.toString()}
                                        className={`border-r border-b border-border/50 last:border-r-0 relative group hover:bg-muted/5 transition-colors
                                            ${!isCurrentMonth && view === 'month' ? 'bg-muted/5 text-muted-foreground/50' : ''} 
                                            ${isToday(day) ? 'bg-primary/[0.02]' : ''}
                                            p-2 flex flex-col gap-1 overflow-y-auto hide-scrollbar`}
                                    >
                                        <div className="flex items-center justify-between mb-1 pt-1">
                                            <span className={`text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors 
                                                ${isToday(day) ? 'bg-primary text-primary-foreground shadow-md' : 'group-hover:text-primary'}
                                                ${!isCurrentMonth && view === 'month' ? 'opacity-30' : ''}`}>
                                                {format(day, 'd')}
                                            </span>
                                            {(dayTasks.length > 0 || dayAppointments.length > 0) && isCurrentMonth && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            {dayAppointments.map(app => (
                                                <Tooltip key={app.id}>
                                                    <TooltipTrigger asChild>
                                                        <div className={`text-[10px] px-2 py-1 rounded-md truncate font-semibold cursor-pointer border flex items-center gap-1.5 transition-all
                                                            ${app.status === 'completed' ? 'bg-muted/50 text-muted-foreground border-transparent' :
                                                                'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900/50 hover:bg-blue-500/20'}
                                                        `}>
                                                            {getAppointmentIcon(app.type)}
                                                            {format(new Date(app.startTime), 'p')} - {app.title}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right" className="bg-popover border border-border shadow-xl p-3 max-w-xs">
                                                        <div className="space-y-2">
                                                            <div className="font-bold text-sm">{app.title}</div>
                                                            <div className="text-xs text-muted-foreground">{app.description}</div>
                                                            <div className="flex items-center gap-2 text-xs font-medium">
                                                                <Clock className="w-3 h-3" />
                                                                {format(new Date(app.startTime), 'p')} - {format(new Date(app.endTime), 'p')}
                                                            </div>
                                                            {app.location && (
                                                                <div className="flex items-center gap-2 text-xs">
                                                                    <Users className="w-3 h-3" />
                                                                    {app.location}
                                                                </div>
                                                            )}
                                                            {app.videoLink && (
                                                                <Button variant="link" className="h-auto p-0 text-blue-500 text-xs" onClick={() => window.open(app.videoLink, '_blank')}>
                                                                    Join Meeting
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}

                                            {dayTasks.map(task => (
                                                <div
                                                    key={task.id}
                                                    className={`text-[10px] px-2 py-1 rounded-md truncate font-medium cursor-pointer transition-all border
                                                        ${task.status === 'completed' ? 'bg-muted/30 text-muted-foreground/70 border-transparent line-through' :
                                                            task.priority === 'high' ? 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-900/50 hover:bg-red-500/20' :
                                                                'bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-900/50 hover:bg-orange-500/20'
                                                        }
                                                    `}
                                                >
                                                    {task.title}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </TooltipProvider>
                )}
            </div>

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
