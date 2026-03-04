'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Deal } from '@/types';
import { GripVertical, Building2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { useClients, useUsers } from '@/hooks';

interface DealCardProps {
    deal: Deal;
}

export function DealCard({ deal }: DealCardProps) {
    const router = useRouter();
    const { useGet: useGetClient } = useClients();
    const { data: client } = useGetClient(deal.clientId);

    const { useGet: useGetUser } = useUsers();
    const { data: owner } = useGetUser(deal.ownerId);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: deal.id,
        data: {
            type: 'Deal',
            deal,
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
                className="opacity-30 border-2 border-primary/50 border-dashed rounded-lg h-[92px] bg-muted/20"
            />
        );
    }

    const getStageColor = (stage: string) => {
        switch (stage) {
            case 'discovery': return 'border-l-blue-500';
            case 'proposal': return 'border-l-amber-500';
            case 'negotiation': return 'border-l-purple-500';
            case 'closed_won': return 'border-l-emerald-500';
            case 'closed_lost': return 'border-l-red-500';
            default: return 'border-l-muted-foreground/30';
        }
    };

    const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(deal.value || 0);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative border-l-4 bg-card/80 backdrop-blur-md border border-border/40 rounded-2xl p-4 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md cursor-grab active:cursor-grabbing",
                getStageColor(deal.stage),
                isDragging && "opacity-50"
            )}
            onClick={(e) => {
                // If we had a deal detail page: router.push(`${ROUTES.DEALS}/${deal.id}`);
            }}
        >
            <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-semibold text-[13px] text-foreground leading-tight truncate">
                            {deal.name}
                        </span>
                        <div className="flex items-center text-[10px] text-muted-foreground font-medium mt-0.5 truncate">
                            <Building2 className="w-3 h-3 mr-1 opacity-70" />
                            {client?.companyName || 'Unknown Client'}
                        </div>
                    </div>
                    <div
                        {...attributes}
                        {...listeners}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-muted rounded text-muted-foreground/50 shrink-0"
                    >
                        <GripVertical className="h-3.5 w-3.5" />
                    </div>
                </div>

                <div className="flex items-center justify-between mt-0.5">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-[13px] font-bold text-foreground">
                            {formattedValue}
                        </span>
                        {deal.probability !== undefined && (
                            <span className="text-[10px] font-medium text-muted-foreground bg-muted/50 px-1 py-0.5 rounded">
                                {deal.probability}%
                            </span>
                        )}
                    </div>
                    {owner ? (
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold" title={`${owner.firstName} ${owner.lastName}`}>
                            {owner.firstName.charAt(0)}{owner.lastName.charAt(0)}
                        </div>
                    ) : (
                        <User className="w-4 h-4 text-muted-foreground/50" />
                    )}
                </div>
            </div>
        </div>
    );
}
