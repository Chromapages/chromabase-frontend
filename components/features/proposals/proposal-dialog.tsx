'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useProposals, useClients } from '@/hooks';
import { ProposalStatus, Proposal } from '@/types';
import { useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

interface ProposalDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    proposal?: Proposal;
}

export function ProposalDialog({ open, onOpenChange, proposal }: ProposalDialogProps) {
    const isEdit = !!proposal;
    const { useCreate, useUpdate, useDelete } = useProposals();
    const createProposal = useCreate();
    const updateProposal = useUpdate();
    const deleteProposal = useDelete();

    const { useList: useClientList } = useClients();
    const { data: clients } = useClientList();

    const [title, setTitle] = useState('');
    const [clientId, setClientId] = useState('');
    const [value, setValue] = useState('');
    const [validUntil, setValidUntil] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [status, setStatus] = useState<ProposalStatus>('draft');
    const [error, setError] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        if (proposal) {
            setTitle(proposal.title);
            setClientId(proposal.clientId);
            setValue(proposal.value.toString());
            setValidUntil(new Date(proposal.validUntil).toISOString().split('T')[0]);
            setStatus(proposal.status);
        } else {
            setTitle('');
            setClientId('');
            setValue('');
            setValidUntil(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
            setStatus('draft');
        }
        setError('');
    }, [proposal, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        if (!clientId) {
            setError('Client is required');
            return;
        }

        const valueNum = parseFloat(value) || 0;
        const validTimestamp = new Date(validUntil).getTime();

        const data = {
            title,
            clientId,
            status,
            value: valueNum,
            validUntil: validTimestamp,
            updatedAt: Date.now(),
        };

        if (isEdit && proposal) {
            updateProposal.mutate({ id: proposal.id, data }, {
                onSuccess: () => onOpenChange(false),
                onError: (err) => setError(err instanceof Error ? err.message : 'Failed to update proposal')
            });
        } else {
            createProposal.mutate({
                ...data,
                leadId: null,
                content: '# New Proposal\n\nGenerated efficiently.',
                attachments: [],
                createdAt: Date.now(),
            }, {
                onSuccess: () => onOpenChange(false),
                onError: (err) => setError(err instanceof Error ? err.message : 'Failed to create proposal')
            });
        }
    };

    const handleDelete = () => {
        if (!proposal) return;
        deleteProposal.mutate(proposal.id, {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                onOpenChange(false);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <DialogTitle>{isEdit ? 'Edit Proposal' : 'Add New Proposal'}</DialogTitle>
                        <DialogDescription>
                            {isEdit ? 'Update proposal details and status.' : 'Draft a new proposal for an existing client.'}
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Proposal Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Q3 Marketing Scope"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="clientId">Client</Label>
                        <Select value={clientId} onValueChange={setClientId}>
                            <SelectTrigger id="clientId">
                                <SelectValue placeholder="Select client" />
                            </SelectTrigger>
                            <SelectContent>
                                {clients?.map((client: any) => (
                                    <SelectItem key={client.id} value={client.id}>
                                        {client.companyName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="value">Proposal Value</Label>
                            <Input
                                id="value"
                                type="number"
                                placeholder="0"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="validUntil">Valid Until</Label>
                            <Input
                                id="validUntil"
                                type="date"
                                value={validUntil}
                                onChange={(e) => setValidUntil(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Initial Status</Label>
                        <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="sent">Sent</SelectItem>
                                <SelectItem value="under_review">Under Review</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {error && (
                        <div className="text-sm text-destructive font-medium">
                            {error}
                        </div>
                    )}

                    <DialogFooter className="pt-4 flex items-center justify-between sm:justify-between">
                        {isEdit ? (
                            <Button
                                type="button"
                                variant="ghost"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => setIsDeleteDialogOpen(true)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </Button>
                        ) : <div />}
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createProposal.isPending || updateProposal.isPending}>
                                {createProposal.isPending || updateProposal.isPending ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Proposal')}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the proposal
                            and remove it from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    );
}
