import { Skeleton } from '@/components/ui/skeleton';

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
