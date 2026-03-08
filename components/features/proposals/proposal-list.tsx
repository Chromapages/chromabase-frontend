'use client';

import { useState } from 'react';
import { DataTable, Column } from '@/components/shared/data-table';
import { FilterBar } from '@/components/shared/filter-bar';
import { Proposal, ProposalStatus, Client } from '@/types';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Plus, Eye, Download, MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useProposals } from '@/hooks';
import { ProposalDialog } from '@/components/features/proposals/proposal-dialog';

interface ProposalListProps {
    proposals: Proposal[] | undefined;
    clients: Client[] | undefined;
    isLoading: boolean;
}

export function ProposalList({ proposals, clients, isLoading }: ProposalListProps) {
    const { useUpdate } = useProposals();
    const updateProposal = useUpdate();

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<ProposalStatus | 'all'>('all');
    const [page, setPage] = useState(1);
    const itemsPerPage = 8;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState<Proposal | undefined>(undefined);

    const handleEdit = (proposal: Proposal) => {
        setSelectedProposal(proposal);
        setIsDialogOpen(true);
    };

    const handleStatusUpdate = (proposal: Proposal, newStatus: ProposalStatus) => {
        updateProposal.mutate({ id: proposal.id, data: { status: newStatus, updatedAt: Date.now() } });
    };

    const filteredProposals = proposals?.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    }) || [];

    const totalPages = Math.ceil(filteredProposals.length / itemsPerPage);
    const paginatedProposals = filteredProposals.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const getClientName = (clientId: string) => {
        return clients?.find(c => c.id === clientId)?.companyName || 'Unknown Client';
    };

    const columns: Column<Proposal>[] = [
        {
            header: 'Proposal Title',
            accessorKey: 'title',
            className: 'font-semibold text-primary'
        },
        {
            header: 'Client',
            cell: (prop) => (
                <div className="flex flex-col">
                    <span className="font-medium">{getClientName(prop.clientId)}</span>
                    <span className="text-xs text-muted-foreground italic">ID: {prop.clientId}</span>
                </div>
            )
        },
        {
            header: 'Value',
            cell: (prop) => (
                <span className="text-right font-mono font-medium text-emerald-600 dark:text-emerald-400">
                    ${prop.value.toLocaleString()}
                </span>
            )
        },
        {
            header: 'Status',
            cell: (prop) => {
                const statusStyles: Record<ProposalStatus, string> = {
                    draft: 'bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200',
                    sent: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400',
                    under_review: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
                    approved: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400',
                    rejected: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400',
                    expired: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200',
                };

                return (
                    <Badge variant="outline" className={`${statusStyles[prop.status]} border font-medium capitalize shadow-none py-0.5`}>
                        {prop.status.replace('_', ' ')}
                    </Badge>
                );
            }
        },
        {
            header: 'Valid Until',
            cell: (prop) => (
                <span className="text-muted-foreground text-sm">
                    {format(prop.validUntil, 'MMM dd, yyyy')}
                </span>
            )
        },
        {
            header: '',
            cell: (prop) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            <MoreHorizontal className="h-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleEdit(prop)}>
                            <Eye className="mr-2 h-4 w-4" /> View / Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-emerald-600 dark:text-emerald-400 cursor-pointer"
                            onClick={() => handleStatusUpdate(prop, 'approved')}
                        >
                            Approve Proposal
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive cursor-pointer"
                            onClick={() => handleStatusUpdate(prop, 'rejected')}
                        >
                            Reject Proposal
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 p-6 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 rounded-2xl">
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Pipeline Value</p>
                    <h3 className="text-2xl font-bold mt-1 text-zinc-900 dark:text-zinc-50">
                        ${proposals?.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">Total value across {proposals?.length} open proposals</p>
                </div>
                <div className="col-span-1 p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Approval Rate</p>
                    <h3 className="text-2xl font-bold mt-1 text-zinc-900 dark:text-zinc-50">72%</h3>
                    <p className="text-xs text-muted-foreground mt-1">+5% from last month</p>
                </div>
                <div className="col-span-1 p-6 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl">
                    <p className="text-sm font-medium text-zinc-500">Average Review Time</p>
                    <h3 className="text-2xl font-bold mt-1 text-zinc-900 dark:text-zinc-50">4.2 Days</h3>
                    <p className="text-xs text-muted-foreground mt-1">From sent to decision</p>
                </div>
            </div>

            <FilterBar
                searchQuery={searchQuery}
                onSearchChange={(v) => { setSearchQuery(v); setPage(1); }}
                searchPlaceholder="Search proposals by title or client..."
                actionButton={{
                    label: 'New Proposal',
                    onClick: () => {
                        setSelectedProposal(undefined);
                        setIsDialogOpen(true);
                    },
                    icon: Plus
                }}
            />

            {isLoading ? (
                <div className="space-y-4">
                    <TableSkeleton rows={5} />
                </div>
            ) : (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm shadow-zinc-200/50 dark:shadow-none">
                    {filteredProposals.length === 0 ? (
                        <div className="p-20 text-center space-y-3">
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                                <Plus className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold">No proposals found</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                                Create your first proposal to start tracking client approvals and high-value deals.
                            </p>
                        </div>
                    ) : (
                        <DataTable
                            data={paginatedProposals}
                            columns={columns}
                            keyExtractor={(p) => p.id}
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    )}
                </div>
            )}

            <ProposalDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                proposal={selectedProposal}
            />
        </div>
    );
}
