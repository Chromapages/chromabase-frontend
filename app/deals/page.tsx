'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { useDeals, useClients } from '@/hooks';
import { DealKanban } from '@/components/features/deals/deal-kanban';
import { DealsFilterBar } from '@/components/features/deals/deals-filter-bar';
import { MobilePipelineTab } from '@/components/features/dashboard/mobile-pipeline-tab';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { DEAL_STAGE_OPTIONS } from '@/constants';
import { DealDialog } from '@/components/features/deals/deal-dialog';
import { DealsStatsBar } from '@/components/features/deals/deals-stats-bar';

export default function DealsPage() {
    const { useList, useUpdate } = useDeals();
    const { useList: useClientsList } = useClients();
    const { data: deals = [], isLoading } = useList();
    const { data: clients } = useClientsList();
    const updateDeal = useUpdate();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStages, setSelectedStages] = useState<string[]>(
        DEAL_STAGE_OPTIONS.map(s => s.value)
    );

    const filteredDeals = useMemo(() => {
        return deals.filter(deal => {
            const matchesSearch =
                deal.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStage = selectedStages.includes(deal.stage);
            return matchesSearch && matchesStage;
        });
    }, [deals, searchQuery, selectedStages]);

    const totalValue = useMemo(() => {
        return filteredDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    }, [filteredDeals]);

    const handleStageToggle = (stage: string) => {
        setSelectedStages((prev: string[]) =>
            prev.includes(stage)
                ? prev.filter((s: string) => s !== stage)
                : [...prev, stage]
        );
    };

    return (
        <div className="h-full flex flex-col">
            {/* Desktop View */}
            <div className="hidden lg:flex flex-col p-4 md:p-6 lg:p-8 max-w-[1700px] mx-auto space-y-4 md:space-y-6 flex-1 h-[calc(100vh-4rem)]">
                <div className="flex flex-col gap-4">
                    <PageHeader
                        title="Pipeline & Deals"
                        description="Visualize your sales pipeline and manage active deals."
                    />

                    <DealsStatsBar deals={deals} isLoading={isLoading} />

                    <DealsFilterBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        selectedStages={selectedStages}
                        onStageToggle={handleStageToggle}
                        onNewDeal={() => setIsDialogOpen(true)}
                        totalValue={totalValue}
                        dealCount={filteredDeals.length}
                    />
                </div>

                <div className="flex-1 min-h-0 overflow-hidden">
                    {isLoading ? (
                        <div className="flex gap-4 h-full">
                            <TableSkeleton rows={8} />
                            <TableSkeleton rows={8} />
                            <TableSkeleton rows={8} />
                        </div>
                    ) : (
                        <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 pr-1">
                            <DealKanban
                                deals={filteredDeals}
                                onDealUpdate={(id, updates) => updateDeal.mutate({ id, data: updates })}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden flex-1 overflow-hidden">
                <MobilePipelineTab deals={deals} clients={clients} />
            </div>

            <DealDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </div>
    );
}
