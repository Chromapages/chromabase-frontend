'use client';

import { useState } from 'react';
import { DataTable, Column } from '@/components/shared/data-table';
import { FilterBar } from '@/components/shared/filter-bar';
import { Quote } from '@/types';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';

interface QuoteListProps {
    quotes: Quote[] | undefined;
    isLoading: boolean;
}

export function QuoteList({ quotes, isLoading }: QuoteListProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    const filteredQuotes = quotes?.filter(q =>
        q.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);
    const paginatedQuotes = filteredQuotes.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const columns: Column<Quote>[] = [
        {
            header: 'Title',
            accessorKey: 'title',
            className: 'font-medium hover:text-primary transition-colors cursor-pointer',
        },
        {
            header: 'Status',
            cell: (quote) => {
                const variants: Record<string, string> = {
                    draft: 'secondary',
                    sent: 'default',
                    viewed: 'default',
                    accepted: 'default', // ideally 'success'
                    declined: 'destructive'
                };
                const variant = variants[quote.status] || 'outline';
                return <Badge variant={variant as any} className="capitalize font-semibold">{quote.status}</Badge>;
            }
        },
        {
            header: 'Total',
            cell: (quote) => <span className="font-bold text-foreground">${quote.total.toLocaleString()}</span>
        },
        {
            header: 'Valid Until',
            cell: (quote) => (
                <span className="text-muted-foreground font-medium">
                    {format(quote.validUntil, 'MMM d, yyyy')}
                </span>
            )
        },
        {
            header: 'Created',
            cell: (quote) => (
                <span className="text-muted-foreground text-sm font-medium">
                    {format(quote.createdAt, 'MMM d, yyyy')}
                </span>
            )
        }
    ];

    if (isLoading) return <TableSkeleton rows={8} />;

    return (
        <div className="space-y-6">
            <FilterBar
                searchQuery={searchQuery}
                onSearchChange={(v) => { setSearchQuery(v); setPage(1); }}
                searchPlaceholder="Search quotes by title..."
                actionButton={{
                    label: 'Create Quote',
                    onClick: () => router.push(`${ROUTES.QUOTES}/new`),
                    icon: Plus
                }}
            />

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
                {filteredQuotes.length === 0 ? (
                    <div className="p-20 text-center space-y-2">
                        <div className="text-lg font-medium text-foreground">No quotes found</div>
                        <p className="text-muted-foreground">Try adjusting your search query or create a new quote.</p>
                    </div>
                ) : (
                    <DataTable
                        data={paginatedQuotes}
                        columns={columns}
                        keyExtractor={(q) => q.id}
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        onRowClick={(quote) => router.push(`${ROUTES.QUOTES}/${quote.id}`)}
                    />
                )}
            </div>
        </div>
    );
}
