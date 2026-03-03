'use client';

import React, { useState, useEffect } from 'react';
import { CRMTask, TaskStatus, TaskPriority, SubTask, Activity, User } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    Clock,
    AlertCircle,
    CheckCircle2,
    Calendar as CalendarIcon,
    User as UserIcon,
    Link as LinkIcon,
    Plus,
    Trash2,
    CheckSquare,
    Square,
    ChevronLeft,
    Share2,
    MoreHorizontal,
    MessageSquare,
    History,
    Play,
    Pause,
    Network,
    Lock,
    ArrowRight
} from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useTasks, useUsers, useActivities } from '@/hooks';

interface TaskDetailProps {
    task: CRMTask;
    onUpdate: (updates: Partial<CRMTask>) => void;
}

export function TaskDetail({ task, onUpdate }: TaskDetailProps) {
    const router = useRouter();
    const usersEntity = useUsers();
    const { data: users } = usersEntity.useList();
    const activitiesEntity = useActivities();
    const { data: activities = [] } = activitiesEntity.useList();
    const addActivity = activitiesEntity.useCreate();
    const tasksEntity = useTasks();
    const { data: tasks } = tasksEntity.useList();

    const [isAddDependencyOpen, setIsAddDependencyOpen] = useState(false);
    const [dependencyType, setDependencyType] = useState<'blockedBy' | 'blocking'>('blockedBy');

    const [newSubtask, setNewSubtask] = useState('');
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [description, setDescription] = useState(task.description || '');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
    const [newComment, setNewComment] = useState('');

    const isTimerRunning = !!task.timerStartTime;
    const [elapsedTime, setElapsedTime] = useState(task.timeSpent || 0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning && task.timerStartTime) {
            interval = setInterval(() => {
                const now = Date.now();
                const totalElapsed = (task.timeSpent || 0) + Math.floor((now - task.timerStartTime!) / 1000);
                setElapsedTime(totalElapsed);
            }, 1000);
        } else {
            setElapsedTime(task.timeSpent || 0);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, task.timerStartTime, task.timeSpent]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => {
        if (isTimerRunning && task.timerStartTime) {
            const now = Date.now();
            const sessionTime = Math.floor((now - task.timerStartTime) / 1000);
            const newTotalTime = (task.timeSpent || 0) + sessionTime;
            onUpdate({
                timeSpent: newTotalTime,
                timerStartTime: null
            });
            addActivity.mutate({
                type: 'note',
                description: `Logged time: ${formatTime(sessionTime)}`,
                createdBy: task.assignedTo || 'current-user-id',
                relatedTo: { type: 'task', id: task.id },
                timestamp: Date.now()
            });
        } else {
            onUpdate({ timerStartTime: Date.now() });
        }
    };

    const assignee = users?.find((u: User) => u.id === task.assignedTo);

    const taskActivities = (activities as Activity[]).filter(a =>
        a.relatedTo?.type === 'task' && a.relatedTo?.id === task.id
    ).sort((a, b) => b.timestamp - a.timestamp);

    const completedSubtasks = task.subtasks?.filter(s => s.isCompleted).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;
    const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    const handleStatusChange = (newStatus: TaskStatus) => {
        onUpdate({ status: newStatus });
        addActivity.mutate({
            type: 'status_change',
            description: `Changed status to ${newStatus.replace('_', ' ')}`,
            createdBy: task.assignedTo, // Fallback to assignee for mock
            relatedTo: { type: 'task', id: task.id },
            timestamp: Date.now()
        });
    };

    const handlePriorityChange = (newPriority: TaskPriority) => {
        onUpdate({ priority: newPriority });
        addActivity.mutate({
            type: 'status_change',
            description: `Changed priority to ${newPriority}`,
            createdBy: task.assignedTo,
            relatedTo: { type: 'task', id: task.id },
            timestamp: Date.now()
        });
    };

    const handleAddSubtask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubtask.trim()) return;

        const subtask: SubTask = {
            id: crypto.randomUUID(),
            title: newSubtask,
            isCompleted: false
        };

        onUpdate({
            subtasks: [...(task.subtasks || []), subtask]
        });
        setNewSubtask('');
    };

    const toggleSubtask = (id: string) => {
        onUpdate({
            subtasks: task.subtasks?.map(s =>
                s.id === id ? { ...s, isCompleted: !s.isCompleted } : s
            )
        });
    };

    const removeSubtask = (id: string) => {
        onUpdate({
            subtasks: task.subtasks?.filter(s => s.id !== id)
        });
    };

    const handleSaveDescription = () => {
        onUpdate({ description });
        setIsEditingDescription(false);
        addActivity.mutate({
            type: 'task_updated',
            description: 'Updated task description',
            createdBy: task.assignedTo,
            relatedTo: { type: 'task', id: task.id },
            timestamp: Date.now()
        });
    };

    const priorityColors = {
        low: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
        medium: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        urgent: 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && task.status !== 'completed';
    const isDueToday = task.dueDate && isToday(new Date(task.dueDate)) && task.status !== 'completed';

    return (
        <div className="flex flex-col h-full bg-background/50 animate-in fade-in duration-500">
            {/* Header Sticky Bar */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Task Details</span>
                        <h2 className="font-semibold truncate max-w-[300px]">{task.title}</h2>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Share2 className="w-4 h-4" />
                        Share
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="text-destructive" onClick={() => {
                                if (confirm('Are you sure you want to delete this task?')) {
                                    router.back();
                                }
                            }}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Task
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6 md:p-8">
                <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Properties & Status */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-sm bg-card/30 backdrop-blur-sm">
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Status</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(['todo', 'in_progress', 'review', 'completed'] as TaskStatus[]).map((s) => (
                                            <Button
                                                key={s}
                                                variant={task.status === s ? 'default' : 'outline'}
                                                size="sm"
                                                className={cn(
                                                    "text-[10px] h-8 justify-start px-3 rounded-lg",
                                                    task.status === s && "shadow-lg shadow-primary/20"
                                                )}
                                                onClick={() => handleStatusChange(s)}
                                            >
                                                {s.replace('_', ' ').toUpperCase()}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <Separator className="bg-border/50" />

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Properties</label>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between group">
                                            <span className="text-sm text-muted-foreground flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" /> Priority
                                            </span>
                                            <Badge
                                                className={cn("cursor-pointer transition-all hover:scale-105", priorityColors[task.priority])}
                                                onClick={() => {
                                                    const flows: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
                                                    const next = flows[(flows.indexOf(task.priority) + 1) % flows.length];
                                                    handlePriorityChange(next);
                                                }}
                                            >
                                                {task.priority.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground flex items-center gap-2">
                                                <CalendarIcon className="w-4 h-4" /> Due Date
                                            </span>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <span className={cn(
                                                        "text-sm font-medium cursor-pointer hover:underline transition-all",
                                                        isOverdue ? "text-destructive" : isDueToday ? "text-orange-500" : "text-foreground"
                                                    )}>
                                                        {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No date set'}
                                                    </span>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="end">
                                                    <Calendar
                                                        mode="single"
                                                        selected={task.dueDate ? new Date(task.dueDate) : undefined}
                                                        onSelect={(date) => {
                                                            if (date) {
                                                                onUpdate({ dueDate: date.getTime() });
                                                                addActivity.mutate({
                                                                    type: 'task_updated',
                                                                    description: `Changed due date to ${format(date, 'MMM d, yyyy')}`,
                                                                    createdBy: task.assignedTo,
                                                                    relatedTo: { type: 'task', id: task.id },
                                                                    timestamp: Date.now()
                                                                });
                                                            }
                                                        }}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground flex items-center gap-2">
                                                <UserIcon className="w-4 h-4" /> Assignee
                                            </span>
                                            <Popover open={isAssigneeOpen} onOpenChange={setIsAssigneeOpen}>
                                                <PopoverTrigger asChild>
                                                    <div className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 -mr-1 rounded transition-colors ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                                        <Avatar className="w-6 h-6 border-2 border-background ring-1 ring-border">
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignedTo}`} />
                                                            <AvatarFallback>{task.assignedTo?.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm font-medium">{assignee ? `${assignee.firstName} ${assignee.lastName}` : (task.assignedTo || 'Unassigned')}</span>
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0" align="end">
                                                    <Command>
                                                        <CommandInput placeholder="Search team..." />
                                                        <CommandList>
                                                            <CommandEmpty>No users found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {users?.map((u: User) => (
                                                                    <CommandItem
                                                                        key={u.id}
                                                                        value={`${u.firstName} ${u.lastName}`}
                                                                        onSelect={() => {
                                                                            if (u.id !== task.assignedTo) {
                                                                                onUpdate({ assignedTo: u.id });
                                                                                addActivity.mutate({
                                                                                    type: 'task_updated',
                                                                                    description: `Reassigned task to ${u.firstName} ${u.lastName}`,
                                                                                    createdBy: task.assignedTo,
                                                                                    relatedTo: { type: 'task', id: task.id },
                                                                                    timestamp: Date.now()
                                                                                });
                                                                            }
                                                                            setIsAssigneeOpen(false);
                                                                        }}
                                                                        className="flex items-center gap-2"
                                                                    >
                                                                        <Avatar className="w-5 h-5">
                                                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} />
                                                                            <AvatarFallback>{u.firstName?.charAt(0)}</AvatarFallback>
                                                                        </Avatar>
                                                                        <span className="text-sm">{u.firstName} {u.lastName}</span>
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>

                                {task.relatedTo && (
                                    <>
                                        <Separator className="bg-border/50" />
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Linked Records</label>
                                            <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl group hover:border-primary/50 transition-all">
                                                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                    <LinkIcon className="w-4 h-4" />
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <span className="text-[10px] text-muted-foreground uppercase font-bold">{task.relatedTo.type}</span>
                                                    <span className="text-sm font-medium">{task.relatedTo.id.substring(0, 8)}...</span>
                                                </div>
                                            </Button>
                                        </div>
                                    </>
                                )}

                                <Separator className="bg-border/50" />
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Time Tracking</label>
                                    <div className="flex items-center justify-between p-3 rounded-xl border bg-card/30">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors", isTimerRunning ? "bg-orange-500/10 text-orange-500 animate-pulse" : "bg-primary/5 text-primary")}>
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xl font-mono tracking-tight font-medium">{formatTime(isTimerRunning ? elapsedTime : (task.timeSpent || 0))}</span>
                                                <span className="text-xs text-muted-foreground">{isTimerRunning ? 'Recording...' : 'Total Logged'}</span>
                                            </div>
                                        </div>
                                        <Button
                                            variant={isTimerRunning ? "destructive" : "default"}
                                            size="icon"
                                            className={cn("rounded-full w-10 h-10 shadow-lg", isTimerRunning ? "hover:bg-destructive/90" : "bg-primary hover:bg-primary/90")}
                                            onClick={toggleTimer}
                                        >
                                            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content: Description & Subtasks */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-4">
                            {isEditingTitle ? (
                                <Input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onBlur={() => {
                                        setIsEditingTitle(false);
                                        if (editTitle.trim() && editTitle !== task.title) {
                                            onUpdate({ title: editTitle.trim() });
                                            addActivity.mutate({
                                                type: 'task_updated',
                                                description: `Changed title to "${editTitle.trim()}"`,
                                                createdBy: task.assignedTo,
                                                relatedTo: { type: 'task', id: task.id },
                                                timestamp: Date.now()
                                            });
                                        } else {
                                            setEditTitle(task.title);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.currentTarget.blur();
                                        }
                                    }}
                                    autoFocus
                                    className="text-3xl md:text-4xl font-bold tracking-tight h-auto py-1 px-2 -ml-2 border-primary bg-background/50 focus-visible:ring-1"
                                />
                            ) : (
                                <h1
                                    className="text-3xl md:text-4xl font-bold tracking-tight hover:bg-white/5 cursor-pointer rounded px-2 -ml-2 py-1 transition-colors dark:hover:bg-white/10"
                                    onClick={() => {
                                        setEditTitle(task.title);
                                        setIsEditingTitle(true);
                                    }}
                                >
                                    {task.title}
                                </h1>
                            )}
                            <div className="flex flex-wrap gap-2">
                                {task.tags?.map(tag => (
                                    <Badge key={tag} variant="secondary" className="rounded-full bg-secondary/50 backdrop-blur-sm border-none">
                                        #{tag}
                                    </Badge>
                                ))}
                                <Button variant="ghost" size="sm" className="h-6 rounded-full text-xs gap-1 border border-dashed border-border py-0">
                                    <Plus className="w-3 h-3" /> Add Tag
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    Description
                                </h3>
                                {!isEditingDescription && (
                                    <Button variant="ghost" size="sm" onClick={() => setIsEditingDescription(true)}>
                                        Edit
                                    </Button>
                                )}
                            </div>

                            {isEditingDescription ? (
                                <div className="space-y-4">
                                    <Textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="min-h-[150px] bg-background/50 focus:bg-background transition-colors"
                                        placeholder="Add more details about this task..."
                                    />
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={handleSaveDescription}>Save Changes</Button>
                                        <Button variant="outline" size="sm" onClick={() => {
                                            setDescription(task.description || '');
                                            setIsEditingDescription(false);
                                        }}>Cancel</Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {task.description || "No description provided."}
                                </p>
                            )}
                        </div>

                        <Separator className="bg-border/50" />

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        Subtasks
                                        <Badge variant="outline" className="rounded-full">{totalSubtasks}</Badge>
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{completedSubtasks} of {totalSubtasks} completed</p>
                                </div>
                                <div className="w-32">
                                    <Progress value={progress} className="h-2" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                {task.subtasks?.map(sub => (
                                    <div
                                        key={sub.id}
                                        className="flex items-center group gap-4 p-3 rounded-xl border bg-card/30 hover:bg-card/50 transition-all"
                                    >
                                        <button
                                            onClick={() => toggleSubtask(sub.id)}
                                            className={cn(
                                                "transition-colors",
                                                sub.isCompleted ? "text-primary" : "text-muted-foreground"
                                            )}
                                        >
                                            {sub.isCompleted ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                        </button>
                                        <span className={cn(
                                            "flex-1 text-sm font-medium transition-all",
                                            sub.isCompleted && "text-muted-foreground line-through opacity-70"
                                        )}>
                                            {sub.title}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive"
                                            onClick={() => removeSubtask(sub.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}

                                <form onSubmit={handleAddSubtask} className="relative group mt-4">
                                    <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        value={newSubtask}
                                        onChange={(e) => setNewSubtask(e.target.value)}
                                        className="pl-10 h-11 bg-background/30 rounded-xl focus:bg-background border-dashed"
                                        placeholder="Add a new subtask..."
                                    />
                                </form>
                            </div>
                        </div>

                        <Separator className="bg-border/50" />

                        {/* Task Dependencies */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Network className="w-5 h-5" />
                                        Dependencies
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Manage tasks that block or are blocked by this task</p>
                                </div>
                                <Popover open={isAddDependencyOpen} onOpenChange={setIsAddDependencyOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Plus className="w-4 h-4" /> Add Dependency
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0" align="end">
                                        <Command>
                                            <div className="flex border-b border-border p-2 gap-2">
                                                <Button
                                                    variant={dependencyType === 'blockedBy' ? 'secondary' : 'ghost'}
                                                    size="sm"
                                                    className="flex-1 text-xs"
                                                    onClick={() => setDependencyType('blockedBy')}
                                                >
                                                    Blocked By
                                                </Button>
                                                <Button
                                                    variant={dependencyType === 'blocking' ? 'secondary' : 'ghost'}
                                                    size="sm"
                                                    className="flex-1 text-xs"
                                                    onClick={() => setDependencyType('blocking')}
                                                >
                                                    Blocking
                                                </Button>
                                            </div>
                                            <CommandInput placeholder="Search tasks..." />
                                            <CommandList>
                                                <CommandEmpty>No tasks found.</CommandEmpty>
                                                <CommandGroup>
                                                    {(tasks as CRMTask[])?.filter(t => t.id !== task.id).map((t) => (
                                                        <CommandItem
                                                            key={t.id}
                                                            value={t.title}
                                                            onSelect={() => {
                                                                const currentList = task[dependencyType] || [];
                                                                if (!currentList.includes(t.id)) {
                                                                    onUpdate({ [dependencyType]: [...currentList, t.id] });
                                                                    addActivity.mutate({
                                                                        type: 'task_updated',
                                                                        description: `Added "${t.title}" as ${dependencyType === 'blockedBy' ? 'blocking this task' : 'blocked by this task'}`,
                                                                        createdBy: task.assignedTo || 'current-user-id',
                                                                        relatedTo: { type: 'task', id: task.id },
                                                                        timestamp: Date.now()
                                                                    });
                                                                }
                                                                setIsAddDependencyOpen(false);
                                                            }}
                                                            className="flex flex-col items-start px-3 py-2 cursor-pointer"
                                                        >
                                                            <span className="text-sm font-medium line-clamp-1">{t.title}</span>
                                                            <span className="text-xs text-muted-foreground capitalize">{t.status.replace('_', ' ')}</span>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-4">
                                {task.blockedBy?.length ? (
                                    <div className="space-y-2">
                                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                            <Lock className="w-3 h-3" /> Blocked By
                                        </div>
                                        {task.blockedBy.map(depId => {
                                            const depTask = (tasks as CRMTask[])?.find(t => t.id === depId);
                                            return depTask ? (
                                                <div key={depId} onClick={(e) => { e.stopPropagation(); router.push(`/tasks/${depId}`); }} className="flex items-center justify-between p-3 rounded-xl border bg-destructive/5 hover:bg-destructive/10 transition-colors border-destructive/20 group cursor-pointer">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("w-2 h-2 rounded-full", depTask.status === 'completed' ? 'bg-emerald-500' : 'bg-destructive')} />
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium">{depTask.title}</span>
                                                            <span className="text-xs text-muted-foreground capitalize">{depTask.status.replace('_', ' ')}</span>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => {
                                                        e.stopPropagation();
                                                        onUpdate({ blockedBy: task.blockedBy?.filter(id => id !== depId) });
                                                    }}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                ) : null}

                                {task.blocking?.length ? (
                                    <div className="space-y-2">
                                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                            <ArrowRight className="w-3 h-3" /> Blocking
                                        </div>
                                        {task.blocking.map(depId => {
                                            const depTask = (tasks as CRMTask[])?.find(t => t.id === depId);
                                            return depTask ? (
                                                <div key={depId} onClick={(e) => { e.stopPropagation(); router.push(`/tasks/${depId}`); }} className="flex items-center justify-between p-3 rounded-xl border bg-orange-500/5 hover:bg-orange-500/10 transition-colors border-orange-500/20 group cursor-pointer">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("w-2 h-2 rounded-full", depTask.status === 'completed' ? 'bg-emerald-500' : 'bg-orange-500')} />
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium">{depTask.title}</span>
                                                            <span className="text-xs text-muted-foreground capitalize">{depTask.status.replace('_', ' ')}</span>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => {
                                                        e.stopPropagation();
                                                        onUpdate({ blocking: task.blocking?.filter(id => id !== depId) });
                                                    }}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                ) : null}
                                {!task.blockedBy?.length && !task.blocking?.length && (
                                    <div className="p-4 border border-dashed rounded-xl flex items-center justify-center text-sm text-muted-foreground bg-card/10">
                                        No dependencies set for this task.
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator className="bg-border/50" />

                        {/* Activity History Log */}
                        <div className="space-y-6 pb-8">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <History className="w-5 h-5" />
                                Activity Log
                            </h3>

                            {/* Comment Input */}
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                if (!newComment.trim()) return;
                                addActivity.mutate({
                                    type: 'comment',
                                    description: newComment.trim(),
                                    createdBy: task.assignedTo || 'current-user-id',
                                    relatedTo: { type: 'task', id: task.id },
                                    timestamp: Date.now()
                                });
                                setNewComment('');
                            }} className="flex gap-3 items-start relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-border">
                                <div className="absolute left-0 mt-1 flex h-10 w-10 items-center justify-center rounded-full border bg-background shadow-sm ring-1 ring-border z-10 overflow-hidden">
                                    <Avatar className="w-full h-full">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignedTo || 'currentUser'}`} />
                                        <AvatarFallback>Me</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="ml-14 flex-1 space-y-2 z-10 w-full mb-6">
                                    <Textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment or update (Press Enter to submit)..."
                                        className="min-h-[80px] bg-background/50 focus:bg-background transition-colors w-full resize-none"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                e.currentTarget.form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                                            }
                                        }}
                                    />
                                    <div className="flex justify-end">
                                        <Button type="submit" size="sm" disabled={!newComment.trim() || addActivity.isPending}>
                                            Comment
                                        </Button>
                                    </div>
                                </div>
                            </form>

                            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:via-border/50 before:to-transparent">
                                {taskActivities.length > 0 ? taskActivities.map((activity, idx) => (
                                    <div key={activity.id} className="relative flex items-start gap-6 animate-in slide-in-from-left duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                        <div className="absolute left-0 mt-1 flex h-10 w-10 items-center justify-center rounded-full border bg-background shadow-sm ring-1 ring-border">
                                            {activity.type === 'status_change' ? (
                                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                            ) : activity.type === 'comment' ? (
                                                <MessageSquare className="w-4 h-4 text-orange-500" />
                                            ) : (
                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="ml-10 flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium">{activity.description}</p>
                                                <time className="text-xs text-muted-foreground">
                                                    {format(activity.timestamp, 'HH:mm aaa')}
                                                </time>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                By {users?.find((u: User) => u.id === activity.createdBy) ? `${users.find((u: User) => u.id === activity.createdBy)?.firstName} ${users.find((u: User) => u.id === activity.createdBy)?.lastName}` : activity.createdBy} • {format(activity.timestamp, 'MMM d, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="ml-10 text-sm text-muted-foreground italic p-4 border border-dashed rounded-xl">
                                        No activity recorded yet for this task.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
