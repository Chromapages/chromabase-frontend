'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { useCampaigns } from '@/hooks';
import { Campaign, CampaignType, CampaignStatus } from '@/types';

interface CampaignDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    campaign?: Campaign;
}

const CAMPAIGN_TYPES: { value: CampaignType; label: string }[] = [
    { value: 'email', label: 'Email Sequence' },
    { value: 'social', label: 'Social Media' },
    { value: 'ad', label: 'Paid Advertising' },
    { value: 'webinar', label: 'Webinar / Event' },
    { value: 'other', label: 'Other' },
];

const CAMPAIGN_STATUSES: { value: CampaignStatus; label: string }[] = [
    { value: 'draft', label: 'Draft' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'completed', label: 'Completed' },
];

export function CampaignDialog({ open, onOpenChange, campaign }: CampaignDialogProps) {
    const isEdit = !!campaign;
    const { useCreate, useUpdate, useDelete } = useCampaigns();
    const createCampaign = useCreate();
    const updateCampaign = useUpdate();
    const deleteCampaign = useDelete();

    const [name, setName] = useState('');
    const [type, setType] = useState<CampaignType>('email');
    const [status, setStatus] = useState<CampaignStatus>('draft');
    const [budget, setBudget] = useState('0');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            if (campaign) {
                setName(campaign.name || '');
                setType(campaign.type || 'email');
                setStatus(campaign.status || 'draft');
                setBudget(campaign.budget?.toString() || '0');
                setStartDate(campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : '');
                setEndDate(campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : '');
            } else {
                setName('');
                setType('email');
                setStatus('draft');
                setBudget('0');
                setStartDate(new Date().toISOString().split('T')[0]);
                setEndDate('');
            }
            setError('');
        }
    }, [open, campaign]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Campaign name is required');
            return;
        }

        const data = {
            name,
            type,
            status,
            budget: parseFloat(budget) || 0,
            startDate: startDate ? new Date(startDate).getTime() : Date.now(),
            endDate: endDate ? new Date(endDate).getTime() : null,
            updatedAt: Date.now(),
        };

        if (isEdit && campaign) {
            updateCampaign.mutate({ id: campaign.id, data }, {
                onSuccess: () => onOpenChange(false),
                onError: (err) => setError(err instanceof Error ? err.message : 'Failed to update campaign')
            });
        } else {
            createCampaign.mutate({
                ...data,
                spent: 0,
                metrics: { sent: 0, opened: 0, clicked: 0, converted: 0, revenue: 0 },
                createdAt: Date.now(),
            }, {
                onSuccess: () => onOpenChange(false),
                onError: (err) => setError(err instanceof Error ? err.message : 'Failed to create campaign')
            });
        }
    };

    const handleDelete = () => {
        if (!campaign) return;
        deleteCampaign.mutate(campaign.id, {
            onSuccess: () => onOpenChange(false),
            onError: (err) => setError(err instanceof Error ? err.message : 'Failed to delete campaign')
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Campaign' : 'Create New Campaign'}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Update your campaign details and settings.' : 'Launch a new marketing initiative or event sequence.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Campaign Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Q4 Growth Sequence"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Channel</Label>
                            <Select value={type} onValueChange={(v: CampaignType) => setType(v)}>
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CAMPAIGN_TYPES.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={status} onValueChange={(v: CampaignStatus) => setStatus(v)}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CAMPAIGN_STATUSES.map((s) => (
                                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="budget">Budget (USD)</Label>
                        <Input
                            id="budget"
                            type="number"
                            placeholder="0.00"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date (Optional)</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-destructive font-medium">
                            {error}
                        </div>
                    )}

                    <DialogFooter className="flex items-center justify-between pt-4">
                        <div className="flex-1">
                            {isEdit && (
                                <AlertDialog>
                                    <Button asChild variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </Button>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete this campaign and all associated data.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                Delete Campaign
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createCampaign.isPending || updateCampaign.isPending}>
                                {isEdit ? (updateCampaign.isPending ? 'Saving...' : 'Update') : (createCampaign.isPending ? 'Creating...' : 'Create Campaign')}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
