'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { useLeads } from '@/hooks';
import { KanbanBoard } from '@/components/features/leads/kanban-board';
import { LeadsFilterBar } from '@/components/features/leads/leads-filter-bar';
import { LeadsList } from '@/components/features/leads/leads-list';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { LeadDialog } from '@/components/features/leads/lead-dialog';
import { LEAD_STATUS_OPTIONS } from '@/constants';

export default function LeadsPage() {
    const { useList, useUpdate } = useLeads();
    const { data: leads = [], isLoading } = useList();
    const updateLead = useUpdate();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [view, setView] = useState<'kanban' | 'list'>('kanban');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
        LEAD_STATUS_OPTIONS.map(s => s.value)
    );

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const matchesSearch =
                lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.contactName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = selectedStatuses.includes(lead.status);
            return matchesSearch && matchesStatus;
        });
    }, [leads, searchQuery, selectedStatuses]);

    const totalValue = useMemo(() => {
        return filteredLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);
    }, [filteredLeads]);

    const handleStatusToggle = (status: string) => {
        setSelectedStatuses((prev: string[]) =>
            prev.includes(status)
                ? prev.filter((s: string) => s !== status)
                : [...prev, status]
        );
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-[1700px] mx-auto space-y-4 md:space-y-6 flex flex-col h-[calc(100vh-4rem)]">
            <div className="flex flex-col gap-4">
                <PageHeader
                    title="Leads Pipeline"
                    description="Redefining lead management with Swiss precision."
                />

                <LeadsFilterBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedStatuses={selectedStatuses}
                    onStatusToggle={handleStatusToggle}
                    view={view}
                    onViewChange={setView}
                    onNewLead={() => setIsDialogOpen(true)}
                    totalValue={totalValue}
                    leadCount={filteredLeads.length}
                />
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
                {isLoading ? (
                    <div className="flex gap-4 h-full">
                        <TableSkeleton rows={8} />
                        {view === 'kanban' && (
                            <>
                                <TableSkeleton rows={8} />
                                <TableSkeleton rows={8} />
                            </>
                        )}
                    </div>
                ) : (
                    <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 pr-1">
                        {view === 'kanban' ? (
                            <KanbanBoard
                                leads={filteredLeads}
                                onLeadUpdate={(id, updates) => updateLead.mutate({ id, data: updates })}
                            />
                        ) : (
                            <LeadsList leads={filteredLeads} />
                        )}
                    </div>
                )}
            </div>

            <LeadDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </div>
    );
}
