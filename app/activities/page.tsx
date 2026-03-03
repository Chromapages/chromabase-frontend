'use client';

import { PageHeader } from '@/components/layout/page-header';
import { useActivities } from '@/hooks';
import { ActivityFeed } from '@/components/features/activities/activity-feed';

export default function ActivitiesPage() {
    const { useList } = useActivities();
    const { data: activities, isLoading } = useList();

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <PageHeader
                title="Activity Feed"
                description="A complete timeline of all interactions across your accounts and leads."
            />

            <ActivityFeed activities={activities} isLoading={isLoading} />
        </div>
    );
}
