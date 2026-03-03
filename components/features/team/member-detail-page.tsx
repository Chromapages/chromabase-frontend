'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/layout/page-header';
import {
    Users as UsersIcon,
    Target,
    Clock,
    Mail,
    Briefcase,
    ArrowLeft,
    MoreHorizontal,
    Edit,
    Trash2,
    CheckCircle2,
    TrendingUp,
    Calendar
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUsers, useLeads, useTasks } from '@/hooks';
import { UserDialog } from './user-dialog';
import { format } from 'date-fns';

interface MemberDetailPageProps {
    id: string;
}

export function MemberDetailPage({ id }: MemberDetailPageProps) {
    const router = useRouter();
    const { useGet } = useUsers();
    const { useList: useLeadsList } = useLeads();
    const { useList: useTasksList } = useTasks();

    const { data: user, isLoading: isUserLoading } = useGet(id);
    const { data: allLeads, isLoading: isLeadsLoading } = useLeadsList();
    const { data: allTasks, isLoading: isTasksLoading } = useTasksList();

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    if (isUserLoading) {
        return (
            <div className="p-6 space-y-6 animate-pulse">
                <div className="h-48 bg-muted/50 rounded-xl" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-64 bg-muted/50 rounded-xl col-span-2" />
                    <div className="h-64 bg-muted/50 rounded-xl" />
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-12 text-center">
                <h2 className="text-2xl font-bold">Member not found</h2>
                <Button variant="link" onClick={() => router.back()} className="mt-4">
                    Go Back
                </Button>
            </div>
        );
    }

    const assignedLeads = (allLeads || []).filter(l => l.assignedTo === user.id);
    const assignedTasks = (allTasks || []).filter(t => t.assignedTo === user.id);
    const wonLeads = assignedLeads.filter(l => l.status === 'won');
    const winRate = assignedLeads.length > 0 ? Math.round((wonLeads.length / assignedLeads.length) * 100) : 0;

    const displayName = `${user.firstName} ${user.lastName}`;
    const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || '??';

    const getRoleColor = (role?: string) => {
        switch (role) {
            case 'admin': return 'bg-destructive/10 text-destructive';
            case 'sales_manager': return 'bg-primary/10 text-primary';
            case 'account_manager': return 'bg-blue-500/10 text-blue-500';
            case 'marketing': return 'bg-amber-500/10 text-amber-500';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Team Hub
            </Button>

            {/* Profile Overview Card */}
            <Card className="border-none shadow-sm bg-card/50 backdrop-blur-xl overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary/20 via-blue-500/10 to-transparent" />
                <div className="px-8 pb-8 -mt-12 relative flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                    <Avatar className="w-24 h-24 border-4 border-card rounded-2xl shadow-lg shrink-0">
                        <AvatarImage src={user.avatarUrl || ''} />
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary">{initials}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">{displayName}</h1>
                            <Badge className={`${getRoleColor(user.role)} capitalize`}>
                                {(user.role || 'Member').replace('_', ' ')}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-4">
                            <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {user.email}</span>
                            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Joined {format(user.createdAt, 'MMM yyyy')}</span>
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={() => setIsEditDialogOpen(true)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Deactivate Member
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats & Performance */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Performance Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Lead Win Rate</span>
                                    <span className="font-semibold">{winRate}%</span>
                                </div>
                                <Progress value={winRate} className="h-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                                    <div className="text-muted-foreground text-xs uppercase mb-1">Total Leads</div>
                                    <div className="text-2xl font-bold">{assignedLeads.length}</div>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                                    <div className="text-muted-foreground text-xs uppercase mb-1">Won Leads</div>
                                    <div className="text-2xl font-bold">{wonLeads.length}</div>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                                    <div className="text-muted-foreground text-xs uppercase mb-1">Open Tasks</div>
                                    <div className="text-2xl font-bold">{assignedTasks.filter(t => t.status !== 'completed').length}</div>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                                    <div className="text-muted-foreground text-xs uppercase mb-1">Completed</div>
                                    <div className="text-2xl font-bold">{assignedTasks.filter(t => t.status === 'completed').length}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Recent Accomplishments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {wonLeads.slice(0, 3).map(lead => (
                                    <div key={lead.id} className="flex gap-3 text-sm">
                                        <div className="mt-0.5 h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                            <TrendingUp className="h-3 w-3 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Closed Deal with {lead.companyName}</p>
                                            <p className="text-muted-foreground text-xs">${lead.value.toLocaleString()} Deal • {format(lead.updatedAt, 'MMM d, yyyy')}</p>
                                        </div>
                                    </div>
                                ))}
                                {wonLeads.length === 0 && (
                                    <p className="text-center text-muted-foreground py-4 text-sm italic">No recent wins recorded.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Activity Tabs */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="leads" className="w-full">
                        <TabsList className="bg-muted/50 w-fit p-1 mb-6">
                            <TabsTrigger value="leads" className="px-6">Leads ({assignedLeads.length})</TabsTrigger>
                            <TabsTrigger value="tasks" className="px-6">Tasks ({assignedTasks.length})</TabsTrigger>
                            <TabsTrigger value="activity" className="px-6">History</TabsTrigger>
                        </TabsList>

                        <TabsContent value="leads" className="mt-0">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {assignedLeads.map(lead => (
                                            <div key={lead.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors group cursor-pointer" onClick={() => router.push(`/leads/${lead.id}`)}>
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-bold">
                                                        {lead.companyName?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">{lead.companyName}</h4>
                                                        <p className="text-sm text-muted-foreground">{lead.contactName} • ${lead.value.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className="capitalize">{lead.status.replace('_', ' ')}</Badge>
                                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </div>
                                        ))}
                                        {assignedLeads.length === 0 && (
                                            <div className="text-center py-12 text-muted-foreground">
                                                No leads assigned to this member.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="tasks" className="mt-0">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {assignedTasks.map(task => (
                                            <div key={task.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${task.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                                                        <CheckCircle2 className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className={`font-semibold ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>{task.title}</h4>
                                                        <p className="text-sm text-muted-foreground">Due {task.dueDate ? format(task.dueDate, 'MMM d') : 'No due date'}</p>
                                                    </div>
                                                </div>
                                                <Badge variant={task.priority === 'high' || task.priority === 'urgent' ? 'destructive' : 'secondary'} className="capitalize">{task.priority}</Badge>
                                            </div>
                                        ))}
                                        {assignedTasks.length === 0 && (
                                            <div className="text-center py-12 text-muted-foreground">
                                                No active tasks for this member.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="activity" className="mt-0">
                            <Card>
                                <CardContent className="p-12 text-center text-muted-foreground">
                                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p>Detailed activity history is coming soon.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <UserDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                user={user}
            />
        </div>
    );
}
