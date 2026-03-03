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
                className="opacity-30 border-2 border-primary/50 border-dashed rounded-lg h-[84px] bg-muted/20"
            />
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'border-l-blue-500';
            case 'contacted': return 'border-l-amber-500';
            case 'proposal_sent': return 'border-l-purple-500';
            case 'won': return 'border-l-emerald-500';
            default: return 'border-l-muted-foreground/30';
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative border-l-3 bg-card/60 backdrop-blur-sm border border-border/40 rounded-lg p-2.5 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md cursor-grab active:cursor-grabbing",
                getStatusColor(lead.status),
                isDragging && "opacity-50"
            )}
            onClick={(e) => {
                if ((e.target as HTMLElement).closest('.action-button')) return;
                router.push(`${ROUTES.LEADS}/${lead.id}`);
            }}
        >
            <div className="flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-semibold text-[13px] text-foreground leading-tight truncate">
                            {lead.companyName}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium truncate">
                            {lead.contactName}
                        </span>
                    </div>
                    <div
                        {...attributes}
                        {...listeners}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-muted rounded text-muted-foreground/50"
                    >
                        <GripVertical className="h-3.5 w-3.5" />
                    </div>
                </div>

                <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[12px] font-bold text-foreground/90">
                        ${lead.value.toLocaleString()}
                    </span>
                    <div className="flex items-center text-[10px] text-muted-foreground font-medium">
                        <Clock className="w-2.5 h-2.5 mr-1 opacity-60" />
                        {formatDistanceToNow(lead.updatedAt, { addSuffix: true })}
                    </div>
                </div>
            </div>

            {/* Quick Actions Hover Bar */}
            <div className="absolute inset-0 bg-primary/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg flex items-center justify-center gap-2 pointer-events-none group-hover:pointer-events-auto">
                <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow-lg border border-border/40 action-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `mailto:${lead.contactEmail}`;
                    }}
                >
                    <Mail className="h-4 w-4" />
                </Button>
                <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow-lg border border-border/40 action-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`${ROUTES.CALENDAR}?leadId=${lead.id}`);
                    }}
                >
                    <Calendar className="h-4 w-4" />
                </Button>
                <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow-lg border border-border/40 action-button"
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
