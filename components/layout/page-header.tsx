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
                <h1 className="text-[1.75rem] font-bold tracking-[-0.04em] text-foreground leading-[1.1]">
                    {title}
                </h1>
                {description && (
                    <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed max-w-[60ch]">
                        {description}
                    </p>
                )}
            </div>
            {children && (
                <div className="flex items-center gap-2 shrink-0 md:mt-0.5">
                    {children}
                </div>
            )}
        </div>
    );
}
