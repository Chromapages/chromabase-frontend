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
        <div className="flex flex-col gap-4 bg-card/40 backdrop-blur-md border border-border/40 p-3 rounded-xl shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search leads..."
                        className="pl-9 h-9 bg-background/50 border-border/40 focus-visible:ring-primary/20 transition-all"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/40">
                        <Button
                            variant={view === 'kanban' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-7 w-7 rounded-sm"
                            onClick={() => onViewChange('kanban')}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={view === 'list' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-7 w-7 rounded-sm"
                            onClick={() => onViewChange('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button onClick={onNewLead} size="sm" className="h-9 gap-2">
                        <Plus className="h-4 w-4" />
                        New Lead
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                    {LEAD_STATUS_OPTIONS.map((status) => {
                        const isSelected = selectedStatuses.includes(status.value);
                        return (
                            <button
                                key={status.value}
                                onClick={() => onStatusToggle(status.value)}
                                className={cn(
                                    "px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider transition-all border",
                                    isSelected
                                        ? "bg-primary/20 border-primary text-primary"
                                        : "bg-muted/30 border-border/40 text-muted-foreground hover:bg-muted/50"
                                )}
                            >
                                {status.label}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-muted/30 border border-border/40 rounded-full">
                        <span className="text-muted-foreground">Total Value:</span>
                        <span className="font-semibold text-foreground">${totalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-muted/30 border border-border/40 rounded-full">
                        <span className="text-muted-foreground">Total Leads:</span>
                        <span className="font-semibold text-foreground">{leadCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
