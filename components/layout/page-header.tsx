import { cn } from '@/lib/utils';

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
}

/*
 * PageHeader — Swiss Modernism 2.0
 * Bold, left-aligned, tight tracking — pure Swiss typographic hierarchy
 */
export function PageHeader({ title, description, children, className }: PageHeaderProps) {
    return (
        <div className={cn('flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6', className)}>
            <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-bold tracking-[-0.05em] text-foreground leading-tight font-display italic">
                    {title}
                </h1>
                {description && (
                    <p className="text-xs text-muted-foreground/60 mt-1 uppercase tracking-widest font-sans font-medium">
                        {description}
                    </p>
                )}
            </div>
            {children && (
                <div className="flex items-center gap-3 shrink-0">
                    {children}
                </div>
            )}
        </div>
    );
}
