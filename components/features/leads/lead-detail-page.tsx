'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
    ChevronLeft, Edit, MoreHorizontal, Mail, Phone,
    Globe, User, Calendar, DollarSign, ArrowRight,
    CheckCircle2, Clock, AlertCircle, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/layout/page-header';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { LeadDialog } from './lead-dialog';
import { Lead, LeadStatus, Client } from '@/types';
import { useLeads, useUsers, useClients } from '@/hooks';
import { ROUTES } from '@/constants';

interface LeadDetailPageProps {
    id: string;
}

const STAGES: { value: LeadStatus; label: string; progress: number }[] = [
    { value: 'new', label: 'New Lead', progress: 15 },
    { value: 'contacted', label: 'Contacted', progress: 35 },
    { value: 'meeting_scheduled', label: 'Meeting', progress: 55 },
    { value: 'proposal_sent', label: 'Proposal', progress: 75 },
    { value: 'won', label: 'Closed Won', progress: 100 },
    { value: 'lost', label: 'Closed Lost', progress: 100 },
];

export function LeadDetailPage({ id }: LeadDetailPageProps) {
    const router = useRouter();
    const { useGet } = useLeads();
    const { data: lead, isLoading } = useGet(id);
    const { useUpdate: useUpdateLead, useDelete: useDeleteLead } = useLeads();
    const updateLeadMutation = useUpdateLead();
    const deleteLeadMutation = useDeleteLead();
    const { useCreate: useCreateClient } = useClients();
    const createClientMutation = useCreateClient();

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const { useGet: useGetUser } = useUsers();
    const { data: assignee } = useGetUser(lead?.assignedTo || '');

    const handleStatusUpdate = (newStatus: LeadStatus) => {
        if (!lead) return;
        updateLeadMutation.mutate({ id: lead.id, data: { status: newStatus } });
    };

    const handleDeleteLead = () => {
        if (!lead) return;
        deleteLeadMutation.mutate(lead.id, {
            onSuccess: () => router.push(ROUTES.LEADS)
        });
    };

    const handleConvertLead = () => {
        if (!lead) return;

        createClientMutation.mutate({
            companyName: lead.companyName,
            status: 'onboarding',
            totalRevenue: lead.value,
            industry: 'CRM Lead',
            addedDate: Date.now()
        } as any, {
            onSuccess: (newClient) => {
                updateLeadMutation.mutate({ id: lead.id, data: { status: 'won' } });
                router.push(`${ROUTES.ACCOUNTS}/${newClient.id}`);
            }
        });
    };

    if (isLoading) {
        return (
            <div className="p-8 space-y-6 animate-pulse">
                <div className="h-8 w-64 bg-muted rounded" />
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 h-[400px] bg-muted rounded" />
                    <div className="h-[400px] bg-muted rounded" />
                </div>
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <AlertCircle className="w-12 h-12 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Lead not found</h2>
                <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    const currentStageIndex = STAGES.findIndex(s => s.value === lead.status);
    const currentStage = STAGES[currentStageIndex] || STAGES[0];

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            {/* Navigation & Actions */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" className="-ml-2 text-muted-foreground" onClick={() => router.back()}>
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Pipeline
                </Button>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Lead
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="text-primary font-medium" onClick={handleConvertLead}>
                                <ArrowRight className="w-4 h-4 mr-2" />
                                Convert to Account
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Lead
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Lead?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this lead? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteLead} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-3xl border bg-card/50 backdrop-blur-xl p-8 transition-all">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />

                <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors uppercase tracking-wider text-[10px] font-bold py-0.5 px-2">
                                {lead.source}
                            </Badge>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3 mr-1" />
                                Created {format(lead.createdAt, 'MMM d, yyyy')}
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight mb-1">{lead.companyName}</h1>
                        <p className="text-xl text-muted-foreground">{lead.contactName}</p>
                    </div>

                    <div className="text-left md:text-right">
                        <div className="text-sm text-muted-foreground mb-1">Estimated Value</div>
                        <div className="text-3xl font-bold text-primary">${lead.value.toLocaleString()}</div>
                    </div>
                </div>

                {/* Pipeline Progress */}
                <div className="mt-12 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">Pipeline Status: <span className="text-primary">{currentStage.label}</span></div>
                        <div className="text-sm text-muted-foreground">{currentStage.progress}% toward closing</div>
                    </div>
                    <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${currentStage.progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between w-full pt-2">
                        {STAGES.slice(0, 5).map((stage, idx) => {
                            const isActive = idx <= currentStageIndex;
                            const isCurrent = idx === currentStageIndex;
                            return (
                                <div key={stage.value} className="flex flex-col items-center">
                                    <div className={`w-3 h-3 rounded-full mb-2 transition-colors duration-500 ${isCurrent ? 'bg-primary ring-4 ring-primary/20' : isActive ? 'bg-primary/60' : 'bg-muted'}`} />
                                    <span className={`text-[10px] uppercase tracking-tighter font-semibold ${isActive ? 'text-foreground' : 'text-muted-foreground/60'}`}>
                                        {stage.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 mb-6 gap-6">
                            <TabsTrigger value="overview" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-0 py-2 text-sm font-medium transition-all">
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="activity" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-0 py-2 text-sm font-medium transition-all">
                                Activity Feed
                            </TabsTrigger>
                            <TabsTrigger value="notes" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-0 py-2 text-sm font-medium transition-all">
                                Notes
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-0 outline-none">
                            <Card className="border-none bg-card/30 backdrop-blur-sm shadow-none">
                                <CardContent className="p-0 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold border-b pb-2">Contact Details</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-primary/5 text-primary">
                                                        <Mail className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-muted-foreground">Email</div>
                                                        <div className="text-sm font-medium">{lead.contactEmail}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-primary/5 text-primary">
                                                        <Phone className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-muted-foreground">Phone</div>
                                                        <div className="text-sm font-medium">{lead.contactPhone || 'No phone provided'}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-primary/5 text-primary">
                                                        <Globe className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-muted-foreground">Source</div>
                                                        <div className="text-sm font-medium">{lead.source}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold border-b pb-2">Assignment</h3>
                                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-dashed">
                                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {assignee?.firstName?.[0] || lead.assignedTo?.[0] || '?'}
                                                </div>
                                                <div>
                                                    <div className="text-xs text-muted-foreground">Assigned To</div>
                                                    <div className="font-semibold">{assignee ? `${assignee.firstName} ${assignee.lastName}` : lead.assignedTo === 'unassigned' ? 'Not Assigned' : lead.assignedTo}</div>
                                                    <div className="text-[10px] text-muted-foreground uppercase">{assignee?.role || ''}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold border-b pb-2">Lead Notes</h3>
                                        <div className="p-4 rounded-xl bg-muted/50 text-sm leading-relaxed whitespace-pre-wrap min-h-[100px]">
                                            {lead.notes || 'No implementation notes for this lead.'}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="activity" className="mt-0 outline-none">
                            <div className="space-y-4">
                                <div className="p-4 text-center border rounded-xl border-dashed">
                                    <Clock className="w-8 h-8 mx-auto text-muted-foreground opacity-20 mb-2" />
                                    <p className="text-sm text-muted-foreground">Activity history will be implemented in the next phase.</p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="notes" className="mt-0 outline-none">
                            <div className="flex flex-col gap-4">
                                <textarea
                                    className="w-full min-h-[200px] p-4 rounded-xl bg-muted/30 border-none outline-none resize-none text-sm"
                                    placeholder="Take notes about this lead..."
                                />
                                <Button className="self-end">Save Note</Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-6">
                    <Card className="border-none bg-card/50 backdrop-blur-xl shadow-xl shadow-black/5 rounded-3xl overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Next Action</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3 p-3 rounded-2xl bg-primary/5 border border-primary/10">
                                <Clock className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <div className="font-bold text-sm">Schedule Initial Call</div>
                                    <p className="text-xs text-muted-foreground">Lead created {formatDistanceToNow(lead.createdAt, { addSuffix: true })}</p>
                                </div>
                            </div>
                            <Button
                                className="w-full rounded-xl shadow-lg shadow-primary/20"
                                onClick={() => handleStatusUpdate('contacted')}
                                disabled={lead.status === 'contacted' || lead.status === 'won'}
                            >
                                {lead.status === 'new' ? 'Mark as Contacted' : lead.status === 'won' ? 'Convert Successful' : 'Update Status'}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-card/50 backdrop-blur-xl shadow-xl shadow-black/5 rounded-3xl overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Lead Integrity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span className="text-xs">Valid contact email</span>
                            </div>
                            <div className={`flex items-center gap-3 ${lead.contactPhone ? 'text-green-500' : 'text-amber-500'}`}>
                                {lead.contactPhone ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                <span className="text-xs text-foreground">{lead.contactPhone ? 'Phone number provided' : 'Missing phone number'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-green-500">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-xs text-foreground">Assigned to {lead.assignedTo !== 'unassigned' ? 'active member' : 'waiting for assignment'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <LeadDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                lead={lead}
            />
        </div>
    );
}

function formatDistanceToNow(date: number, options?: { addSuffix?: boolean }) {
    const now = Date.now();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ${options?.addSuffix ? 'ago' : ''}`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ${options?.addSuffix ? 'ago' : ''}`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ${options?.addSuffix ? 'ago' : ''}`;
}
