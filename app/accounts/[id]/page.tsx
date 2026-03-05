'use client';

import { use, useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { useClients, useContacts, useDeals, useTasks, useActivities, useUsers, useProposals } from '@/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, ExternalLink, Mail, Phone, MapPin, Plus, Calendar, CheckSquare, FileText, Clock } from 'lucide-react';
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
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="icon" asChild className="rounded-full shadow-sm bg-card border border-border/50">
                    <Link href={ROUTES.ACCOUNTS}><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <div className="text-sm text-muted-foreground flex items-center">
                    <Link href={ROUTES.ACCOUNTS} className="hover:text-foreground transition-colors">Accounts</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground font-medium">{client.companyName}</span>
                </div>
            </div>

            <PageHeader
                title={client.companyName}
                description={`Account Manager: ${accountManager ? `${accountManager.firstName} ${accountManager.lastName}` : client.accountManagerId || 'Unassigned'} • Since ${format(createdAt, 'MMM yyyy')}`}
            >
                <Button
                    variant="outline"
                    className="bg-card shadow-sm"
                    onClick={() => setIsEditDialogOpen(true)}
                >
                    <Edit className="w-4 h-4 mr-2" /> Edit Account
                </Button>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="shadow-sm border-border/50">
                        <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                            <CardTitle className="text-lg">Account Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <Badge variant={client.status === 'active' ? 'default' : client.status === 'onboarding' ? 'secondary' : 'outline'} className="capitalize">{client.status || 'unknown'}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Industry</span>
                                <span className="font-medium">{industry}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Total Revenue</span>
                                <span className="font-medium text-foreground">${totalRevenue.toLocaleString()}</span>
                            </div>
                            {client.website && (
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Website</span>
                                    <a href={client.website} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1 font-medium">
                                        {client.website.replace('https://', '').replace('http://', '')} <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            )}
                            {client.status === 'onboarding' && (
                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Onboarding</span>
                                        <span className="text-sm font-medium">{onboardingProgress}%</span>
                                    </div>
                                    <Progress value={onboardingProgress} className="h-2" />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {clientContacts.length > 0 && (
                        <Card className="shadow-sm border-border/50">
                            <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                                <CardTitle className="text-lg">Quick Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-4">
                                {clientContacts.filter(c => c.isPrimary).slice(0, 1).map(contact => (
                                    <div key={contact.id} className="space-y-2">
                                        <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                                        <div className="text-muted-foreground text-sm">{contact.jobTitle}</div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail className="w-3 h-3" /> {contact.email}
                                        </div>
                                        {contact.phone && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Phone className="w-3 h-3" /> {contact.phone}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {clientContacts.filter(c => c.isPrimary).length === 0 && clientContacts[0] && (
                                    <div className="space-y-2">
                                        <div className="font-medium">{clientContacts[0].firstName} {clientContacts[0].lastName}</div>
                                        <div className="text-muted-foreground text-sm">{clientContacts[0].jobTitle}</div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail className="w-3 h-3" /> {clientContacts[0].email}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="lg:col-span-2">
                    <Tabs defaultValue="contacts" className="w-full">
                        <TabsList className="mb-4 bg-muted/50 p-1">
                            <TabsTrigger value="contacts" className="rounded-md">Contacts ({clientContacts.length})</TabsTrigger>
                            <TabsTrigger value="deals" className="rounded-md">Deals ({clientDeals.length})</TabsTrigger>
                            <TabsTrigger value="proposals" className="rounded-md">Proposals ({clientProposals.length})</TabsTrigger>
                            <TabsTrigger value="tasks" className="rounded-md">Tasks ({clientTasks.length})</TabsTrigger>
                            <TabsTrigger value="activity" className="rounded-md">Activity</TabsTrigger>
                        </TabsList>

                        <TabsContent value="contacts">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-medium">Contacts</h3>
                                        <p className="text-sm text-muted-foreground">People associated with this account.</p>
                                    </div>
                                    <Button size="sm" className="shadow-sm"><Plus className="w-4 h-4 mr-2" /> Add Contact</Button>
                                </div>

                                {clientContacts.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {clientContacts.map(contact => (
                                            <ContactCard
                                                key={contact.id}
                                                contact={contact}
                                                activities={clientActivities.filter(a => a.description.toLowerCase().includes(contact.firstName.toLowerCase()) || a.description.toLowerCase().includes(String(contact.email).toLowerCase()))}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <Card className="shadow-sm border-border/50 border-dashed">
                                        <div className="p-8 text-center text-muted-foreground">No contacts yet</div>
                                    </Card>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="deals">
                            <Card className="shadow-sm border-border/50 overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between pb-4 bg-muted/20 border-b border-border/50">
                                    <div className="space-y-1">
                                        <CardTitle>Deals & Proposals</CardTitle>
                                        <CardDescription>Opportunities past and present.</CardDescription>
                                    </div>
                                    <Button size="sm" className="shadow-sm"><Plus className="w-4 h-4 mr-2" /> New Deal</Button>
                                </CardHeader>
                                <div className="p-0">
                                    {clientDeals.length > 0 ? (
                                        <DataTable
                                            data={clientDeals}
                                            keyExtractor={d => d.id}
                                            columns={[
                                                { header: 'Name', accessorKey: 'name', className: 'font-medium text-foreground' },
                                                { header: 'Stage', cell: d => <Badge variant="outline" className="capitalize">{d.stage.replace('_', ' ')}</Badge> },
                                                { header: 'Value', cell: d => <span className="font-medium">${formatCurrency(d.value)}</span> },
                                                { header: 'Close Date', cell: d => <span className="text-muted-foreground">{formatDate(d.closeDate, 'MMM d, yyyy')}</span> }
                                            ]}
                                        />
                                    ) : (
                                        <div className="p-8 text-center text-muted-foreground">No deals yet</div>
                                    )}
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="proposals">
                            <ProposalList
                                proposals={clientProposals}
                                clients={client ? [client] : []}
                                isLoading={isLoading}
                            />
                        </TabsContent>

                        <TabsContent value="tasks">
                            <AccountTasksPanel clientId={id} tasks={clientTasks} />
                        </TabsContent>

                        <TabsContent value="activity" className="space-y-4">
                            <Card className="shadow-sm border-border/50">
                                <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
                                    <CardTitle>Activity Timeline</CardTitle>
                                    <CardDescription>Recent activities and interactions.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {clientActivities.length > 0 ? (
                                        <div className="space-y-4">
                                            {clientActivities.map(activity => {
                                                const Icon = getActivityIcon(activity.type);
                                                return (
                                                    <div key={activity.id} className="flex gap-4">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                                                            <Icon className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex-1 space-y-1">
                                                            <p className="text-sm font-medium">{activity.description}</p>
                                                            <p className="text-xs text-muted-foreground">{formatDate(activity.timestamp, 'MMM d, yyyy h:mm a')}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No activities recorded yet
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
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
