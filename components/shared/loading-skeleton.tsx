import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-[250px]" />
                <Skeleton className="h-8 w-[100px]" />
            </div>
            <div className="border rounded-md">
                <div className="h-12 border-b px-4 flex items-center bg-muted/50">
                    <Skeleton className="h-4 w-full max-w-[400px]" />
                </div>
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="h-16 px-4 flex items-center border-b last:border-0 gap-4">
                        <Skeleton className="h-4 w-[120px]" />
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[100px] ml-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CardGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
        </div>
    );
}

export function CalendarSkeleton({ weeks = 6 }: { weeks?: number }) {
    return (
        <div className="h-full flex flex-col overflow-hidden animate-pulse">
            {/* Weekday header */}
            <div className="grid grid-cols-7 border-b border-border/20 bg-muted/10">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="py-2.5 text-center text-[10px] font-semibold tracking-[0.06em] uppercase text-muted-foreground/30">
                        {day}
                    </div>
                ))}
            </div>

            {/* Day cells */}
            <div className={cn(
                'flex-1 grid grid-cols-7 min-h-0',
                weeks === 1 ? 'grid-rows-1' : 'grid-rows-6'
            )}>
                {Array.from({ length: weeks * 7 }).map((_, idx) => (
                    <div
                        key={idx}
                        className="min-h-[100px] border-r border-b border-border/15 p-1.5 flex flex-col gap-1"
                    >
                        {/* Day number placeholder */}
                        <div className="w-6 h-6 rounded-full bg-muted/30" />
                        {/* Event pill placeholders */}
                        <div className="flex flex-col gap-0.5 mt-0.5">
                            {idx % 3 !== 0 && (
                                <div
                                    className="h-[18px] rounded-[5px] border-l-2 border-l-violet-400/30 bg-violet-500/6"
                                    style={{ width: `${60 + (idx % 4) * 10}%` }}
                                />
                            )}
                            {idx % 4 === 0 && (
                                <div
                                    className="h-[18px] rounded-[5px] border-l-2 border-l-amber-400/30 bg-amber-500/6"
                                    style={{ width: `${50 + (idx % 3) * 15}%` }}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
