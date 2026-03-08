'use client';

import { TrendingUp, TrendingDown, Users, DollarSign, Building2, CheckSquare } from 'lucide-react';
import { Lead, Client, Deal, CRMTask } from '@/types';
import { cn } from '@/lib/utils';

interface KPICardsProps {
    leads: Lead[] | undefined;
    clients: Client[] | undefined;
    deals: Deal[] | undefined;
    tasks: CRMTask[] | undefined;
}

function formatCurrency(value: number) {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value}`;
}

/*
 * KPICards — Swiss Modernism 2.0 × Apple HIG
 *
 * Layout (per card):
 *  ┌─────────────────────────────────┐
 *  │  [Icon]            [↑ +12%]     │  ← top row: icon + trend pill
 *  │                                 │
 *  │                                 │
 *  │  42                             │  ← center: large display value
 *  │  Total Leads                    │  ← bottom: label
 *  └─────────────────────────────────┘
 *
 *  aspect-square  ·  rounded-3xl  ·  glassmorphism border
 */
export function KPICards({ leads = [], clients = [], deals = [], tasks = [] }: KPICardsProps) {
    const totalLeads = leads.length;
    const pipelineValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
    const activeClients = clients.filter(c => c.status === 'active').length;
    const tasksDue = tasks.filter(t => t.status !== 'completed').length;
    const openDeals = deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost').length;
    const wonDeals = deals.filter(d => d.stage === 'closed_won').length;
    const winRate = deals.length > 0 ? Math.round((wonDeals / deals.length) * 100) : 0;

    const cards = [
        {
            label: 'Total Leads',
            value: totalLeads.toString(),
            delta: '+12%',
            positive: true,
            icon: Users,
            iconColor: '#007AFF',
            accent: 'rgba(0,122,255,0.08)',
        },
        {
            label: 'Pipeline Value',
            value: formatCurrency(pipelineValue),
            delta: '+24%',
            positive: true,
            icon: DollarSign,
            iconColor: '#34C759',
            accent: 'rgba(52,199,89,0.08)',
        },
        {
            label: 'Active Clients',
            value: activeClients.toString(),
            delta: '-4%',
            positive: false,
            icon: Building2,
            iconColor: '#FF9500',
            accent: 'rgba(255,149,0,0.08)',
        },
        {
            label: 'Tasks Due',
            value: tasksDue.toString(),
            delta: '-18%',
            positive: false,
            icon: CheckSquare,
            iconColor: '#5856D6',
            accent: 'rgba(88,86,214,0.08)',
        },
        {
            label: 'Open Deals',
            value: openDeals.toString(),
            delta: '+8%',
            positive: true,
            icon: TrendingUp,
            iconColor: '#FF2D55',
            accent: 'rgba(255,45,85,0.08)',
        },
        {
            label: 'Win Rate',
            value: `${winRate}%`,
            delta: '+3%',
            positive: true,
            icon: TrendingUp,
            iconColor: '#30D158',
            accent: 'rgba(48,209,88,0.08)',
        },
    ] as const;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cards.map((card) => {
                const Icon = card.icon;
                const TrendIcon = card.positive ? TrendingUp : TrendingDown;

                return (
                    <div
                        key={card.label}
                        className={cn(
                            'group relative aspect-square flex flex-col justify-between',
                            'rounded-sm p-4 overflow-hidden',
                            /* Glassmorphism surface */
                            'glass-sm hover:glass-md',
                            'border border-white/10',
                            /* Swiss shadow scale */
                            'shadow-2xl transition-all duration-300',
                            'cursor-default active:scale-[0.98]',
                        )}
                    >
                        {/* Accent radial glow — colour-matched to card icon */}
                        <div
                            className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-40"
                            style={{
                                background: `radial-gradient(circle at 0% 0%, ${card.accent} 0%, transparent 60%)`,
                            }}
                            aria-hidden
                        />

                        {/* ── Top row: icon + trend pill ────────────── */}
                        <div className="relative flex items-start justify-between">
                            {/* Icon container */}
                            <div
                                className="w-10 h-10 rounded-sm flex items-center justify-center bg-white/5 border border-white/10"
                                style={{ boxShadow: `0 0 20px ${card.accent}` }}
                            >
                                <Icon
                                    className="w-5 h-5"
                                    style={{ color: card.iconColor }}
                                />
                            </div>

                            {/* Trend pill */}
                            <span
                                className={cn(
                                    'inline-flex items-center gap-0.5',
                                    'px-2 py-0.5 rounded-full',
                                    'text-[10px] font-bold tabular-nums font-sans uppercase tracking-tighter',
                                    card.positive
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'bg-rose-500/10 text-rose-400',
                                )}
                            >
                                <TrendIcon className="shrink-0" style={{ width: 10, height: 10 }} />
                                {card.delta}
                            </span>
                        </div>

                        {/* ── Bottom: value + label ─────────────────── */}
                        <div className="relative mt-4">
                            {/* Large display value — Swiss bold numerics */}
                            <p
                                className="text-3xl leading-none font-bold tracking-[-0.07em] text-foreground tabular-nums font-display"
                            >
                                {card.value}
                            </p>
                            {/* Descriptive label */}
                            <p className="mt-1.5 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] font-sans">
                                {card.label}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
