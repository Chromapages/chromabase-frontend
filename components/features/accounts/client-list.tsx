'use client';

import { useState } from 'react';
import { DataTable, Column } from '@/components/shared/data-table';
import { Client } from '@/types';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Plus, Search, Filter, Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { ClientDialog } from '@/components/features/accounts/client-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuShortcut,
} from '@/components/ui/context-menu';

interface ClientListProps {
    clients: Client[] | undefined;
    isLoading: boolean;
}

export function ClientList({ clients, isLoading }: ClientListProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    const filteredClients = clients?.filter(c => {
        const companyMatch = c.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
        const industryMatch = c.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
        return companyMatch || industryMatch;
    }) || [];

    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const paginatedClients = filteredClients.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const columns: Column<Client>[] = [
        {
            header: 'Company',
            accessorKey: 'companyName',
            className: 'font-medium'
        },
        {
            header: 'Industry',
            accessorKey: 'industry',
            className: 'text-muted-foreground'
        },
        {
            header: 'Status',
            cell: (client) => {
                const statusConfig = {
                    active: { label: 'Active', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20' },
                    onboarding: { label: 'Onboarding', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20' },
                    inactive: { label: 'Inactive', className: 'bg-muted text-muted-foreground border-border' }
                };
                const config = statusConfig[client.status as keyof typeof statusConfig] || statusConfig.inactive;
                return <Badge className={`capitalize text-xs font-medium border ${config.className}`}>{config.label}</Badge>;
            }
        },
        {
            header: 'Revenue',
            cell: (client) => <span className="text-muted-foreground font-mono text-sm">${((client.totalRevenue || 0) / 1000).toFixed(0)}k</span>
        },
        {
            header: 'Added',
            cell: (client) => {
                const date = typeof client.createdAt === 'object' && client.createdAt !== null && 'toDate' in client.createdAt
                    ? (client.createdAt as any).toDate()
                    : new Date(Number(client.createdAt));
                return <span className="text-muted-foreground text-sm">{format(date, 'MMM d, yyyy')}</span>
            }
        },
        {
            header: '',
            cell: (client) => {
                const [isEditOpen, setIsEditOpen] = useState(false);
                return (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-muted-foreground hover:text-foreground"
                            onClick={() => router.push(`${ROUTES.ACCOUNTS}/${client.id}`)}
                        >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-muted-foreground hover:text-foreground"
                            onClick={() => setEditingClient(client)}
                        >
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            Edit
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`${ROUTES.ACCOUNTS}/${client.id}`)}>
                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEditingClient(client)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Account
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            }
        }
    ];

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search accounts..."
                        className="pl-9 bg-card border-border/50 h-9 text-sm"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                    />
                </div>
                <Button variant="outline" size="sm" onClick={() => console.log('Open advanced filters')} className="h-9 bg-card border-border/50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                </Button>
                <div className="flex-1" />
                <Button onClick={() => setIsDialogOpen(true)} className="h-9 shadow-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Account
                </Button>
            </div>

            {isLoading ? (
                <TableSkeleton rows={5} />
            ) : (
                <DataTable
                    data={paginatedClients}
                    columns={columns}
                    keyExtractor={(c) => c.id}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    onRowClick={(client) => router.push(`${ROUTES.ACCOUNTS}/${client.id}`)}
                    dense={true}
                    contextMenuItems={(client) => (
                        <>
                            <ContextMenuLabel className="text-xs text-muted-foreground font-normal">Actions for {client.companyName}</ContextMenuLabel>
                            <ContextMenuSeparator />
                            <ContextMenuItem onClick={() => router.push(`${ROUTES.ACCOUNTS}/${client.id}`)}>
                                View Details
                            </ContextMenuItem>
                            <ContextMenuItem onClick={() => setEditingClient(client)}>
                                Edit Account
                            </ContextMenuItem>
                            <ContextMenuSeparator />
                            <ContextMenuItem variant="destructive">
                                Delete Account
                                <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
                            </ContextMenuItem>
                        </>
                    )}
                />
            )}

            <ClientDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
            <ClientDialog open={!!editingClient} onOpenChange={(open) => !open && setEditingClient(null)} client={editingClient || undefined} />
        </div>
    );
}
