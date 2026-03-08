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
import { cn } from '@/lib/utils';
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
            header: 'Company / Industry',
            cell: (client) => (
                <div className="flex flex-col gap-1">
                    <span className="text-[14px] font-bold text-foreground font-display tracking-tight group-hover:text-primary transition-colors">
                        {client.companyName}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-muted-foreground/40 font-sans">
                        {client.industry || 'General'}
                    </span>
                </div>
            )
        },
        {
            header: 'Status',
            cell: (client) => {
                const statusConfig = {
                    active: { label: 'ACTIVE', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 glass-sm' },
                    onboarding: { label: 'ONBOARDING', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20 glass-sm' },
                    inactive: { label: 'INACTIVE', className: 'bg-white/5 text-muted-foreground/40 border-white/10 glass-sm' }
                };
                const config = statusConfig[client.status as keyof typeof statusConfig] || statusConfig.inactive;
                return (
                    <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-[0.1em] border',
                        config.className
                    )}>
                        {config.label}
                    </span>
                );
            }
        },
        {
            header: 'Revenue',
            className: 'text-right',
            cell: (client) => (
                <span className="text-[14px] font-bold text-foreground font-display tabular-nums tracking-tight">
                    ${(client.totalRevenue || 0).toLocaleString()}
                </span>
            )
        },
        {
            header: 'Added',
            cell: (client) => {
                const date = typeof client.createdAt === 'object' && client.createdAt !== null && 'toDate' in client.createdAt
                    ? (client.createdAt as any).toDate()
                    : new Date(Number(client.createdAt));
                return (
                    <span className="text-[11px] font-bold text-muted-foreground/40 font-sans">
                        {format(date, 'MMM d, yyyy')}
                    </span>
                );
            }
        },
        {
            header: '',
            className: 'w-[100px] text-right',
            cell: (client) => {
                return (
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" onClick={(e) => e.stopPropagation()}>
                        <Button
                            variant="glass"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground hover:text-primary rounded-sm border-white/5"
                            onClick={() => router.push(`${ROUTES.ACCOUNTS}/${client.id}`)}
                        >
                            <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="glass"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground hover:text-primary rounded-sm border-white/5"
                            onClick={() => setEditingClient(client)}
                        >
                            <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="glass" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary rounded-sm border-white/5">
                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-md border-white/10 shadow-2xl w-48 p-1">
                                <DropdownMenuItem onClick={() => router.push(`${ROUTES.ACCOUNTS}/${client.id}`)} className="text-[11px] font-bold uppercase tracking-wider">
                                    <Eye className="mr-2 h-3.5 w-3.5" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEditingClient(client)} className="text-[11px] font-bold uppercase tracking-wider">
                                    <Edit className="mr-2 h-3.5 w-3.5" /> Edit Account
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/5" />
                                <DropdownMenuItem className="text-destructive text-[11px] font-bold uppercase tracking-wider">
                                    <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Account
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            }
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-sm border border-white/10 glass-sm">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                    <Input
                        type="text"
                        placeholder="SEARCH ACCOUNTS..."
                        className="pl-10 bg-white/5 border-white/10 h-11 text-[11px] font-bold tracking-widest placeholder:text-muted-foreground/20 focus:border-chroma-orange/50 transition-all"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                    />
                </div>
                <Button
                    variant="glass"
                    className="h-11 border-white/10 text-[10px] uppercase font-bold tracking-widest px-6"
                    onClick={() => console.log('Open advanced filters')}
                >
                    <Filter className="h-3.5 w-3.5 mr-2" />
                    Filters
                </Button>
                <div className="flex-1" />
                <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="h-11 px-8 rounded-sm bg-chroma-orange text-white hover:bg-chroma-orange/90 uppercase text-[10px] tracking-[0.2em] font-bold shadow-lg shadow-chroma-orange/20 transition-all"
                >
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
