'use client';

import { TrendingUp, TrendingDown, Target, DollarSign, Percent, Calendar } from 'lucide-react';
import { StatsCard } from '@/components/shared/stats-card';
import { Deal } from '@/types';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface DealsStatsBarProps {
    deals: Deal[];
    isLoading?: boolean;
}

const STAGE_PROBABILITIES: Record<string, number> = {
    discovery: 0.10,
    proposal: 0.30,
    negotiation: 0.60,
    closed_won: 1.00,
    closed_lost: 0.00,
};

export function DealsStatsBar({ deals, isLoading }: DealsStatsBarProps) {
    const now = new Date();
    const thisMonth = {
        start: startOfMonth(now),
        end: endOfMonth(now)
    };

    // Total pipeline value
    const totalPipeline = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

    // Won and closed deals
    const closedWonDeals = deals.filter(d => d.stage === 'closed_won');
    const closedLostDeals = deals.filter(d => d.stage === 'closed_lost');
    const closedDeals = [...closedWonDeals, ...closedLostDeals];
    
    // Win rate
    const winRate = closedDeals.length > 0 
        ? Math.round((closedWonDeals.length / closedDeals.length) * 100)
        : 0;

    // Average deal size
    const avgDealSize = deals.length > 0 
        ? Math.round(totalPipeline / deals.length)
        : 0;

    // Closing this month
    const closingThisMonth = deals
        .filter(d => d.closeDate && d.stage !== 'closed_won' && d.stage !== 'closed_lost')
        .filter(d => isWithinInterval(new Date(d.closeDate!), thisMonth))
        .reduce((sum, deal) => sum + (deal.value || 0), 0);

    // Weighted forecast (using deal probability or stage probability)
    const weightedForecast = deals.reduce((sum, deal) => {
        const probability = deal.probability !== undefined 
            ? deal.probability / 100 
            : STAGE_PROBABILITIES[deal.stage] || 0;
        return sum + (deal.value || 0) * probability;
    }, 0);

    const formatCurrency = (value: number) => {
        if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(1)}M`;
        }
        if (value >= 1000) {
            return `$${(value / 1000).toFixed(0)}K`;
        }
        return `$${value}`;
    };

    return (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5 mb-6">
            <StatsCard
                title="Total Pipeline"
                value={formatCurrency(totalPipeline)}
                icon={DollarSign}
                description={`${deals.length} active deals`}
                isLoading={isLoading}
            />
            <StatsCard
                title="Win Rate"
                value={`${winRate}%`}
                icon={Percent}
                description={`${closedWonDeals.length} of ${closedDeals.length} closed`}
                isLoading={isLoading}
            />
            <StatsCard
                title="Avg Deal Size"
                value={formatCurrency(avgDealSize)}
                icon={Target}
                description="Average value"
                isLoading={isLoading}
            />
            <StatsCard
                title="This Month"
                value={formatCurrency(closingThisMonth)}
                icon={Calendar}
                description="Expected to close"
                className={closingThisMonth > 0 ? "text-amber-500" : ""}
                isLoading={isLoading}
            />
            <StatsCard
                title="Weighted Forecast"
                value={formatCurrency(weightedForecast)}
                icon={weightedForecast >= totalPipeline * 0.5 ? TrendingUp : TrendingDown}
                description="Probability-adjusted"
                className={weightedForecast >= totalPipeline * 0.5 ? "text-emerald-500" : "text-amber-500"}
                isLoading={isLoading}
            />
        </div>
    );
}
