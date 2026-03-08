'use client';

import { Lead } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Mail, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';

interface LeadsListProps {
    leads: Lead[];
}

/* Status pill — Swiss semantic colour system */
const statusStyles: Record<string, string> = {
    new: 'bg-blue-500/10 text-blue-500 border-blue-500/20 glass-sm',
    contacted: 'bg-amber-500/10 text-amber-500 border-amber-500/20 glass-sm',
    meeting_scheduled: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 glass-sm',
    proposal_sent: 'bg-purple-500/10 text-purple-500 border-purple-500/20 glass-sm',
    won: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 glass-sm',
    lost: 'bg-rose-500/10 text-rose-500 border-rose-500/20 glass-sm',
};

const statusLabel: Record<string, string> = {
    new: 'NEW',
    contacted: 'CONTACTED',
    meeting_scheduled: 'MEETING',
    proposal_sent: 'PROPOSAL',
    won: 'WON',
    lost: 'LOST',
};

export function LeadsList({ leads }: LeadsListProps) {
    const router = useRouter();

    if (leads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 glass-sm border border-dashed border-white/10 rounded-sm text-center">
                <p className="text-[12px] text-muted-foreground/40 font-bold uppercase tracking-[0.2em]">
                    NO LEADS MATCH YOUR FILTERS.
                </p>
            </div>
        );
    }

    return (
        <div className="glass-md border border-white/10 rounded-sm overflow-hidden shadow-2xl">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-white/5 bg-white/5">
                        <TableHead className="h-10 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/40 font-sans w-[260px]">Company / Contact</TableHead>
                        <TableHead className="h-10 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/40 font-sans">Status</TableHead>
                        <TableHead className="h-10 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/40 font-sans text-right">Value</TableHead>
                        <TableHead className="h-10 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/40 font-sans">Assigned</TableHead>
                        <TableHead className="h-10 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/40 font-sans">Updated</TableHead>
                        <TableHead className="h-10 w-[100px] text-right text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/40 font-sans">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {leads.map((lead) => (
                        <ContextMenu key={lead.id}>
                            <ContextMenuTrigger asChild>
                                <TableRow
                                    className="group cursor-pointer hover:bg-white/5 transition-all border-b border-white/5 last:border-0"
                                    onClick={() => router.push(`${ROUTES.LEADS}/${lead.id}`)}
                                >
                                    <TableCell className="py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[14px] font-bold text-foreground font-display tracking-tight group-hover:text-primary transition-colors">
                                                {lead.companyName}
                                            </span>
                                            <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-muted-foreground/40 font-sans">
                                                {lead.contactName}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <span className={cn(
                                            'inline-flex items-center px-2.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-[0.1em] border border-white/10',
                                            statusStyles[lead.status] ?? 'bg-white/5 text-muted-foreground/40'
                                        )}>
                                            {statusLabel[lead.status] ?? lead.status.toUpperCase()}
                                        </span>
                                    </TableCell>

                                    <TableCell className="py-4 text-right">
                                        <span className="text-[14px] font-bold text-foreground font-display tabular-nums tracking-tight">
                                            ${lead.value.toLocaleString()}
                                        </span>
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <span className="text-[11px] font-bold text-muted-foreground/60 font-sans">
                                            {lead.assignedTo || '—'}
                                        </span>
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <span className="text-[11px] font-bold text-muted-foreground/40 font-sans">
                                            {formatDistanceToNow(lead.updatedAt, { addSuffix: true })}
                                        </span>
                                    </TableCell>

                                    <TableCell className="py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            <Button
                                                variant="glass"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary rounded-sm border-white/5 h-9 w-9"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.location.href = `mailto:${lead.contactEmail}`;
                                                }}
                                            >
                                                <Mail className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="glass"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary rounded-sm border-white/5 h-9 w-9"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`${ROUTES.CALENDAR}?leadId=${lead.id}`);
                                                }}
                                            >
                                                <Calendar className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </ContextMenuTrigger>
                            <ContextMenuContent className="w-48">
                                <ContextMenuLabel className="text-xs text-muted-foreground font-normal">Actions for {lead.companyName}</ContextMenuLabel>
                                <ContextMenuSeparator />
                                <ContextMenuItem onClick={() => router.push(`${ROUTES.LEADS}/${lead.id}`)}>
                                    View Details
                                </ContextMenuItem>
                                <ContextMenuItem onClick={() => router.push(`${ROUTES.LEADS}/${lead.id}/edit`)}>
                                    Edit Lead
                                </ContextMenuItem>
                                <ContextMenuSeparator />
                                <ContextMenuItem onClick={() => window.location.href = `mailto:${lead.contactEmail}`}>
                                    Send Email
                                </ContextMenuItem>
                                <ContextMenuItem onClick={() => router.push(`${ROUTES.CALENDAR}?leadId=${lead.id}`)}>
                                    Schedule Meeting
                                </ContextMenuItem>
                                <ContextMenuSeparator />
                                <ContextMenuItem variant="destructive">
                                    Delete Lead
                                    <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
                                </ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
