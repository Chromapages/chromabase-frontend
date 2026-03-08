'use client';

import { use, useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { useClients, useContacts, useDeals, useTasks, useActivities, useUsers, useProposals } from '@/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, ExternalLink, Mail, Phone, MapPin, Plus, Calendar, CheckSquare, FileText, Clock, Globe, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ROUTES } from '@/constants';
import { DataTable } from '@/components/shared/data-table';
import { format } from 'date-fns';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { Progress } from '@/components/ui/progress';
import { ClientDialog } from '@/components/features/accounts/client-dialog';
import { ProposalList } from '@/components/features/proposals/proposal-list';
import { ContactCard } from '@/components/features/accounts/contact-card';
import { AccountTasksPanel } from '@/components/features/accounts/account-tasks-panel';

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { useGet } = useClients();
    const { useList: useContactsList } = useContacts();
    const { useList: useDealsList } = useDeals();
    const { useList: useActivitiesList } = useActivities();
    const { useList: useProposalsList } = useProposals();
    const { useList: useTasksList } = useTasks();
    const { useList: useUsersList } = useUsers();

    const { data: client, isLoading } = useGet(id);
    const { data: contacts } = useContactsList();
    const { data: deals } = useDealsList();
    const { data: activities } = useActivitiesList();
    const { data: proposals } = useProposalsList();
    const { data: tasks } = useTasksList();
    const { data: users } = useUsersList();

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const clientContacts = useMemo(() => contacts?.filter(c => c.clientId === id) || [], [contacts, id]);
    const clientDeals = useMemo(() => deals?.filter(d => d.clientId === id) || [], [deals, id]);
    const clientProposals = useMemo(() => proposals?.filter(p => p.clientId === id) || [], [proposals, id]);
    const clientActivities = useMemo(() => activities?.filter(a => a.relatedTo?.id === id && a.relatedTo?.type === 'client') || [], [activities, id]);
    const clientTasks = useMemo(() => tasks?.filter(t => t.accountId === id || (t.relatedTo?.id === id && t.relatedTo?.type === 'client')) || [], [tasks, id]);

    const accountManager = useMemo(() => {
        if (!client?.accountManagerId || !users) return null;
        return users.find(u => u.id === client.accountManagerId);
    }, [client?.accountManagerId, users]);

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'meeting': return Calendar;
            case 'email': return Mail;
            case 'call': return Phone;
            case 'note': return FileText;
            default: return Clock;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'meeting': return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
            case 'email': return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
            case 'call': return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300';
            case 'note': return 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300';
            default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const getTaskPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'destructive';
            case 'medium': return 'secondary';
            default: return 'outline';
        }
    };

    const formatCurrency = (value: number | undefined) => (value || 0).toLocaleString();

    const formatDate = (date: any, formatStr: string) => {
        if (!date) return '-';
        try {
            const d = typeof date === 'object' && date !== null && 'toDate' in date ? date.toDate() : new Date(Number(date));
            if (isNaN(d.getTime())) return '-';
            return format(d, formatStr);
        } catch {
            return '-';
        }
    };

    if (isLoading) return <div className="p-6 max-w-7xl mx-auto"><TableSkeleton rows={8} /></div>;
    if (!client) return <div className="p-6 max-w-7xl mx-auto text-center py-20 bg-card rounded-xl border border-dashed mt-6">Account not found</div>;

    const industry = client.industry || 'N/A';
    const totalRevenue = client.totalRevenue || 0;
    const onboardingProgress = client.onboardingProgress || 0;

    // Safety check for Firestore timestamp or number
    const createdAt = typeof client.createdAt === 'object' && client.createdAt !== null && 'toDate' in client.createdAt
        ? (client.createdAt as any).toDate().getTime()
        : (Number(client.createdAt) || Date.now());

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Breadcrumbs & Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Button variant="glass" size="icon" asChild className="h-10 w-10 rounded-sm border-white/5 hover:border-chroma-orange/30 group transition-all">
                        <Link href={ROUTES.ACCOUNTS}>
                            <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-chroma-orange transition-colors" />
                        </Link>
                    </Button>
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/40 font-sans">
                            <Link href={ROUTES.ACCOUNTS} className="hover:text-chroma-orange transition-colors">Accounts Database</Link>
                            <span className="opacity-30">/</span>
                            <span className="text-foreground/60">{client.companyName}</span>
                        </div>
                        <h1 className="text-[32px] font-bold tracking-tight font-display text-foreground uppercase">
                            {client.companyName}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="glass"
                        className="h-12 px-6 border-white/10 text-[10px] uppercase font-bold tracking-[0.2em] rounded-sm hover:border-chroma-orange/30 group transition-all"
                        onClick={() => setIsEditDialogOpen(true)}
                    >
                        <Edit className="w-3.5 h-3.5 mr-2 text-muted-foreground group-hover:text-chroma-orange transition-colors" />
                        Modify Registry
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Side Panels - 4 columns */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Account Stats / Snapshot */}
                    <Card className="glass-md border-white/10 shadow-2xl overflow-hidden rounded-sm bg-black/20">
                        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 font-sans">
                                Portfolio Intelligence
                            </h2>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">Lifecycle</span>
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "h-1.5 w-1.5 rounded-full animate-pulse",
                                            client.status === 'active' ? "bg-emerald-500" : "bg-amber-500"
                                        )} />
                                        <span className="text-[12px] font-bold uppercase tracking-tight text-foreground">
                                            {client.status || 'unknown'}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">Industry Group</span>
                                    <div className="text-[12px] font-bold uppercase tracking-tight text-foreground/80 truncate">
                                        {industry}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30 block mb-1">Estimated Annual Revenue</span>
                                <div className="text-[32px] font-bold tracking-tighter font-display tabular-nums text-foreground">
                                    ${totalRevenue.toLocaleString()}
                                </div>
                            </div>

                            {client.website && (
                                <div className="pt-4 border-t border-white/5">
                                    <a
                                        href={client.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-between p-3 rounded-sm bg-white/5 border border-white/5 hover:border-chroma-orange/20 hover:bg-white/[0.08] transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Globe className="h-4 w-4 text-muted-foreground/40 group-hover:text-chroma-orange transition-colors" />
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors truncate">
                                                {client.website.replace('https://', '').replace('http://', '').split('/')[0]}
                                            </span>
                                        </div>
                                        <ExternalLink className="h-3 w-3 text-muted-foreground/20 group-hover:text-chroma-orange transition-colors" />
                                    </a>
                                </div>
                            )}

                            {client.status === 'onboarding' && (
                                <div className="pt-4 border-t border-white/5 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30 font-sans">Onboarding Readiness</span>
                                        <span className="text-[12px] font-bold font-display tabular-nums text-chroma-orange">{onboardingProgress}%</span>
                                    </div>
                                    <Progress value={onboardingProgress} className="h-1 bg-white/5 [&>div]:bg-chroma-orange shadow-inner" />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Primary Relations / Contact */}
                    {clientContacts.length > 0 && (
                        <Card className="glass-sm border-white/5 shadow-xl rounded-sm bg-black/10">
                            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 font-sans">
                                    Stakeholder Relay
                                </h2>
                                <User className="h-3.5 w-3.5 text-muted-foreground/20" />
                            </div>
                            <CardContent className="p-6">
                                {clientContacts.filter(c => c.isPrimary).slice(0, 1).concat(clientContacts.filter(c => !c.isPrimary).slice(0, 1)).slice(0, 1).map(contact => (
                                    <div key={contact.id} className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-[16px] font-bold text-muted-foreground font-display">
                                                {contact.firstName[0]}{contact.lastName[0]}
                                            </div>
                                            <div>
                                                <div className="text-[16px] font-bold tracking-tight text-foreground uppercase">{contact.firstName} {contact.lastName}</div>
                                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">{contact.jobTitle || 'Executive Staff'}</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 pt-2">
                                            <Button variant="glass" className="w-full justify-start h-10 text-[11px] font-bold border-white/5 hover:border-chroma-orange/20 rounded-sm">
                                                <Mail className="w-3.5 h-3.5 mr-3 text-muted-foreground/40" />
                                                {contact.email}
                                            </Button>
                                            {contact.phone && (
                                                <Button variant="glass" className="w-full justify-start h-10 text-[11px] font-bold border-white/5 hover:border-chroma-orange/20 rounded-sm">
                                                    <Phone className="w-3.5 h-3.5 mr-3 text-muted-foreground/40" />
                                                    {contact.phone}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Main Content Areas - 8 columns */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <Tabs defaultValue="contacts" className="w-full">
                        <TabsList className="bg-white/5 p-1.5 rounded-sm border border-white/10 inline-flex w-full mb-8">
                            <TabsTrigger value="contacts" className="flex-1 py-3 text-[10px] uppercase font-bold tracking-[0.15em] rounded-sm data-[state=active]:bg-white/10 data-[state=active]:text-chroma-orange data-[state=active]:shadow-lg transition-all">
                                RELATIONS ({clientContacts.length})
                            </TabsTrigger>
                            <TabsTrigger value="deals" className="flex-1 py-3 text-[10px] uppercase font-bold tracking-[0.15em] rounded-sm data-[state=active]:bg-white/10 data-[state=active]:text-chroma-orange data-[state=active]:shadow-lg transition-all">
                                PIPELINE ({clientDeals.length})
                            </TabsTrigger>
                            <TabsTrigger value="proposals" className="flex-1 py-3 text-[10px] uppercase font-bold tracking-[0.15em] rounded-sm data-[state=active]:bg-white/10 data-[state=active]:text-chroma-orange data-[state=active]:shadow-lg transition-all">
                                DOCS ({clientProposals.length})
                            </TabsTrigger>
                            <TabsTrigger value="tasks" className="flex-1 py-3 text-[10px] uppercase font-bold tracking-[0.15em] rounded-sm data-[state=active]:bg-white/10 data-[state=active]:text-chroma-orange data-[state=active]:shadow-lg transition-all">
                                OPS ({clientTasks.length})
                            </TabsTrigger>
                            <TabsTrigger value="activity" className="flex-1 py-3 text-[10px] uppercase font-bold tracking-[0.15em] rounded-sm data-[state=active]:bg-white/10 data-[state=active]:text-chroma-orange data-[state=active]:shadow-lg transition-all">
                                TRAIL
                            </TabsTrigger>
                        </TabsList>

                        <div className="min-h-[600px] animate-in slide-in-from-bottom-2 duration-500">
                            <TabsContent value="contacts" className="mt-0 focus-visible:outline-none">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h3 className="text-[18px] font-bold tracking-tight text-foreground uppercase">Key Contacts</h3>
                                            <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest font-sans">Primary stakeholders & delegates</p>
                                        </div>
                                        <Button variant="glass" size="sm" className="h-10 px-6 border-white/10 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                            <Plus className="w-3.5 h-3.5 mr-2 text-chroma-orange" />
                                            Append Relation
                                        </Button>
                                    </div>

                                    {clientContacts.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {clientContacts.map(contact => (
                                                <ContactCard
                                                    key={contact.id}
                                                    contact={contact}
                                                    activities={clientActivities.filter(a => a.description.toLowerCase().includes(contact.firstName.toLowerCase()) || a.description.toLowerCase().includes(String(contact.email).toLowerCase()))}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-64 rounded-sm border border-dashed border-white/10 glass-sm flex items-center justify-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground/20">
                                            Null State: No Contact Entries Found
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="deals" className="mt-0 focus-visible:outline-none">
                                <Card className="glass-md border-white/10 overflow-hidden rounded-sm">
                                    <div className="p-6 flex flex-row items-center justify-between border-b border-white/5 bg-white/[0.02]">
                                        <div className="space-y-1">
                                            <CardTitle className="text-[14px] font-bold uppercase tracking-[0.2em] text-foreground">Revenue Pipeline</CardTitle>
                                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">Active opportunities and forecasted growth</CardDescription>
                                        </div>
                                        <Button size="sm" variant="glass" className="h-10 px-6 border-white/10 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all hover:border-chroma-orange/30">
                                            <Plus className="w-3.5 h-3.5 mr-2 text-chroma-orange" />
                                            Init Deal
                                        </Button>
                                    </div>
                                    <div className="p-0">
                                        {clientDeals.length > 0 ? (
                                            <DataTable
                                                data={clientDeals}
                                                keyExtractor={d => d.id}
                                                columns={[
                                                    {
                                                        header: 'Project Identity',
                                                        cell: d => (
                                                            <div className="font-bold text-[13px] tracking-tight group-hover:text-chroma-orange transition-colors uppercase">
                                                                {d.name}
                                                            </div>
                                                        )
                                                    },
                                                    {
                                                        header: 'Phase',
                                                        cell: d => (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                                                {d.stage.replace('_', ' ')}
                                                            </span>
                                                        )
                                                    },
                                                    {
                                                        header: 'Project Valuation',
                                                        className: 'text-right',
                                                        cell: d => (
                                                            <span className="font-bold text-[14px] font-display tabular-nums tracking-tight">
                                                                ${formatCurrency(d.value)}
                                                            </span>
                                                        )
                                                    },
                                                    {
                                                        header: 'Milestone Date',
                                                        className: 'text-right',
                                                        cell: d => (
                                                            <span className="text-[11px] font-bold text-muted-foreground/40 font-sans">
                                                                {formatDate(d.closeDate, 'MMM d, yyyy')}
                                                            </span>
                                                        )
                                                    }
                                                ]}
                                            />
                                        ) : (
                                            <div className="p-20 text-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground/20">
                                                Zero Delta: No Deals Registered
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="proposals" className="mt-0 focus-visible:outline-none">
                                <ProposalList
                                    proposals={clientProposals}
                                    clients={client ? [client] : []}
                                    isLoading={isLoading}
                                    className="border-none p-0 bg-transparent shadow-none"
                                />
                            </TabsContent>

                            <TabsContent value="tasks" className="mt-0 focus-visible:outline-none">
                                <AccountTasksPanel clientId={id} tasks={clientTasks} />
                            </TabsContent>

                            <TabsContent value="activity" className="mt-0 focus-visible:outline-none">
                                <Card className="glass-md border-white/10 rounded-sm overflow-hidden">
                                    <div className="p-6 bg-white/[0.02] border-b border-white/5">
                                        <CardTitle className="text-[14px] font-bold uppercase tracking-[0.2em]">Operational Audit Trail</CardTitle>
                                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">Sequential log of client interactions</CardDescription>
                                    </div>
                                    <CardContent className="p-8">
                                        {clientActivities.length > 0 ? (
                                            <div className="relative space-y-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5">
                                                {clientActivities.map(activity => {
                                                    const Icon = getActivityIcon(activity.type);
                                                    return (
                                                        <div key={activity.id} className="relative pl-10 group">
                                                            <div className={cn(
                                                                "absolute left-0 top-1 w-8 h-8 rounded-sm flex items-center justify-center z-10 border border-white/5 glass-sm group-hover:border-chroma-orange/20 transition-all",
                                                                getActivityColor(activity.type).split(' ')[0]
                                                            )}>
                                                                <Icon className="w-3.5 h-3.5" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-[13px] font-bold tracking-tight text-foreground group-hover:text-chroma-orange transition-colors">
                                                                    {activity.description}
                                                                </p>
                                                                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/40 font-sans">
                                                                    {formatDate(activity.timestamp, 'MMM d, yyyy • h:mm a')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-20 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/10">
                                                No Logged Activity within Current Epoch
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>

            <ClientDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                client={client}
            />
        </div>
    );
}
