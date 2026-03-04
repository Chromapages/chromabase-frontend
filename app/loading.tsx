import { CardGridSkeleton } from '@/components/shared/loading-skeleton';

export default function Loading() {
    return (
        <div className="p-6">
            <div className="mb-6 space-y-2">
                <div className="h-8 w-48 bg-muted/50 rounded-md animate-pulse" />
                <div className="h-4 w-96 bg-muted/50 rounded-md animate-pulse" />
            </div>
            <CardGridSkeleton count={8} />
        </div>
    );
}
