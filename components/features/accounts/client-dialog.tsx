'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useClients, useUsers } from '@/hooks';
import { ROUTES } from '@/constants';
import { Client, ClientStatus } from '@/types';

interface ClientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    client?: Client;
}

export function ClientDialog({ open, onOpenChange, client }: ClientDialogProps) {
    const router = useRouter();
    const { useCreate, useUpdate, useDelete } = useClients();
    const createClient = useCreate();
    const updateClient = useUpdate();
    const deleteClient = useDelete();

    const { useList: useUsersList } = useUsers();
    const { data: users } = useUsersList();

    const isEditMode = !!client;

    const [companyName, setCompanyName] = useState(client?.companyName || '');
    const [industry, setIndustry] = useState(client?.industry || '');
    const [website, setWebsite] = useState(client?.website || '');
    const [status, setStatus] = useState<ClientStatus>(client?.status || 'onboarding');
    const [accountManagerId, setAccountManagerId] = useState(client?.accountManagerId || '');
    const [totalRevenue, setTotalRevenue] = useState(client?.totalRevenue?.toString() || '');
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Sync state with client prop when it changes or when dialog opens
    useEffect(() => {
        if (open) {
            setCompanyName(client?.companyName || '');
            setIndustry(client?.industry || '');
            setWebsite(client?.website || '');
            setStatus(client?.status || 'onboarding');
            setAccountManagerId(client?.accountManagerId || '');
            setTotalRevenue(client?.totalRevenue?.toString() || '');
            setError('');
        }
    }, [open, client]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!companyName.trim()) {
            setError('Company Name is required');
            return;
        }

        const now = Date.now();
        const revenueNum = parseFloat(totalRevenue) || 0;

        if (isEditMode && client) {
            updateClient.mutate({
                id: client.id,
                data: {
                    companyName,
                    industry,
                    website: website || null,
                    status,
                    totalRevenue: revenueNum,
                    accountManagerId: accountManagerId || 'unassigned',
                    updatedAt: now,
                }
            }, {
                onSuccess: () => {
                    onOpenChange(false);
                },
                onError: (err) => {
                    setError(err instanceof Error ? err.message : 'Failed to update account');
                }
            });
        } else {
            createClient.mutate({
                companyName,
                industry,
                website: website || null,
                primaryContactId: null,
                accountManagerId: accountManagerId || 'unassigned',
                status,
                totalRevenue: revenueNum,
                onboardingProgress: status === 'onboarding' ? 0 : 100,
                createdAt: now,
                updatedAt: now,
            }, {
                onSuccess: () => {
                    setCompanyName('');
                    setIndustry('');
                    setWebsite('');
                    setStatus('onboarding');
                    setAccountManagerId('');
                    setTotalRevenue('');
                    onOpenChange(false);
                },
                onError: (err) => {
                    setError(err instanceof Error ? err.message : 'Failed to create account');
                }
            });
        }
    };

    const handleDelete = async () => {
        if (!client || !confirm('Are you sure you want to delete this account? This action cannot be undone.')) return;

        setIsDeleting(true);
        deleteClient.mutate(client.id, {
            onSuccess: () => {
                onOpenChange(false);
                router.push(ROUTES.ACCOUNTS);
            },
            onError: (err) => {
                setError(err instanceof Error ? err.message : 'Failed to delete account');
                setIsDeleting(false);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Account' : 'Add New Account'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? 'Update the client account details below.'
                            : 'Create a new client account to track revenue and contacts.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                            id="companyName"
                            placeholder="Enter company name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Input
                                id="industry"
                                placeholder="e.g. Technology"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="onboarding">Onboarding</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                            id="website"
                            placeholder="https://example.com"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="totalRevenue">Estimated Revenue</Label>
                            <Input
                                id="totalRevenue"
                                type="number"
                                placeholder="0"
                                value={totalRevenue}
                                onChange={(e) => setTotalRevenue(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="accountManagerId">Account Manager</Label>
                            <Select value={accountManagerId} onValueChange={setAccountManagerId}>
                                <SelectTrigger id="accountManagerId">
                                    <SelectValue placeholder="Select manager" />
                                </SelectTrigger>
                                <SelectContent>
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
                    </div>

                    {error && (
                        <div className="text-sm text-destructive font-medium">
                            {error}
                        </div>
                    )}

                    <DialogFooter className="pt-4 flex items-center justify-between sm:justify-between">
                        {isEditMode ? (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting || updateClient.isPending}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Account'}
                            </Button>
                        ) : <div />}
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createClient.isPending || updateClient.isPending}>
                                {isEditMode
                                    ? (updateClient.isPending ? 'Saving...' : 'Save Changes')
                                    : (createClient.isPending ? 'Creating...' : 'Create Account')}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
