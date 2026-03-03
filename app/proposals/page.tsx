'use client';

import { PageHeader } from '@/components/layout/page-header';
import { useProposals, useClients } from '@/hooks';
import { ProposalList } from '@/components/features/proposals/proposal-list';

export default function ProposalsPage() {
    const { useList } = useProposals();
    const { data: proposals, isLoading } = useList();
    const { useList: useClientList } = useClients();
    const { data: clients } = useClientList();

    return (
        <div className="p-6 max-w-full mx-auto space-y-8 animate-in fade-in duration-700">
            <PageHeader
                title="Business Proposals"
                description="Track and manage high-value client proposals through the approval lifecycle."
            />

            <ProposalList
                proposals={proposals}
                clients={clients}
                isLoading={isLoading}
            />
        </div>
    );
}

