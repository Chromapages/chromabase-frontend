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
    new: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    contacted: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    meeting_scheduled: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    proposal_sent: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    won: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    lost: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
};

const statusLabel: Record<string, string> = {
    new: 'New',
    contacted: 'Contacted',
    meeting_scheduled: 'Meeting',
    proposal_sent: 'Proposal',
    won: 'Won',
    lost: 'Lost',
};

export function LeadsList({ leads }: LeadsListProps) {
    const router = useRouter();

    if (leads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border/50 rounded-xl bg-card/30 text-center">
                <p className="text-[13px] text-muted-foreground font-medium">
                    No leads match your filters.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border/50 bg-muted/30">
                        <TableHead className="h-10 text-label-micro text-muted-foreground/60 w-[260px]">Company / Contact</TableHead>
                        <TableHead className="h-10 text-label-micro text-muted-foreground/60">Status</TableHead>
                        <TableHead className="h-10 text-label-micro text-muted-foreground/60 text-right">Value</TableHead>
                        <TableHead className="h-10 text-label-micro text-muted-foreground/60">Assigned To</TableHead>
                        <TableHead className="h-10 text-label-micro text-muted-foreground/60">Updated</TableHead>
                        <TableHead className="h-10 w-[80px] text-right text-label-micro text-muted-foreground/60">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {leads.map((lead) => (
                        <ContextMenu key={lead.id}>
                            <ContextMenuTrigger asChild>
                                <TableRow
                                    className="group cursor-pointer hover:bg-muted/40 transition-colors border-b border-border/30 last:border-0"
                                    onClick={() => router.push(`${ROUTES.LEADS}/${lead.id}`)}
                                >
                                    <TableCell className="py-3">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[13px] font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                                                {lead.companyName}
                                            </span>
                                            <span className="text-[11px] text-muted-foreground/70">
                                                {lead.contactName}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-3">
                                        <span className={cn(
                                            'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border',
                                            statusStyles[lead.status] ?? 'bg-muted/60 text-muted-foreground border-border/40'
                                        )}>
                                            {statusLabel[lead.status] ?? lead.status}
                                        </span>
                                    </TableCell>

                                    <TableCell className="py-3 text-right">
                                        <span className="text-[13px] font-semibold text-foreground tabular-nums">
                                            ${lead.value.toLocaleString()}
                                        </span>
                                    </TableCell>

                                    <TableCell className="py-3">
                                        <span className="text-[12px] text-muted-foreground/70">
                                            {lead.assignedTo || '—'}
                                        </span>
                                    </TableCell>

                                    <TableCell className="py-3">
                                        <span className="text-[12px] text-muted-foreground/60">
                                            {formatDistanceToNow(lead.updatedAt, { addSuffix: true })}
                                        </span>
                                    </TableCell>

                                    <TableCell className="py-3 text-right">
                                        <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.location.href = `mailto:${lead.contactEmail}`;
                                                }}
                                                title="Send email"
                                            >
                                                <Mail className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`${ROUTES.CALENDAR}?leadId=${lead.id}`);
                                                }}
                                                title="Schedule meeting"
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
