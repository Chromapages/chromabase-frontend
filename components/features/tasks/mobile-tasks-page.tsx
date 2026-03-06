'use client';

import { useState, useMemo } from 'react';
import { CRMTask, Client, TaskStatus, TaskPriority } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Search, Plus, X, Calendar as CalendarIcon, Flag, Layout } from 'lucide-react';
import { isPast, isToday, endOfDay, addDays, format } from 'date-fns';
import { SwipeableTaskCard } from './swipeable-task-card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { TaskDetail } from './task-detail';
import { Input } from '@/components/ui/input';
import { useTasks } from '@/hooks';
import { toast } from 'sonner';

interface MobileTasksPageProps {
    tasks: CRMTask[] | undefined;
    clients: Client[] | undefined;
    onUpdateStatus: (id: string, status: TaskStatus) => void;
    onDeleteTask: (id: string) => void;
}

type GroupType = 'OVERDUE' | 'TODAY' | 'UPCOMING' | 'SOMEDAY';

function ProgressRing({ percent }: { percent: number }) {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90">
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="3.5"
                    fill="transparent"
                    className="text-muted/10"
                />
                <motion.circle
                    cx="24"
                    cy="24"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="3.5"
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="text-primary"
                />
            </svg>
            <span className="absolute text-[10px] font-black tracking-tighter">{Math.round(percent)}%</span>
        </div>
    );
}

