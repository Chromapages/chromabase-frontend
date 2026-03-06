'use client';

import { useState } from 'react';
import { Deal, Client } from '@/types';
import { cn } from '@/lib/utils';
import { TrendingUp, MoreHorizontal, Building2, Clock } from 'lucide-react';

interface MobilePipelineTabProps {
    deals: Deal[] | undefined;
    clients: Client[] | undefined;
}

export function MobilePipelineTab({ deals, clients }: MobilePipelineTabProps) {
    const [filter, setFilter] = useState<'all' | 'discovery' | 'proposal' | 'negotiation' | 'closed_won'>('all');

    const stages = [
        { id: 'discovery', label: 'Disc', color: 'bg-blue-500', count: deals?.filter(d => d.stage === 'discovery').length || 0 },
        { id: 'proposal', label: 'Prop', color: 'bg-indigo-500', count: deals?.filter(d => d.stage === 'proposal').length || 0 },
        { id: 'negotiation', label: 'Nego', color: 'bg-amber-500', count: deals?.filter(d => d.stage === 'negotiation').length || 0 },
        { id: 'closed_won', label: 'Won', color: 'bg-emerald-500', count: deals?.filter(d => d.stage === 'closed_won').length || 0 },
    ] as const;

    const filteredDeals = deals?.filter(d => {
        if (filter === 'all') return d.stage !== 'closed_lost';
        return d.stage === filter;
    }) || [];

    const totalValue = filteredDeals.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="flex flex-col gap-6 p-4 pb-32 h-full overflow-y-auto scrollbar-none">
            {/* Header Section */}
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Pipeline</h2>
                <div className="flex items-center gap-2 text-success">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-bold tracking-tight">+12.5% this month</span>
                </div>
            </div>

            {/* Total Value Strip */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Total Pipeline Value</p>
                <p className="text-3xl font-black text-foreground tracking-tighter">
                    ${(totalValue / 1000000).toFixed(1)}M
                </p>
            </div>

            {/* Stage Funnel */}
            <div className="flex items-center justify-between gap-1 bg-card/50 p-1 rounded-2xl border border-border/40">
                {stages.map((stage) => {
                    const isActive = filter === stage.id;
                    return (
                        <button
                            key={stage.id}
                            onClick={() => setFilter(isActive ? 'all' : stage.id)}
                            className={cn(
                                "flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all",
                                isActive ? "bg-background shadow-sm border border-border/50" : "hover:bg-muted/30"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white",
                                stage.color,
                                isActive ? "ring-4 ring-primary/10" : ""
                            )}>
                                {stage.count}
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{stage.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Deal List */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        {filter === 'all' ? 'Active Deals' : `${filter} stage`}
                    </h3>
                    <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>

                {filteredDeals.length === 0 ? (
                    <div className="py-12 flex flex-col items-center gap-2 text-center opacity-40">
                        <Building2 className="w-8 h-8" />
                        <p className="text-sm font-medium">No deals in this stage</p>
                    </div>
                ) : (
                    filteredDeals.map((deal) => {
                        const client = clients?.find(c => c.id === deal.clientId);
                        return (
                            <div
                                key={deal.id}
                                className="p-4 rounded-2xl bg-card border border-border/40 shadow-sm active:scale-[0.98] transition-all flex flex-col gap-3"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-col gap-0.5">
                                        <h4 className="text-[15px] font-bold text-foreground leading-tight">
                                            {client?.companyName || 'Unknown Client'}
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-tighter">
                                            {deal.name || 'Commercial Suite'}
                                        </p>
                                    </div>
                                    <span className="text-[15px] font-black tracking-tighter text-foreground">
                                        ${deal.value.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-1">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                                            deal.stage === 'discovery' ? "bg-blue-500/10 text-blue-600" :
                                                deal.stage === 'proposal' ? "bg-indigo-500/10 text-indigo-600" :
                                                    deal.stage === 'negotiation' ? "bg-amber-500/10 text-amber-600" :
                                                        "bg-emerald-500/10 text-emerald-600"
                                        )}>
                                            {deal.stage.replace('closed_', '')}
                                        </div>
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-[10px] font-medium">Updated 2h ago</span>
                                        </div>
                                    </div>
                                    <div className="flex -space-x-1.5 transition-transform hover:translate-x-1">
                                        <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-card flex items-center justify-center text-[8px] text-white font-bold">JD</div>
                                        <div className="w-5 h-5 rounded-full bg-indigo-500 border-2 border-card flex items-center justify-center text-[8px] text-white font-bold">AL</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
