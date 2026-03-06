'use client';

import { CRMTask, Client, TaskStatus } from '@/types';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Building2, Clock, Trash2, Check, Phone, Video, Mail, SquareCheck } from 'lucide-react';
import { formatDistanceToNow, isPast, isToday } from 'date-fns';
import { toast } from 'sonner';

const TypeIcon = ({ type }: { type?: CRMTask['type'] }) => {
    switch (type) {
        case 'call': return <Phone className="w-3.5 h-3.5" />;
        case 'meeting': return <Video className="w-3.5 h-3.5" />;
        case 'email': return <Mail className="w-3.5 h-3.5" />;
        default: return <SquareCheck className="w-3.5 h-3.5" />;
    }
};

interface SwipeableTaskCardProps {
    task: CRMTask;
    client?: Client;
    onUpdateStatus: (id: string, status: TaskStatus) => void;
    onDeleteTask: (id: string) => void;
}

export function SwipeableTaskCard({ task, client, onUpdateStatus, onDeleteTask }: SwipeableTaskCardProps) {
    const x = useMotionValue(0);

    // Swipe Colors & Icons
    const rightBg = useTransform(x, [0, 80], ['#00000000', '#10b981']); // Green for Complete
    const leftBg = useTransform(x, [-80, 0], ['#ef4444', '#00000000']); // Red for Delete

    const rightOpacity = useTransform(x, [0, 80], [0, 1]);
    const leftOpacity = useTransform(x, [-80, 0], [1, 0]);

    const handleDragEnd = (_: any, info: any) => {
        if (info.offset.x > 80) {
            // Success Haptic: Soft double tap
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([15, 30, 15]);
            }
            onUpdateStatus(task.id, 'completed');
            toast.success('Action Cleared');
        } else if (info.offset.x < -80) {
            // Delete Haptic: One heavy thump
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(60);
            }
            const deletedId = task.id;
            // Optimistic is handled by the hook usually, but we'll trigger onDelete
            onDeleteTask(deletedId);
            toast.error('Milestone Removed', {
                action: {
                    label: 'Undo',
                    onClick: () => console.log('Undo delete for:', deletedId), // In a real app, this would re-create
                },
            });
        }
    };

    const priorityStyles = {
        urgent: 'border-rose-500 text-rose-500 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.1)]',
        high: 'border-orange-500 text-orange-600 bg-orange-500/10',
        medium: 'border-amber-400 text-amber-600 bg-amber-400/10',
        low: 'border-blue-400 text-blue-500 bg-blue-400/10',
    };

    return (
        <div className="relative overflow-hidden rounded-2xl group">
            {/* Background Actions */}
            <motion.div
                style={{ backgroundColor: rightBg, opacity: rightOpacity }}
                className="absolute inset-0 flex items-center justify-start px-8 z-0"
            >
                <Check className="w-6 h-6 text-white" />
            </motion.div>

            <motion.div
                style={{ backgroundColor: leftBg, opacity: leftOpacity }}
                className="absolute inset-0 flex items-center justify-end px-8 z-0"
            >
                <Trash2 className="w-6 h-6 text-white" />
            </motion.div>

            {/* Task Card Content */}
            <motion.div
                drag="x"
                dragConstraints={{ left: -100, right: 100 }}
                style={{ x }}
                onDragEnd={handleDragEnd}
                className="relative z-10 bg-card border border-border/40 p-5 shadow-sm active:scale-[0.97] transition-all cursor-pointer"
            >
                <div className="flex items-start gap-4">
                    {/* Status Circle (Left Border in Blueprint, but let's use a themed indicator) */}
                    <div className={cn(
                        "w-1.5 rounded-full absolute left-0 top-3 bottom-3",
                        priorityStyles[task.priority].split(' ')[0].replace('border-', 'bg-')
                    )} />

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 max-w-[70%]">
                                <span className="text-muted-foreground shrink-0">
                                    <TypeIcon type={task.type} />
                                </span>
                                <h4 className="text-[16px] font-bold text-foreground leading-snug truncate">
                                    {task.title}
                                </h4>
                            </div>
                            <div className={cn(
                                "px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border shrink-0",
                                priorityStyles[task.priority]
                            )}>
                                {task.priority}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                            {client && (
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Building2 className="w-3.5 h-3.5 opacity-60" />
                                    <span className="text-[11px] font-bold truncate max-w-[120px]">{client.companyName}</span>
                                </div>
                            )}
                            {task.dueDate && (
                                <div className={cn(
                                    "flex items-center gap-1.5",
                                    isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && task.status !== 'completed'
                                        ? "text-rose-500"
                                        : "text-muted-foreground"
                                )}>
                                    <Clock className="w-3.5 h-3.5 opacity-60" />
                                    <span className="text-[11px] font-bold">
                                        {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Subtasks Progress Bar */}
                        {task.subtasks && task.subtasks.length > 0 && (
                            <div className="mt-4 space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Progress</span>
                                    <span className="text-[8px] font-black text-primary uppercase">
                                        {Math.round((task.subtasks.filter(s => s.isCompleted).length / task.subtasks.length) * 100)}%
                                    </span>
                                </div>
                                <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(task.subtasks.filter(s => s.isCompleted).length / task.subtasks.length) * 100}%` }}
                                        className="h-full bg-primary"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
