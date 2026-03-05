'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Users, DollarSign, Building2, CheckSquare, TrendingUp, TrendingDown } from 'lucide-react';
import { Lead, Client, Deal, CRMTask } from '@/types';
import { cn } from '@/lib/utils';

interface KPICardsProps {
    leads: Lead[] | undefined;
    clients: Client[] | undefined;
    deals: Deal[] | undefined;
    tasks: CRMTask[] | undefined;
}



function formatCurrency(value: number) {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value}`;
}

export function KPICards({ leads = [], clients = [], deals = [], tasks = [] }: KPICardsProps) {
    // 1. Leads KPI
    const totalLeads = leads.length;

    // 2. Pipeline KPI
    const pipelineValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

    // 3. Active Clients KPI
    const activeClients = clients.filter(c => c.status === 'active').length;

    // 4. Tasks Due KPI
    const tasksDue = tasks.filter(t => t.status !== 'completed').length;

    const cards = [
        {
            title: 'Total Leads',
            value: totalLeads.toString(),
            delta: '+12%',
            trend: 'up',
            icon: Users,
            color: 'var(--color-primary)', // Apple Blue
            colorHex: '#007AFF',
            badgeBg: 'bg-success/10',
            badgeText: 'text-success/90',
        },
        {
            title: 'Pipeline Value',
            value: formatCurrency(pipelineValue),
            delta: '+24%',
            trend: 'up',
            icon: DollarSign,
            color: 'var(--color-warning)', // Orange/Amber
            colorHex: '#FF9500',
            badgeBg: 'bg-warning/10',
            badgeText: 'text-warning/90',
        },
        {
            title: 'Active Clients',
            value: activeClients.toString(),
            delta: '-4%',
            trend: 'down',
            icon: Building2,
            color: 'var(--color-destructive)', // Red
            colorHex: '#FF3B30',
            badgeBg: 'bg-destructive/10',
            badgeText: 'text-destructive/90',
        },
        {
            title: 'Tasks Due',
            value: tasksDue.toString(),
            delta: '-18%',
            trend: 'down',
            icon: CheckSquare,
            color: 'var(--color-sidebar-accent-foreground)', // Purple/Indigo
            colorHex: '#5856D6',
            badgeBg: 'bg-destructive/10',
            badgeText: 'text-destructive/90',
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {cards.map((card, index) => {
                const Icon = card.icon;
                const TrendIcon = card.trend === 'up' ? TrendingUp : TrendingDown;

                return (
                    <Card
                        key={index}
                        className="relative overflow-hidden border-border/60 bg-card/80 backdrop-blur-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 rounded-xl"
                    >
                        <div className="p-4 z-10">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-[13px] font-medium text-foreground/80 tracking-[-0.01em]">
                                    {card.title}
                                </h3>
                                <div className="p-1.5 rounded-md bg-muted/50 border border-border/50">
                                    <Icon className="w-4 h-4 text-foreground/70" style={{ color: card.colorHex }} />
                                </div>
                            </div>

                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-semibold tracking-[-0.03em] text-foreground">
                                    {card.value}
                                </span>
                                <div className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium", card.badgeBg, card.badgeText)}>
                                    <TrendIcon className="w-3 h-3" />
                                    {card.delta}
                                </div>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
