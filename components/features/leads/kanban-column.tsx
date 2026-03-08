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
                "flex flex-col glass-sm border border-white/5 rounded-sm w-[280px] shrink-0 h-full max-h-full transition-all duration-300",
                isOver ? "bg-white/10 border-primary shadow-[0_0_20px_rgba(249,115,22,0.1)]" : "shadow-xl"
            )}
        >
            <div className="p-4 flex items-center justify-between border-b border-white/5 bg-white/5 rounded-t-sm">
                <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 leading-none font-sans">{column.label}</h3>
                    <span className="text-[13px] font-bold text-foreground font-display tracking-tight">${totalValue.toLocaleString()}</span>
                </div>
                <Badge variant="glass" className="h-6 px-2 min-w-[1.5rem] flex justify-center text-[11px] font-bold font-sans tabular-nums">
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
