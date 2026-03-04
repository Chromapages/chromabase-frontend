import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
    className?: string;
}

/*
 * EmptyState — Swiss Modernism 2.0
 * Centered, minimal, generous whitespace — no decoration, only content
 */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center text-center',
                'p-12 min-h-[280px]',
                'border border-dashed border-border/60 rounded-xl',
                'bg-card/40',
                className
            )}
        >
            {/* Icon container — Apple SF style */}
            <div className="w-11 h-11 rounded-2xl bg-muted flex items-center justify-center mb-4 shadow-xs">
                <Icon className="w-5 h-5 text-muted-foreground/60" />
            </div>

            <h3 className="text-[15px] font-semibold text-foreground tracking-[-0.02em]">
                {title}
            </h3>
            <p className="text-[13px] text-muted-foreground mt-1.5 max-w-[38ch] leading-relaxed">
                {description}
            </p>

            {action && (
                <div className="mt-6">
                    {action}
                </div>
            )}
        </div>
    );
}
