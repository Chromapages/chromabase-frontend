'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useDeals, useClients, useUsers } from '@/hooks';
import { Deal, DealStage } from '@/types';
import { DEAL_STAGE_OPTIONS } from '@/constants';
import { Calendar, Building2, User, DollarSign, Percent, FileText } from 'lucide-react';

interface DealDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    deal?: Deal | null;
}

export function DealDialog({ open, onOpenChange, deal }: DealDialogProps) {
    const { useCreate, useUpdate } = useDeals();
    const createDeal = useCreate();
    const updateDeal = useUpdate();
    
    const { useList: useClientsList } = useClients();
    const { data: clients } = useClientsList();
    
    const { useList: useUsersList } = useUsers();
    const { data: users } = useUsersList();

    const [name, setName] = useState('');
    const [clientId, setClientId] = useState('');
    const [value, setValue] = useState('');
    const [stage, setStage] = useState<DealStage>('discovery');
    const [closeDate, setCloseDate] = useState('');
    const [ownerId, setOwnerId] = useState('');
    const [notes, setNotes] = useState('');
    const [probability, setProbability] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (deal) {
            setName(deal.name);
            setClientId(deal.clientId);
            setValue(deal.value?.toString() || '');
            setStage(deal.stage);
            setCloseDate(deal.closeDate ? new Date(deal.closeDate).toISOString().split('T')[0] : '');
            setOwnerId(deal.ownerId);
            setNotes(deal.notes || '');
            setProbability(deal.probability?.toString() || '');
        } else {
            setName('');
            setClientId('');
            setValue('');
            setStage('discovery');
            setCloseDate('');
            setOwnerId('');
            setNotes('');
            setProbability('');
        }
        setError('');
    }, [deal, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Deal name is required');
            return;
        }
        if (!clientId) {
            setError('Client is required');
            return;
        }
        if (!ownerId) {
            setError('Owner is required');
            return;
        }

        const dealData = {
            name,
            clientId,
            value: value ? parseFloat(value) : 0,
            stage,
            closeDate: closeDate ? new Date(closeDate).getTime() : null,
            ownerId,
            notes: notes || undefined,
            probability: probability ? parseInt(probability) : undefined,
        };

        try {
            if (deal) {
                await updateDeal.mutateAsync({ id: deal.id, data: dealData });
            } else {
                await createDeal.mutateAsync(dealData);
            }
            onOpenChange(false);
        } catch (err) {
            setError('Failed to save deal. Please try again.');
            console.error(err);
        }
    };

    const getStageColor = (s: DealStage) => {
        switch (s) {
            case 'discovery': return 'text-blue-500';
            case 'proposal': return 'text-amber-500';
            case 'negotiation': return 'text-purple-500';
            case 'closed_won': return 'text-emerald-500';
            case 'closed_lost': return 'text-red-500';
            default: return 'text-muted-foreground';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{deal ? 'Edit Deal' : 'New Deal'}</DialogTitle>
                    <DialogDescription>
                        {deal ? 'Update the deal details below.' : 'Create a new deal to track in your pipeline.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {/* Deal Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Deal Name *</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Q1 Website Redesign"
                        />
                    </div>

                    {/* Client */}
                    <div className="space-y-2">
                        <Label htmlFor="client">Client *</Label>
                        <Select value={clientId} onValueChange={setClientId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a client" />
                            </SelectTrigger>
                            <SelectContent>
                                {clients?.map((client) => (
                                    <SelectItem key={client.id} value={client.id}>
                                        {client.companyName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Value & Stage Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="value">Deal Value</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="value"
                                    type="number"
                                    min="0"
                                    step="100"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="0"
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stage">Stage *</Label>
                            <Select value={stage} onValueChange={(v) => setStage(v as DealStage)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {DEAL_STAGE_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            <span className={getStageColor(option.value as DealStage)}>
                                                {option.label}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Probability & Close Date Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="probability">Probability (%)</Label>
                            <div className="relative">
                                <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="probability"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={probability}
                                    onChange={(e) => setProbability(e.target.value)}
                                    placeholder="50"
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="closeDate">Expected Close</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="closeDate"
                                    type="date"
                                    value={closeDate}
                                    onChange={(e) => setCloseDate(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Owner */}
                    <div className="space-y-2">
                        <Label htmlFor="owner">Owner *</Label>
                        <Select value={ownerId} onValueChange={setOwnerId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an owner" />
                            </SelectTrigger>
                            <SelectContent>
                                {users?.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.firstName} {user.lastName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any notes about this deal..."
                            rows={3}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createDeal.isPending || updateDeal.isPending}>
                            {createDeal.isPending || updateDeal.isPending ? 'Saving...' : deal ? 'Update Deal' : 'Create Deal'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
