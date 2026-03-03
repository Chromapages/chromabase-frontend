'use client';

import { Search, Plus, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DEAL_STAGE_OPTIONS } from '@/constants';
import { cn } from '@/lib/utils';

interface DealsFilterBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedStages: string[];
    onStageToggle: (stage: string) => void;
    onNewDeal: () => void;
    totalValue: number;
    dealCount: number;
}

export function DealsFilterBar({
    searchQuery,
    onSearchChange,
    selectedStages,
    onStageToggle,
    onNewDeal,
    totalValue,
    dealCount,
}: DealsFilterBarProps) {
    const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(totalValue);

    return (
        <div className="flex flex-col gap-4 bg-card/40 backdrop-blur-md border border-border/40 p-3 rounded-xl shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search deals..."
                        className="pl-9 h-9 bg-background/50 border-border/40 focus-visible:ring-primary/20 transition-all"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9 gap-2 text-muted-foreground border-border/40">
                        <Filter className="h-4 w-4" />
                        More Filters
                    </Button>
                    <Button onClick={onNewDeal} size="sm" className="h-9 gap-2">
                        <Plus className="h-4 w-4" />
                        New Deal
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                    {DEAL_STAGE_OPTIONS.map((stage) => {
                        const isSelected = selectedStages.includes(stage.value);
                        return (
                            <button
                                key={stage.value}
                                onClick={() => onStageToggle(stage.value)}
                                className={cn(
                                    "px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider transition-all border",
                                    isSelected
                                        ? "bg-primary/20 border-primary text-primary"
                                        : "bg-muted/30 border-border/40 text-muted-foreground hover:bg-muted/50"
                                )}
                            >
                                {stage.label}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-muted/30 border border-border/40 rounded-full">
                        <span className="text-muted-foreground">Pipeline Value:</span>
                        <span className="font-semibold text-foreground">{formattedValue}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-muted/30 border border-border/40 rounded-full">
                        <span className="text-muted-foreground">Total Deals:</span>
                        <span className="font-semibold text-foreground">{dealCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
