'use client';

import { PageHeader } from '@/components/layout/page-header';
import { useQuotes } from '@/hooks';
import { QuoteList } from '@/components/features/quotes/quote-list';

export default function QuotesPage() {
    const { useList } = useQuotes();
    const { data: quotes, isLoading } = useList();

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <PageHeader
                title="Quotes & Proposals"
                description="Manage your sales quotes and proposals sent to clients."
            />

            <QuoteList quotes={quotes} isLoading={isLoading} />
        </div>
    );
}
