'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/shared/filter-bar';
import { Plus, Users, Mail, MousePointerClick, TrendingUp, Calendar as CalendarIcon, MoreHorizontal } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { format } from 'date-fns';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Campaign } from '@/types';
import { CampaignDialog } from './campaign-dialog';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { useCampaigns } from '@/hooks';
import { Trash2 } from 'lucide-react';

interface CampaignGridProps {
    campaigns: Campaign[];
    isLoading: boolean;
}

export function CampaignGrid({ campaigns, isLoading }: CampaignGridProps) {
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState<Campaign | undefined>(undefined);
    const { useDelete } = useCampaigns();
    const deleteMutation = useDelete();

    const [searchQuery, setSearchQuery] = useState('');

    const handleEdit = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
        setIsDialogOpen(true);
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <Card key={i} className="animate-pulse h-64 bg-muted/50" />
                ))}
            </div>
        );
    }

    const filtered = campaigns.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search campaigns..."
                actionButton={{
                    label: 'New Campaign',
                    onClick: () => {
                        setSelectedCampaign(undefined);
                        setIsDialogOpen(true);
                    },
                    icon: Plus
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-xl">
                        No campaigns matched your search.
                    </div>
                ) : (
                    filtered.map(campaign => (
                        <Card key={campaign.id} className="shadow-sm border-border/50 hover:border-primary/50 transition-colors flex flex-col group relative overflow-hidden">
                            <div className={`absolute top-0 left-0 right-0 h-1 
                 ${campaign.status === 'active' ? 'bg-primary' :
                                    campaign.status === 'scheduled' ? 'bg-orange-400' : 'bg-muted-foreground/30'}`}
                            />

                            <CardHeader className="pb-3 pt-5 flex flex-row items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg leading-tight truncate pr-4">{campaign.name}</h3>
                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                        <Badge variant={
                                            campaign.status === 'active' ? 'default' :
                                                campaign.status === 'scheduled' ? 'secondary' : 'outline'
                                        } className="capitalize text-[10px] py-0 px-1.5 font-medium mr-2">
                                            {campaign.status}
                                        </Badge>
                                        <span className="truncate">{campaign.type}</span>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="h-8 w-8 -mt-1 -mr-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-muted rounded-full">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEdit(campaign)}>
                                            <Mail className="h-4 w-4 mr-2" />
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleEdit(campaign)}>
                                            <TrendingUp className="h-4 w-4 mr-2" />
                                            Edit Campaign
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => setCampaignToDelete(campaign)}>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Campaign
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>

                            <CardContent className="space-y-4 pb-4 flex-1">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <CalendarIcon className="w-3.5 h-3.5 mr-2" />
                                    {format(campaign.startDate, 'MMM dd, yyyy')} - {campaign.endDate ? format(campaign.endDate, 'MMM dd, yyyy') : 'Ongoing'}
                                </div>

                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Users className="w-3.5 h-3.5 mr-2" />
                                    <span className="truncate">Targeted Audience</span>
                                </div>

                                {campaign.type !== 'webinar' && (
                                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/50">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground mb-1 flex items-center"><Mail className="w-3 h-3 mr-1" /> Sent</span>
                                            <span className="font-semibold">{(campaign.metrics?.sent || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground mb-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> Opened</span>
                                            <span className="font-semibold">{(campaign.metrics?.opened || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground mb-1 flex items-center"><MousePointerClick className="w-3 h-3 mr-1" /> Clicked</span>
                                            <span className="font-semibold">{(campaign.metrics?.clicked || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}

                                {campaign.budget > 0 && (
                                    <div className="mt-4 pt-4 border-t border-border/50 space-y-1.5">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Spent: ${campaign.spent.toLocaleString()}</span>
                                            <span>Budget: ${campaign.budget.toLocaleString()}</span>
                                        </div>
                                        <Progress value={(campaign.spent / campaign.budget) * 100} className="h-1.5" />
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="pt-0 pb-4">
                                <Button variant="secondary" className="w-full text-xs h-8">View Performance</Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
            <CampaignDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                campaign={selectedCampaign}
            />

            <ConfirmDialog
                open={!!campaignToDelete}
                onOpenChange={(open) => !open && setCampaignToDelete(undefined)}
                title="Delete Campaign"
                description={`Are you sure you want to delete the campaign "${campaignToDelete?.name}"? This action cannot be undone.`}
                confirmLabel="Delete Campaign"
                variant="destructive"
                onConfirm={() => {
                    if (campaignToDelete) {
                        deleteMutation.mutate(campaignToDelete.id);
                        setCampaignToDelete(undefined);
                    }
                }}
            />
        </div>
    );
}
