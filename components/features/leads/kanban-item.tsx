'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lead } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Calendar, Eye, GripVertical, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';

interface KanbanItemProps {
    lead: Lead;
}

export function KanbanItem({ lead }: KanbanItemProps) {
    const router = useRouter();

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: lead.id,
        data: {
            type: 'Lead',
            lead,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-40 border-2 border-primary/50 border-dashed rounded-2xl h-[90px] bg-muted/30"
            />
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'border-l-blue-500/50';
            case 'contacted': return 'border-l-amber-500/50';
            case 'proposal_sent': return 'border-l-purple-500/50';
            case 'won': return 'border-l-emerald-500/50';
            default: return 'border-l-white/10';
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative border-l-4 card-surface border border-white/5 rounded-sm p-4 shadow-lg transition-all duration-300 hover:border-primary/40 hover:glass-sm hover:translate-x-1 cursor-grab active:cursor-grabbing",
                getStatusColor(lead.status),
                isDragging && "opacity-50"
            )}
            onClick={(e) => {
                if ((e.target as HTMLElement).closest('.action-button')) return;
                router.push(`${ROUTES.LEADS}/${lead.id}`);
            }}
        >
            <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-bold text-[14px] text-foreground font-display tracking-tight leading-none group-hover:text-primary transition-colors">
                            {lead.companyName}
                        </span>
                        <span className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-[0.1em] mt-1 pr-6 font-sans">
                            {lead.contactName}
                        </span>
                    </div>
                    <div
                        {...attributes}
                        {...listeners}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-white/5 rounded-sm text-muted-foreground/40 absolute top-4 right-2"
                    >
                        <GripVertical className="h-3.5 w-3.5" />
                    </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    <span className="text-[15px] font-bold text-foreground font-display tabular-nums tracking-tighter">
                        ${lead.value.toLocaleString()}
                    </span>
                    <div className="flex items-center text-[9px] uppercase tracking-[0.1em] font-bold text-muted-foreground/40 font-sans">
                        <Clock className="w-2.5 h-2.5 mr-1" />
                        {formatDistanceToNow(lead.updatedAt, { addSuffix: true })}
                    </div>
                </div>
            </div>

            {/* Quick Actions Hover Bar */}
            <div className="absolute inset-x-0 bottom-0 top-0 bg-black/60 backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-sm flex items-center justify-center gap-4 pointer-events-none group-hover:pointer-events-auto border border-primary/20">
                <Button
                    variant="glass"
                    size="icon"
                    className="h-9 w-9 rounded-sm shadow-2xl border border-white/10 action-button hover:bg-primary hover:text-white transition-all transform hover:scale-110"
                    onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `mailto:${lead.contactEmail}`;
                    }}
                >
                    <Mail className="h-4 w-4" />
                </Button>
                <Button
                    variant="glass"
                    size="icon"
                    className="h-9 w-9 rounded-sm shadow-2xl border border-white/10 action-button hover:bg-primary hover:text-white transition-all transform hover:scale-110"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`${ROUTES.CALENDAR}?leadId=${lead.id}`);
                    }}
                >
                    <Calendar className="h-4 w-4" />
                </Button>
                <Button
                    variant="glass"
                    size="icon"
                    className="h-9 w-9 rounded-sm shadow-2xl border border-white/10 action-button hover:bg-primary hover:text-white transition-all transform hover:scale-110"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`${ROUTES.LEADS}/${lead.id}`);
                    }}
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
