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

export function StatsCard({ title, value, description, trend, icon: Icon, className, isLoading }: StatsCardProps) {
    return (
        <div className={cn(
            "bg-card/40 backdrop-blur-md border border-border/40 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:bg-card/60 transition-colors group cursor-pointer",
            className
        )}>
            <div className="flex items-center justify-between gap-2">
                <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">{title}</dt>
                {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />}
            </div>

            <div className="mt-2 flex items-baseline justify-between">
                {isLoading ? (
                    <Skeleton className="h-7 w-20" />
                ) : (
                    <dd className="text-2xl font-bold tracking-tight text-foreground">{value}</dd>
                )}
                {!isLoading && trend && (
                    <span className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                        trend.isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    )}>
                        {trend.isPositive ? '↑' : '↓'} {trend.value}%
                    </span>
                )}
            </div>

            {isLoading ? (
                <Skeleton className="h-3 w-24 mt-1" />
            ) : (
                description && <p className="mt-1 text-[10px] text-muted-foreground/80 leading-tight">{description}</p>
            )}
        </div>
    );
}
