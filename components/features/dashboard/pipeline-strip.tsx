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
        <div className="w-full bg-card border border-border/60 rounded-xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow duration-200 mt-4 h-[84px] shrink-0">
            <div className="flex items-stretch h-full overflow-x-auto scrollbar-none snap-x snap-mandatory">

                {/* Header Label */}
                <div className="px-6 py-4 flex flex-col justify-center border-r border-border/50 shrink-0 bg-muted/20">
                    <h3 className="text-[12px] uppercase tracking-wider font-bold text-muted-foreground/50">Deal Pipeline</h3>
                    <p className="text-[13px] font-medium text-foreground mt-0.5">Summary</p>
                </div>

                {/* Pipeline Stages */}
                <div className="flex-1 flex items-center px-6 gap-2 min-w-max pb-1">
                    {stageData.map((stage, idx) => (
                        <div key={stage.key} className="flex items-center gap-2 shrink-0 snap-start">

                            {/* Connector Arrow (except first) */}
                            {idx > 0 && <ArrowRight className="w-4 h-4 text-muted-foreground/30 shrink-0 mx-2" />}

                            {/* Pill */}
                            <div className={cn(
                                "flex items-center gap-4 px-4 py-2.5 rounded-full border transition-all hover:brightness-110",
                                stage.color
                            )}>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
                                        {stage.label}
                                    </span>
                                    <div className="flex items-baseline gap-2 mt-0.5">
                                        <span className="text-[14px] font-bold">
                                            {formatCurrency(stage.value)}
                                        </span>
                                    </div>
                                </div>

                                <div className="ml-2 w-6 h-6 rounded-full bg-background/50 flex items-center justify-center border border-current/10 shadow-sm shrink-0">
                                    <span className="text-[11px] font-bold">{stage.count}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
