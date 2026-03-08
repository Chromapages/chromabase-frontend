import { Deal } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface PipelineStripProps {
    deals: Deal[] | undefined;
}

const STAGE_CONFIG = [
    { key: 'discovery', label: 'Discovery', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
    { key: 'proposal', label: 'Proposal', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
    { key: 'negotiation', label: 'Negotiation', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
    { key: 'closed_won', label: 'Closed Won', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
] as const;

function formatCurrency(value: number) {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value}`;
}

export function PipelineStrip({ deals = [] }: PipelineStripProps) {
    const stageData = STAGE_CONFIG.map(config => {
        const stageDeals = deals.filter(d => d.stage === config.key);
        const count = stageDeals.length;
        const value = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);
        return { ...config, count, value };
    });

    return (
        <div className="w-full glass-md border border-white/10 rounded-sm overflow-hidden shadow-2xl mt-4 h-[84px] shrink-0">
            <div className="flex items-stretch h-full overflow-x-auto scrollbar-none snap-x snap-mandatory">

                {/* Header Label */}
                <div className="px-6 py-4 flex flex-col justify-center border-r border-white/5 shrink-0 bg-white/5">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/40 font-sans">Pipeline</h3>
                    <p className="text-[14px] font-bold text-foreground mt-0.5 font-display tracking-tight">Active Pulse</p>
                </div>

                {/* Pipeline Stages */}
                <div className="flex-1 flex items-center px-6 gap-3 min-w-max pb-1 bg-black/20">
                    {stageData.map((stage, idx) => (
                        <div key={stage.key} className="flex items-center gap-3 shrink-0 snap-start">

                            {/* Connector Arrow (except first) */}
                            {idx > 0 && <ArrowRight className="w-4 h-4 text-white/10 shrink-0 mx-1" />}

                            {/* Pill */}
                            <div className={cn(
                                "flex items-center gap-4 px-5 py-2.5 rounded-sm border transition-all hover:glass-sm shadow-lg",
                                stage.color.replace('bg-', 'bg-black/40 bg-')
                            )}>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-40 font-sans">
                                        {stage.label}
                                    </span>
                                    <div className="flex items-baseline gap-2 mt-0.5">
                                        <span className="text-[15px] font-bold font-display tracking-tight">
                                            {formatCurrency(stage.value)}
                                        </span>
                                    </div>
                                </div>

                                <div className="ml-2 w-7 h-7 rounded-sm bg-white/5 flex items-center justify-center border border-white/10 shadow-inner shrink-0">
                                    <span className="text-[12px] font-bold font-sans tabular-nums">{stage.count}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
