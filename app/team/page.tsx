'use client';

import { PageHeader } from '@/components/layout/page-header';
import { useUsers } from '@/hooks';
import { TeamGrid } from '@/components/features/team/team-grid';

export default function TeamHubPage() {
    const { useList } = useUsers();
    const { data: users, isLoading } = useList();

    return (
        <div className="p-6 max-w-full mx-auto space-y-6">
            <PageHeader
                title="Team Hub"
                description="Manage your team members, roles, and view performance metrics."
            />

            <TeamGrid users={users} isLoading={isLoading} />
        </div>
    );
}
