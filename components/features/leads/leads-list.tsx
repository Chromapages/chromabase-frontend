'use client';

import { Lead } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Calendar, Eye, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';

interface LeadsListProps {
    leads: Lead[];
}

export function LeadsList({ leads }: LeadsListProps) {
    const router = useRouter();

    if (leads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border/40 rounded-xl bg-card/20">
                <p className="text-muted-foreground text-sm font-medium">No leads matching your filters.</p>
            </div>
        );
    }

    return (
        <div className="bg-card/40 backdrop-blur-md border border-border/40 rounded-xl shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/20">
                    <TableRow className="hover:bg-transparent border-border/40">
                        <TableHead className="w-[280px] font-semibold text-[11px] uppercase tracking-wider h-10">Company / Contact</TableHead>
                        <TableHead className="font-semibold text-[11px] uppercase tracking-wider h-10">Status</TableHead>
                        <TableHead className="font-semibold text-[11px] uppercase tracking-wider h-10 text-right">Value</TableHead>
                        <TableHead className="font-semibold text-[11px] uppercase tracking-wider h-10">Assigned To</TableHead>
                        <TableHead className="font-semibold text-[11px] uppercase tracking-wider h-10">Last Updated</TableHead>
                        <TableHead className="w-[100px] text-right font-semibold text-[11px] uppercase tracking-wider h-10">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leads.map((lead) => (
                        <TableRow
                            key={lead.id}
                            className="group cursor-pointer hover:bg-primary/5 transition-colors border-border/40"
                            onClick={() => router.push(`${ROUTES.LEADS}/${lead.id}`)}
                        >
                            <TableCell className="py-2.5">
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm text-foreground leading-tight">{lead.companyName}</span>
                                    <span className="text-[11px] text-muted-foreground">{lead.contactName}</span>
                                </div>
                            </TableCell>
                            <TableCell className="py-2.5">
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border",
                                    lead.status === 'new' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                        lead.status === 'contacted' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                            lead.status === 'meeting_scheduled' ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" :
                                                lead.status === 'proposal_sent' ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                                                    lead.status === 'won' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                        lead.status === 'lost' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                                                            "bg-muted/50 text-muted-foreground border-border/40"
                                )}>
                                    {lead.status}
                                </span>
                            </TableCell>
                            <TableCell className="py-2.5 text-right font-semibold text-sm">
                                ${lead.value.toLocaleString()}
                            </TableCell>
                            <TableCell className="py-2.5">
                                <span className="text-xs text-muted-foreground">{lead.assignedTo || 'Unassigned'}</span>
                            </TableCell>
                            <TableCell className="py-2.5 text-xs text-muted-foreground">
                                {formatDistanceToNow(lead.updatedAt, { addSuffix: true })}
                            </TableCell>
                            <TableCell className="py-2.5 text-right">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.location.href = `mailto:${lead.contactEmail}`;
                                        }}
                                    >
                                        <Mail className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
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
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
