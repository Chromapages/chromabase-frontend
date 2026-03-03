'use client';

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { Lead } from '@/types';
import { KanbanItem } from './kanban-item';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface KanbanColumnProps {
    column: { label: string; value: string };
    leads: Lead[];
}

export function KanbanColumn({ column, leads }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.value,
        data: {
            type: 'Column',
            column,
        },
    });

    const leadIds = leads.map(l => l.id);
    const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex flex-col bg-muted/20 border border-border/40 rounded-xl w-[260px] shrink-0 h-full max-h-full transition-all duration-200",
                isOver ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20 shadow-lg" : "shadow-sm"
            )}
        >
            <div className="p-3 flex items-center justify-between border-b border-border/40 bg-muted/10">
                <div className="flex flex-col gap-0.5">
                    <h3 className="font-semibold text-[11px] uppercase tracking-wider text-foreground/80 leading-none">{column.label}</h3>
                    <span className="text-[10px] font-bold text-primary/80">${totalValue.toLocaleString()}</span>
                </div>
                <Badge variant="secondary" className="h-4.5 px-1.5 min-w-[1.25rem] flex justify-center text-[10px] bg-background/50 border-border/40">
                    {leads.length}
                </Badge>
            </div>

            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-muted-foreground/20">
                <SortableContext items={leadIds} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col gap-2 min-h-[50px]">
                        {leads.map((lead) => (
                            <KanbanItem key={lead.id} lead={lead} />
                        ))}
                    </div>
                </SortableContext>
            </div>
        </div>
    );
}
