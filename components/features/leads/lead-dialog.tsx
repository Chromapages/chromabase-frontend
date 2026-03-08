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
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden glass-md border-white/10 shadow-2xl border-0">
                <DialogHeader className="p-6 pb-4 border-b border-white/5 bg-white/5">
                    <DialogTitle className="text-[18px] font-bold text-foreground font-display tracking-tight uppercase">
                        {isEdit ? 'Edit Lead' : 'Add New Lead'}
                    </DialogTitle>
                    <DialogDescription className="text-[11px] font-bold text-muted-foreground/40 font-sans tracking-wide uppercase mt-1">
                        {isEdit ? 'Update lead information and stage.' : 'Create a new sales lead to track in the pipeline.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="companyName" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
                                Company Name
                            </Label>
                            <Input
                                id="companyName"
                                placeholder="CHROMA INC."
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="h-11 bg-white/5 border-white/10 focus:border-chroma-orange/50 transition-all font-medium placeholder:text-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contactName" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
                                Contact Name
                            </Label>
                            <Input
                                id="contactName"
                                placeholder="Enter name"
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                className="h-11 bg-white/5 border-white/10 focus:border-chroma-orange/50 transition-all font-medium placeholder:text-white/10"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="contactEmail" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
                                Email Address
                            </Label>
                            <Input
                                id="contactEmail"
                                type="email"
                                placeholder="john@example.com"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                className="h-11 bg-white/5 border-white/10 focus:border-chroma-orange/50 transition-all font-medium placeholder:text-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contactPhone" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
                                Phone Number
                            </Label>
                            <Input
                                id="contactPhone"
                                placeholder="+1 (555) 000-0000"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                className="h-11 bg-white/5 border-white/10 focus:border-chroma-orange/50 transition-all font-medium placeholder:text-white/10"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="value" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
                                Estimated Value
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-[14px] font-bold">$</span>
                                <Input
                                    id="value"
                                    type="number"
                                    placeholder="0"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="h-11 pl-7 bg-white/5 border-white/10 focus:border-chroma-orange/50 transition-all font-medium placeholder:text-white/10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
                                Current Stage
                            </Label>
                            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                                <SelectTrigger id="status" className="h-11 bg-white/5 border-white/10 focus:border-chroma-orange/50 transition-all font-medium">
                                    <SelectValue placeholder="Select stage" />
                                </SelectTrigger>
                                <SelectContent className="glass-md border-white/10 shadow-xl">
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
                        <Label htmlFor="assignedTo" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
                            Assigned Member
                        </Label>
                        <Select value={assignedTo} onValueChange={setAssignedTo}>
                            <SelectTrigger id="assignedTo" className="h-11 bg-white/5 border-white/10 focus:border-chroma-orange/50 transition-all font-medium">
                                <SelectValue placeholder="Select member" />
                            </SelectTrigger>
                            <SelectContent className="glass-md border-white/10 shadow-xl">
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
                        <Label htmlFor="notes" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
                            Additional Notes
                        </Label>
                        <textarea
                            id="notes"
                            className="flex min-h-[100px] w-full rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background placeholder:text-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-chroma-orange/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                            placeholder="Add lead notes..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-sm bg-destructive/10 border border-destructive/20 text-[11px] font-bold text-destructive uppercase tracking-wider">
                            {error}
                        </div>
                    )}

                    <DialogFooter className="flex items-center justify-between pt-6 border-t border-white/5 sm:justify-between">
                        <div className="flex-1">
                            {isEdit && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button type="button" variant="ghost" className="h-11 px-6 text-destructive hover:text-destructive hover:bg-destructive/10 uppercase text-[10px] tracking-[0.2em] font-bold rounded-sm">
                                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                                            Delete Lead
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="glass-md border-white/10">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-[16px] font-bold uppercase tracking-tight">Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-xs text-muted-foreground/60 uppercase font-bold tracking-wider">
                                                This action will permanently delete this lead record. This is irreversible.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="rounded-sm uppercase text-[10px] tracking-widest font-bold h-11 border-white/10 bg-white/5">Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDelete} className="rounded-sm uppercase text-[10px] tracking-widest font-bold h-11 bg-destructive text-white hover:bg-destructive/90 transition-all shadow-lg shadow-destructive/20">
                                                Delete Permanent
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="glass"
                                className="h-11 px-6 rounded-sm uppercase text-[10px] tracking-[0.2em] font-bold"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createLead.isPending || updateLead.isPending}
                                className="h-11 px-8 rounded-sm bg-chroma-orange text-white hover:bg-chroma-orange/90 uppercase text-[10px] tracking-[0.2em] font-bold shadow-lg shadow-chroma-orange/20 transition-all"
                            >
                                {isEdit ? (updateLead.isPending ? 'SAVING...' : 'SAVE CHANGES') : (createLead.isPending ? 'CREATING...' : 'CREATE LEAD')}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
