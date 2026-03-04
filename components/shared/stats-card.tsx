import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    icon?: LucideIcon;
    className?: string;
    isLoading?: boolean;
}

/*
 * StatsCard — Swiss Modernism 2.0
 *
 * Layout (8pt grid):
 *  ┌────────────────────────────────┐
 *  │  LABEL                   icon  │  ← micro-label + icon
 *  │                                │
 *  │  42                    ↑ 12%  │  ← display number + trend pill
 *  │  description text              │  ← secondary caption
 *  └────────────────────────────────┘
 */
export function StatsCard({
    title,
    value,
    description,
    trend,
    icon: Icon,
    className,
    isLoading,
}: StatsCardProps) {
    return (
        <div
            className={cn(
                'group relative overflow-hidden',
                'bg-card border border-border/60 rounded-xl p-4',
                'shadow-[0_1px_4px_rgba(0,0,0,0.06)]',
                'hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:border-border',
                'transition-all duration-200 cursor-default',
                className
            )}
        >
            {/* Subtle top-right glow — Swiss accent */}
            <div
                className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(0,122,255,0.08) 0%, transparent 70%)' }}
                aria-hidden
            />

            {/* Header row */}
            <div className="flex items-center justify-between gap-2 mb-3">
                <dt className="text-label-micro text-muted-foreground/70 truncate">
                    {title}
                </dt>
                {Icon && (
                    <Icon className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                )}
            </div>

            {/* Value row */}
            <div className="flex items-baseline justify-between gap-2">
                {isLoading ? (
                    <Skeleton className="h-8 w-20 rounded-md" />
                ) : (
                    <dd className="text-[1.75rem] font-bold tracking-[-0.04em] text-foreground tabular-nums leading-none">
                        {value}
                    </dd>
                )}

                {!isLoading && trend && (
                    <span
                        className={cn(
                            'inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full shrink-0',
                            trend.isPositive
                                ? 'bg-success/10 text-success'
                                : 'bg-destructive/10 text-destructive'
                        )}
                    >
                        {trend.isPositive ? '↑' : '↓'} {trend.value}%
                    </span>
                )}
            </div>

            {/* Description */}
            {isLoading ? (
                <Skeleton className="h-3 w-28 rounded mt-2" />
            ) : (
                description && (
                    <p className="mt-2 text-[11px] text-muted-foreground/60 leading-snug">
                        {description}
                    </p>
                )
            )}
        </div>
    );
}