function TaskSkeleton() {
    return (
        <div className="space-y-10 px-4 pt-4">
            {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-4">
                    <div className="h-3 w-20 bg-muted/20 rounded-full animate-pulse" />
                    <div className="space-y-3">
                        {[...Array(3)].map((_, j) => (
                            <div key={j} className="h-24 bg-card border border-border/20 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function ConfettiBurst({ x, y }: { x: number, y: number }) {
    return (
        <div className="fixed inset-0 pointer-events-none z-[100]">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 1,
                        scale: 0,
                        x,
                        y
                    }}
                    animate={{
                        opacity: 0,
                        scale: Math.random() * 1.5 + 0.5,
                        x: x + (Math.random() - 0.5) * 400,
                        y: y + (Math.random() - 0.5) * 400,
                        rotate: Math.random() * 360
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn(
                        "absolute w-2 h-2 rounded-full",
                        ["bg-primary", "bg-yellow-400", "bg-rose-500", "bg-emerald-500", "bg-sky-500"][i % 5]
                    )}
                />
            ))}
        </div>
    );
}

export function MobileTasksPage({ tasks, clients, onUpdateStatus, onDeleteTask }: MobileTasksPageProps) {
    const { useCreate } = useTasks();
    const createTask = useCreate();

    const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
    const [statusFilter, setStatusFilter] = useState<'pending' | 'completed'>('pending');
    const [selectedTask, setSelectedTask] = useState<CRMTask | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form State
    const [newTitle, setNewTitle] = useState('');
    const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
    const [newType, setNewType] = useState<CRMTask['type']>('todo');
    const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
    const [showConfetti, setShowConfetti] = useState(false);

    const handleUpdateStatus = (id: string, status: TaskStatus) => {
        if (status === 'completed') {
            setConfettiPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 1000);
        }
        onUpdateStatus(id, status);
    };

    const handleCreateTask = () => {
        if (!newTitle.trim()) {
            toast.error('Title is required');
            return;
        }

        createTask.mutate({
            title: newTitle.trim(),
            priority: newPriority,
            type: newType,
            status: 'todo',
            dueDate: Date.now(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            subtasks: [],
            assignedTo: 'currentUser',
        } as Partial<CRMTask>, {
            onSuccess: () => {
                toast.success('Task created 🚀');
                setIsCreateOpen(false);
                setNewTitle('');
                setNewPriority('medium');
                setNewType('todo');
            }
        });
    };
    const groupedTasks = useMemo(() => {
        const groups: Record<GroupType, CRMTask[]> = {
            OVERDUE: [],
            TODAY: [],
            UPCOMING: [],
            SOMEDAY: []
        };

        if (!tasks) return groups;

        const filtered = tasks.filter(t => {
            if (statusFilter === 'pending' && t.status === 'completed') return false;
            if (statusFilter === 'completed' && t.status !== 'completed') return false;
            if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
            return true;
        });

        const now = new Date();
        const todayEnd = endOfDay(now);

        filtered.forEach(task => {
            const dueDate = new Date(task.dueDate);
            if (task.status !== 'completed' && isPast(dueDate) && !isToday(dueDate)) {
                groups.OVERDUE.push(task);
            } else if (isToday(dueDate)) {
                groups.TODAY.push(task);
            } else if (dueDate > todayEnd && dueDate <= addDays(todayEnd, 7)) {
                groups.UPCOMING.push(task);
            } else {
                groups.SOMEDAY.push(task);
            }
        });

        return groups;
    }, [tasks, priorityFilter, statusFilter]);

    const totalTasks = tasks?.length || 0;
    const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
    const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const overdueCount = groupedTasks.OVERDUE?.length || 0;

    if (!tasks) return (
        <div className="flex flex-col h-full bg-background relative selection:bg-primary/10">
            <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-2xl border-b border-border/20 p-5">
                <div className="h-12 w-32 bg-muted/10 rounded-2xl animate-pulse" />
            </header>
            <TaskSkeleton />
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-background relative selection:bg-primary/10">
            {showConfetti && <ConfettiBurst x={confettiPos.x} y={confettiPos.y} />}
            {/* Header */}
            <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-2xl border-b border-border/20 p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <ProgressRing percent={progressPercent} />
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold tracking-tight text-foreground/90 italic uppercase tracking-tighter">Workflow</h1>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">
                                {tasks?.filter(t => t.status !== 'completed').length} Tasks Pending
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 bg-card/40 border-border/30">
                            <Search className="w-5 h-5 text-muted-foreground" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Overdue Banner */}
            <AnimatePresence>
                {overdueCount > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-rose-500/10 border-b border-rose-500/20"
                    >
                        <div className="p-3 flex items-center justify-between px-5">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                                    {overdueCount} Priority {overdueCount === 1 ? 'Action' : 'Actions'} Overdue
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10"
                                onClick={() => setPriorityFilter('urgent')}
                            >
                                View All
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Task List Content */}
            <main className="flex-1 overflow-y-auto pt-4 pb-48 px-4 scrollbar-none">
                <AnimatePresence mode="popLayout">
                    {(Object.entries(groupedTasks) as [GroupType, CRMTask[]][]).map(([group, groupTasks]) => (
                        groupTasks.length > 0 && (
                            <motion.section
                                key={group}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-10"
                            >
                                <div className="flex items-center justify-between px-1 mb-4">
                                    <h3 className={cn(
                                        "text-[11px] font-black uppercase tracking-[0.15em] flex items-center gap-2",
                                        group === 'OVERDUE' ? "text-rose-500" : "text-muted-foreground opacity-60"
                                    )}>
                                        {group === 'OVERDUE' && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                                        {group}
                                    </h3>
                                    <span className="text-[9px] font-bold text-muted-foreground/40">{groupTasks.length}</span>
                                </div>

                                <div className="flex flex-col gap-3.5">
                                    {groupTasks.map((task) => (
                                        <div key={task.id} onClick={() => setSelectedTask(task)}>
                                            <SwipeableTaskCard
                                                task={task}
                                                client={clients?.find(c => c.id === task.accountId)}
                                                onUpdateStatus={handleUpdateStatus}
                                                onDeleteTask={onDeleteTask}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )
                    ))}

                    {tasks && tasks.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center py-32 px-12">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-20 h-20 rounded-[2.5rem] bg-primary/5 flex items-center justify-center mb-6 shadow-inner"
                            >
                                <CheckCircle2 className="w-10 h-10 text-primary opacity-40" />
                            </motion.div>
                            <h3 className="text-xl font-bold text-foreground/80 italic uppercase tracking-widest mb-2">Pristine State</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">Your workflow is fully cleared. Tap the button below to add your next major milestone.</p>
                        </div>
                    )}
                </AnimatePresence>
            </main>

            {/* Detail Sheet */}
            <Sheet open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
                <SheetContent side="bottom" className="h-[94vh] p-0 rounded-t-[40px] border-t border-border/20 shadow-2xl overflow-hidden" showCloseButton={false}>
                    {selectedTask && (
                        <div className="h-full flex flex-col relative">
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-muted/40 rounded-full z-50 pointer-events-none" />
                            <div className="flex-1 overflow-y-auto">
                                <TaskDetail
                                    task={selectedTask}
                                    onUpdate={(updates) => {
                                        onUpdateStatus(selectedTask.id, updates.status || selectedTask.status);
                                        setSelectedTask(prev => prev ? { ...prev, ...updates } : null);
                                    }}
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-6 right-6 z-50 rounded-2xl h-11 w-11 bg-muted/10 backdrop-blur-xl border border-white/5 active:scale-90 transition-all"
                                onClick={() => setSelectedTask(null)}
                            >
                                <X className="w-5 h-5 opacity-60" />
                            </Button>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Bottom Controls Group */}
            <div className="fixed bottom-0 left-0 right-0 p-6 z-30 pointer-events-none">
                <div className="max-w-md mx-auto flex flex-col gap-6 items-end">
                    {/* FAB */}
                    <div className="pointer-events-auto">
                        <Button
                            size="icon"
                            onClick={() => setIsCreateOpen(true)}
                            className="w-16 h-16 rounded-[2rem] shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] text-primary-foreground animate-in zoom-in slide-in-from-bottom-8 duration-700 bg-primary hover:scale-105 active:scale-95 transition-all"
                        >
                            <Plus className="w-8 h-8" />
                        </Button>
                    </div>

                    {/* Filter Bar */}
                    <div className="w-full bg-card/80 backdrop-blur-2xl border border-white/5 p-2 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center gap-1.5 pointer-events-auto ring-1 ring-black/5">
                        {(['all', 'urgent', 'high', 'medium', 'low'] as const).map(p => (
                            <button
                                key={p}
                                onClick={() => setPriorityFilter(p)}
                                className={cn(
                                    "flex-1 py-3.5 rounded-[1.2rem] text-[9px] font-black uppercase tracking-widest transition-all",
                                    priorityFilter === p
                                        ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                                        : "text-muted-foreground hover:bg-muted/30"
                                )}
                            >
                                {p[0]}
                            </button>
                        ))}
                        <div className="w-px h-8 bg-border/20 mx-1.5" />
                        <button
                            onClick={() => setStatusFilter(prev => prev === 'pending' ? 'completed' : 'pending')}
                            className={cn(
                                "aspect-square h-12 rounded-[1.2rem] flex items-center justify-center transition-all",
                                statusFilter === 'completed' ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-muted/20 text-muted-foreground"
                            )}
                        >
                            <CheckCircle2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Create Sheet */}
            <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <SheetContent side="bottom" className="p-8 pb-12 rounded-t-[40px] h-auto border-t border-white/5 shadow-2xl" showCloseButton={false}>
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-muted/40 rounded-full" />
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tighter italic uppercase text-foreground/90">New Milestone</h2>
                            <p className="text-sm text-muted-foreground font-medium opacity-60">Define your next priority action.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Task Title</label>
                                <Input
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="e.g. Follow up with Acme Corp"
                                    className="h-16 rounded-2xl bg-muted/10 border-none text-lg px-6 focus-visible:ring-1 focus-visible:ring-primary shadow-inner"
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Priority</label>
                                    <div className="grid grid-cols-2 gap-2 bg-muted/10 p-1.5 rounded-2xl">
                                        {(['high', 'medium'] as const).map(p => (
                                            <Button
                                                key={p}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setNewPriority(p)}
                                                className={cn(
                                                    "rounded-xl text-[10px] font-bold uppercase",
                                                    newPriority === p ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                                                )}
                                            >
                                                {p}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Category</label>
                                    <div className="grid grid-cols-2 gap-2 bg-muted/10 p-1.5 rounded-2xl">
                                        {(['call', 'todo'] as const).map(t => (
                                            <Button
                                                key={t}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setNewType(t as CRMTask['type'])}
                                                className={cn(
                                                    "rounded-xl text-[10px] font-bold uppercase",
                                                    newType === t ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                                                )}
                                            >
                                                {t}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1 h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest border-border/40"
                                    onClick={() => setIsCreateOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-[2] h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                                    onClick={handleCreateTask}
                                    disabled={!newTitle.trim() || createTask.isPending}
                                >
                                    {createTask.isPending ? 'Syncing...' : 'Secure Launch'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
