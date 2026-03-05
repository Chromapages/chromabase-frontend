import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTasks, useUsers, useClients } from '@/hooks';
import { TaskStatus, TaskPriority, CRMTask } from '@/types';
import { cn } from '@/lib/utils';
import { Calendar, Tag, AlertCircle, User as UserIcon, Building } from 'lucide-react';

interface TaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialStatus?: TaskStatus;
    task?: CRMTask | null;
    defaultAccountId?: string;
}

export function TaskDialog({ open, onOpenChange, initialStatus, task, defaultAccountId }: TaskDialogProps) {
    const { useCreate, useUpdate } = useTasks();
    const createTask = useCreate();
    const updateTask = useUpdate();
    const { useList: useUsersList } = useUsers();
    const { data: users } = useUsersList();
    const { useList: useClientsList } = useClients();
    const { data: clients } = useClientsList();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<CRMTask['type']>('todo');
    const [priority, setPriority] = useState<TaskPriority>('medium');
    const [status, setStatus] = useState<TaskStatus>('todo');
    const [dueDate, setDueDate] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [accountId, setAccountId] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setType(task.type);
            setPriority(task.priority);
            setStatus(task.status);
            setDueDate(new Date(task.dueDate).toISOString().split('T')[0]);
            setAssignedTo(task.assignedTo);
            setAccountId(task.accountId || '');
        } else {
            setTitle('');
            setDescription('');
            setType('todo');
            setPriority('medium');
            setStatus(initialStatus || 'todo');
            setDueDate(new Date().toISOString().split('T')[0]);
            setAssignedTo('');
            setAccountId(defaultAccountId || '');
        }
        setError('');
    }, [task, initialStatus, open, defaultAccountId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Title is required');
            return;
        }
        if (!dueDate) {
            setError('Due date is required');
            return;
        }
        if (!assignedTo) {
            setError('Assignee is required');
            return;
        }

        const dueDateTimestamp = new Date(dueDate).getTime();
        const taskData = {
            title,
            description,
            type,
            priority,
            dueDate: dueDateTimestamp,
            assignedTo,
            accountId: accountId || undefined,
            status,
            updatedAt: Date.now(),
        };

        if (task) {
            updateTask.mutate({ id: task.id, data: taskData }, {
                onSuccess: () => onOpenChange(false),
                onError: (err: Error) => setError(err instanceof Error ? err.message : 'Failed to update task')
            });
        } else {
            createTask.mutate({
                ...taskData,
                relatedTo: null,
                createdAt: Date.now(),
            }, {
                onSuccess: () => onOpenChange(false),
                onError: (err: Error) => setError(err instanceof Error ? err.message : 'Failed to create task')
            });
        }
    };

    const isPending = createTask.isPending || updateTask.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-background/95 backdrop-blur-xl border border-border/40 shadow-2xl">
                <div className={cn(
                    "h-1.5 w-full",
                    priority === 'low' && "bg-slate-500",
                    priority === 'medium' && "bg-blue-500",
                    priority === 'high' && "bg-orange-500",
                    priority === 'urgent' && "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                )} />

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <DialogHeader className="space-y-1">
                        <DialogTitle className="text-xl font-bold tracking-tight uppercase">
                            {task ? 'Edit Task' : 'New Task'}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                            {task ? 'Update task details and assignments.' : 'Fill out the details to create a new task.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Task Title</Label>
                            <Input
                                id="title"
                                placeholder="What needs to be done?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-10 text-sm font-semibold bg-muted/20 border-border/40 focus:ring-1 focus:ring-primary/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Add more context..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[100px] text-sm resize-none bg-muted/20 border-border/40 focus:ring-1 focus:ring-primary/20 leading-relaxed"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-1.5">
                                    <Tag className="w-3 h-3" /> Type
                                </Label>
                                <Select value={type} onValueChange={(v: string) => setType(v as CRMTask['type'])}>
                                    <SelectTrigger id="type" className="h-10 bg-muted/20 border-border/40 text-sm">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todo">To-Do</SelectItem>
                                        <SelectItem value="call">Call</SelectItem>
                                        <SelectItem value="meeting">Meeting</SelectItem>
                                        <SelectItem value="email">Email</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priority" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-1.5">
                                    <AlertCircle className="w-3 h-3" /> Priority
                                </Label>
                                <Select value={priority} onValueChange={(v: string) => setPriority(v as TaskPriority)}>
                                    <SelectTrigger id="priority" className="h-10 bg-muted/20 border-border/40 text-sm font-semibold uppercase">
                                        <SelectValue placeholder="Priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low" className="text-slate-500">Low</SelectItem>
                                        <SelectItem value="medium" className="text-blue-500">Medium</SelectItem>
                                        <SelectItem value="high" className="text-orange-500">High</SelectItem>
                                        <SelectItem value="urgent" className="text-red-500 font-bold">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Status</Label>
                                <Select value={status} onValueChange={(v: string) => setStatus(v as TaskStatus)}>
                                    <SelectTrigger id="status" className="h-10 bg-muted/20 border-border/40 text-sm font-medium">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todo">To-Do</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="review">Review</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dueDate" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-1.5">
                                    <Calendar className="w-3 h-3" /> Due Date
                                </Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="h-10 bg-muted/20 border-border/40 text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="assignedTo" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-1.5">
                                    <UserIcon className="w-3 h-3" /> Assign To
                                </Label>
                                <Select value={assignedTo} onValueChange={setAssignedTo}>
                                    <SelectTrigger id="assignedTo" className="h-10 bg-muted/20 border-border/40 text-sm font-medium">
                                        <SelectValue placeholder="Select team member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users?.map((user: any) => {
                                            const displayName = user.displayName ||
                                                (user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : null) ||
                                                user.name ||
                                                (user.email ? user.email.split('@')[0] : 'Unknown User');
                                            return (
                                                <SelectItem key={user.id} value={user.id}>
                                                    {displayName}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="accountId" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-1.5">
                                    <Building className="w-3 h-3" /> Related Account
                                </Label>
                                <Select value={accountId || 'none'} onValueChange={(v) => setAccountId(v === 'none' ? '' : v)}>
                                    <SelectTrigger id="accountId" className="h-10 bg-muted/20 border-border/40 text-sm font-medium">
                                        <SelectValue placeholder="Select account..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none" className="text-muted-foreground italic">None</SelectItem>
                                        {clients?.map((client: any) => (
                                            <SelectItem key={client.id} value={client.id}>
                                                {client.companyName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-[11px] font-bold text-destructive uppercase tracking-wide flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="text-[11px] font-bold uppercase tracking-widest h-11"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground text-[11px] font-bold uppercase tracking-widest px-8 h-11"
                        >
                            {isPending ? (task ? 'Updating...' : 'Creating...') : (task ? 'Update Task' : 'Create Task')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

