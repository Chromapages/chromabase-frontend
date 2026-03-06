'use client';

import { useState } from 'react';
import { CRMTask, Client } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Building2, Flag, Trash2, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface MobileTasksTabProps {
    tasks: CRMTask[] | undefined;
    clients: Client[] | undefined;
}

export function MobileTasksTab({ tasks, clients }: MobileTasksTabProps) {
    const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

    const filteredTasks = tasks
        ?.filter(t => t.status !== 'completed')
        ?.filter(t => filter === 'all' ? true : t.priority === filter)
        .sort((a, b) => (a.dueDate || 0) - (b.dueDate || 0)) || [];

    return (
        <div className="flex flex-col gap-6 p-4 pb-32 h-full overflow-y-auto scrollbar-none">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Tasks</h2>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                    {filteredTasks.length} Pending Actions
                </p>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-1 bg-card/50 p-1 rounded-2xl border border-border/40">
                {(['all', 'high', 'medium', 'low'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "flex-1 py-2 rounded-xl text-[10px] font-bold uppercase transition-all",
                            filter === f ? "bg-background shadow-sm border border-border/50 text-foreground" : "text-muted-foreground hover:bg-muted/30"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Task List */}
            <div className="flex flex-col gap-3">
                <AnimatePresence initial={false}>
                    {filteredTasks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-12 flex flex-col items-center gap-2 text-center opacity-40"
                        >
                            <CheckCircle2 className="w-8 h-8" />
                            <p className="text-sm font-medium">No tasks found</p>
                        </motion.div>
                    ) : (
                        filteredTasks.map((task) => (
                            <SwipeableTaskItem
                                key={task.id}
                                task={task}
                                client={clients?.find(c => c.id === task.accountId)}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function SwipeableTaskItem({ task, client }: { task: CRMTask; client?: Client }) {
    const x = useMotionValue(0);
    const background = useTransform(x, [-100, 0, 100], ['#ef4444', '#ffffff00', '#10b981']);
    const opacity = useTransform(x, [-100, -50, 0, 50, 100], [1, 0.5, 0, 0.5, 1]);

    // In a real app, these would trigger API calls
    const handleSwipeAction = (dragX: number) => {
        if (dragX > 70) {
            console.log('Task Completed:', task.id);
        } else if (dragX < -70) {
            console.log('Task Deleted:', task.id);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-2xl">
            {/* Action Backgrounds */}
            <motion.div
                style={{ background, opacity }}
                className="absolute inset-0 flex items-center justify-between px-6"
            >
                <div className="flex items-center gap-2 text-white">
                    <Check className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2 text-white">
                    <Trash2 className="w-5 h-5" />
                </div>
            </motion.div>

            {/* Task Card */}
            <motion.div
                drag="x"
                dragConstraints={{ left: -100, right: 100 }}
                style={{ x }}
                onDragEnd={(_, info) => handleSwipeAction(info.offset.x)}
                className="relative z-10 bg-card border border-border/40 p-4 shadow-sm"
            >
                <div className="flex items-start gap-4">
                    <div className={cn(
                        "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                        task.priority === 'high' ? "border-destructive/30" : "border-muted-foreground/30"
                    )}>
                        {task.priority === 'high' && <Flag className="w-3 h-3 text-destructive" />}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className="text-[14px] font-bold text-foreground leading-tight truncate">
                            {task.title}
                        </h4>

                        <div className="flex items-center gap-3 mt-1.5">
                            {client && (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Building2 className="w-3 h-3" />
                                    <span className="text-[10px] font-medium truncate">{client.companyName}</span>
                                </div>
                            )}
                            {task.dueDate && (
                                <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                                    <Clock className="w-3 h-3" />
                                    <span className="text-[10px] font-medium">
                                        {formatDistanceToNow(task.dueDate, { addSuffix: true })}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={cn(
                        "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-muted/50",
                        task.priority === 'high' ? "text-destructive" :
                            task.priority === 'medium' ? "text-amber-600" : "text-blue-500"
                    )}>
                        {task.priority}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
