'use client';

import { Search, LayoutGrid, List, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LEAD_STATUS_OPTIONS } from '@/constants';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface LeadsFilterBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedStatuses: string[];
    onStatusToggle: (status: string) => void;
    view: 'kanban' | 'list';
    onViewChange: (view: 'kanban' | 'list') => void;
    onNewLead: () => void;
    totalValue: number;
    leadCount: number;
}

export function LeadsFilterBar({
    searchQuery,
    onSearchChange,
    selectedStatuses,
    onStatusToggle,
    view,
    onViewChange,
    onNewLead,
    totalValue,
    leadCount,
}: LeadsFilterBarProps) {
    return (
        <div className="flex flex-col gap-4 glass-md border border-white/10 p-4 rounded-sm shadow-2xl">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground/40" />
                    <Input
                        placeholder="SEARCH LEADS..."
                        className="pl-9 h-9 bg-black/20 border-white/5 focus-visible:ring-primary/20 transition-all rounded-sm uppercase text-[10px] font-bold tracking-[0.1em]"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-black/40 p-1 rounded-sm border border-white/5">
                        <Button
                            variant={view === 'kanban' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-7 w-7 rounded-sm transition-all grayscale hover:grayscale-0"
                            onClick={() => onViewChange('kanban')}
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant={view === 'list' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-7 w-7 rounded-sm transition-all grayscale hover:grayscale-0"
                            onClick={() => onViewChange('list')}
                        >
                            <List className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    <Button onClick={onNewLead} size="sm" className="h-9 gap-2 font-bold uppercase tracking-[0.1em] text-[10px] rounded-sm">
                        <Plus className="h-4 w-4" />
                        New Lead
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex flex-wrap gap-2">
                    {LEAD_STATUS_OPTIONS.map((status) => {
                        const isSelected = selectedStatuses.includes(status.value);
                        return (
                            <button
                                key={status.value}
                                onClick={() => onStatusToggle(status.value)}
                                className={cn(
                                    "px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-all border",
                                    isSelected
                                        ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(249,115,22,0.2)]"
                                        : "bg-white/5 border-white/10 text-muted-foreground/60 hover:bg-white/10 hover:text-foreground"
                                )}
                            >
                                {status.label}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/40">Value:</span>
                        <span className="text-[14px] font-bold text-foreground font-display tabular-nums tracking-tight">
                            ${totalValue.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/40">Total:</span>
                        <span className="text-[14px] font-bold text-foreground font-display tabular-nums tracking-tight">
                            {leadCount}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
