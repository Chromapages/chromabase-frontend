'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { CampaignGrid } from '@/components/features/campaigns/campaign-grid';
import { useCampaigns } from '@/hooks';
import { CampaignDialog } from '@/components/features/campaigns/campaign-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function CampaignsPage() {
    const { useList } = useCampaigns();
    const { data: campaigns, isLoading } = useList();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <PageHeader
                title="Campaigns"
                description="Manage your marketing campaigns, sequences, and events."
            >
                <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Campaign
                </Button>
            </PageHeader>

            <CampaignGrid
                campaigns={campaigns || []}
                isLoading={isLoading}
            />

            <CampaignDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div>
    );
}
