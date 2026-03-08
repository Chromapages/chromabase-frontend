'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { useLeads, useUsers } from '@/hooks';
import { Lead, LeadStatus } from '@/types';
import { ROUTES } from '@/constants';

interface LeadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lead?: Lead;
}

export function LeadDialog({ open, onOpenChange, lead }: LeadDialogProps) {
    const router = useRouter();
    const isEdit = !!lead;
    const { useCreate, useUpdate, useDelete } = useLeads();
    const createLead = useCreate();
    const updateLead = useUpdate();
    const deleteLead = useDelete();

    const { useList: useUsersList } = useUsers();
    const { data: users } = useUsersList();

    const [companyName, setCompanyName] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [status, setStatus] = useState<LeadStatus>('new');
    const [value, setValue] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            if (lead) {
                setCompanyName(lead.companyName || '');
                setContactName(lead.contactName || '');
                setContactEmail(lead.contactEmail || '');
                setContactPhone(lead.contactPhone || '');
                setStatus(lead.status || 'new');
                setValue(lead.value?.toString() || '');
                setAssignedTo(lead.assignedTo || '');
                setNotes(lead.notes || '');
            } else {
                setCompanyName('');
                setContactName('');
                setContactEmail('');
                setContactPhone('');
                setStatus('new');
                setValue('');
                setAssignedTo('');
                setNotes('');
            }
            setError('');
        }
    }, [open, lead]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!companyName.trim() && !contactName.trim()) {
            setError('Company Name or Contact Name is required');
            return;
        }

        const now = Date.now();
        const leadValueNum = parseFloat(value) || 0;

        const data = {
            companyName,
            contactName,
            contactEmail,
            contactPhone: contactPhone || null,
            source: lead?.source || 'Manual Entry',
            status,
            value: leadValueNum,
            assignedTo: assignedTo || 'unassigned',
            notes,
            updatedAt: now,
        };

        if (isEdit && lead) {
            updateLead.mutate({ id: lead.id, data }, {
                onSuccess: () => onOpenChange(false),
                onError: (err) => setError(err instanceof Error ? err.message : 'Failed to update lead')
            });
        } else {
            createLead.mutate({
                ...data,
                createdAt: now,
            }, {
                onSuccess: () => onOpenChange(false),
                onError: (err) => setError(err instanceof Error ? err.message : 'Failed to create lead')
            });
        }
    };

    const handleDelete = () => {
        if (!lead) return;
        deleteLead.mutate(lead.id, {
            onSuccess: () => {
                onOpenChange(false);
                router.push(ROUTES.LEADS);
            },
            onError: (err) => {
                setError(err instanceof Error ? err.message : 'Failed to delete lead');
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Update lead information and stage.' : 'Create a new sales lead to track in the pipeline.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input
                                id="companyName"
                                placeholder="Enter company"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contactName">Contact Name</Label>
                            <Input
                                id="contactName"
                                placeholder="Enter name"
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contactEmail">Email</Label>
                            <Input
                                id="contactEmail"
                                type="email"
                                placeholder="john@example.com"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contactPhone">Phone</Label>
                            <Input
                                id="contactPhone"
                                placeholder="+1 (555) 000-0000"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="value">Estimated Value</Label>
                            <Input
                                id="value"
                                type="number"
                                placeholder="0"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Stage</Label>
                            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select stage" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">New Lead</SelectItem>
                                    <SelectItem value="contacted">Contacted</SelectItem>
                                    <SelectItem value="meeting_scheduled">Meeting Scheduled</SelectItem>
                                    <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                                    <SelectItem value="won">Closed Won</SelectItem>
                                    <SelectItem value="lost">Closed Lost</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="assignedTo">Assigned To</Label>
                        <Select value={assignedTo} onValueChange={setAssignedTo}>
                            <SelectTrigger id="assignedTo">
                                <SelectValue placeholder="Select member" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="unassigned">Unassigned</SelectItem>
                                {users?.map((user: any) => {
                                    const displayName = user.displayName ||
                                        (user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : null) ||
                                        user.name ||
                                        (user.email ? user.email.split('@')[0] : 'Unknown User');
                                    return (
                                        <SelectItem key={user.id} value={user.id}>
                                            {displayName}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <textarea
                            id="notes"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Add lead notes..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
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
                                    <AlertDialogTrigger asChild>
                                        <Button type="button" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete the lead. This action cannot be undone.
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
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createLead.isPending || updateLead.isPending}>
                                {isEdit ? (updateLead.isPending ? 'Saving...' : 'Save Changes') : (createLead.isPending ? 'Creating...' : 'Create Lead')}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
