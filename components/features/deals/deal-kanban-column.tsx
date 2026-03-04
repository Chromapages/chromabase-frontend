'use client';

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { Deal } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DealCard } from './deal-card';

interface DealKanbanColumnProps {
    column: { label: string; value: string };
    deals: Deal[];
}

export function DealKanbanColumn({ column, deals }: DealKanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.value,
        data: {
            type: 'Column',
            column,
        },
    });

    const dealIds = deals.map(d => d.id);
    const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

    const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
        notation: 'compact'
    }).format(totalValue);

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex flex-col bg-muted/30 border border-border/40 rounded-3xl flex-1 min-w-[300px] h-full max-h-full transition-all duration-200 overflow-hidden",
                isOver ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20 shadow-lg" : "shadow-sm"
            )}
        >
            <div className="p-4 flex items-center justify-between border-b border-border/40 bg-muted/10">
                <div className="flex flex-col gap-0.5">
                    <h3 className="font-semibold text-sm text-foreground/90 leading-tight">{column.label}</h3>
                    <span className="text-xs font-medium text-muted-foreground">{formattedValue}</span>
                </div>
                <Badge variant="secondary" className="h-5 px-2 min-w-[1.5rem] flex items-center justify-center text-xs font-medium bg-background/50 border-border/40 text-foreground/70 rounded-full">
                    {deals.length}
                </Badge>
            </div>

            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-muted-foreground/20">
                <SortableContext items={dealIds} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col gap-2 min-h-[50px]">
                        {deals.map((deal) => (
                            <DealCard key={deal.id} deal={deal} />
                        ))}
                    </div>
                </SortableContext>
            </div>
        </div>
    );
}
