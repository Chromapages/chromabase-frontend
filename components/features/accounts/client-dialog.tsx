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
import { cn } from '@/lib/utils';
import { Trash2, X, Building2, Globe, Briefcase, User, CircleDollarSign } from 'lucide-react';

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
                onError: (err: Error) => {
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
                onError: (err: Error) => {
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
            onError: (err: Error) => {
                setError(err instanceof Error ? err.message : 'Failed to delete account');
                setIsDeleting(false);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-white/10 glass-md shadow-2xl bg-black/40 backdrop-blur-xl">
                <div className="absolute top-4 right-4 z-50">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-sm text-muted-foreground/40 hover:text-foreground hover:bg-white/5"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-8 pb-4">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-sm bg-chroma-orange/10 border border-chroma-orange/20 flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-chroma-orange" />
                            </div>
                            <div>
                                <DialogTitle className="text-[20px] font-bold tracking-tight font-display mb-1 uppercase">
                                    {isEditMode ? 'Edit Account' : 'New Account'}
                                </DialogTitle>
                                <DialogDescription className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest font-sans">
                                    {isEditMode ? 'Update company credentials' : 'Add new company to database'}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
                    {/* Main Company Field */}
                    <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 ml-1">
                            Company Identity
                        </Label>
                        <div className="relative group">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/20 group-focus-within:text-chroma-orange transition-colors" />
                            <Input
                                id="companyName"
                                placeholder="ENTER COMPANY NAME..."
                                className="pl-12 bg-white/5 border-white/10 h-12 text-[12px] font-bold tracking-widest placeholder:text-muted-foreground/10 focus:border-chroma-orange/50 transition-all rounded-sm uppercase"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="industry" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 ml-1">
                                Industry / Sector
                            </Label>
                            <div className="relative group">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/20 group-focus-within:text-chroma-orange transition-colors" />
                                <Input
                                    id="industry"
                                    placeholder="TECHNOLOGY..."
                                    className="pl-12 bg-white/5 border-white/10 h-12 text-[12px] font-bold tracking-widest placeholder:text-muted-foreground/10 focus:border-chroma-orange/50 transition-all rounded-sm uppercase"
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 ml-1">
                                Lifecycle Status
                            </Label>
                            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                                <SelectTrigger id="status" className="h-12 bg-white/5 border-white/10 rounded-sm text-[11px] font-bold uppercase tracking-widest focus:ring-chroma-orange/50">
                                    <SelectValue placeholder="STATUS" />
                                </SelectTrigger>
                                <SelectContent className="glass-md border-white/10 p-1">
                                    <SelectItem value="active" className="text-[11px] font-bold uppercase tracking-wider">Active Portfolio</SelectItem>
                                    <SelectItem value="onboarding" className="text-[11px] font-bold uppercase tracking-wider">Onboarding Phase</SelectItem>
                                    <SelectItem value="inactive" className="text-[11px] font-bold uppercase tracking-wider">Inactive / Dormant</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="website" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 ml-1">
                            Digital Presence
                        </Label>
                        <div className="relative group">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/20 group-focus-within:text-chroma-orange transition-colors" />
                            <Input
                                id="website"
                                placeholder="HTTPS://COMPANY.COM"
                                className="pl-12 bg-white/5 border-white/10 h-12 text-[12px] font-bold tracking-widest placeholder:text-muted-foreground/10 focus:border-chroma-orange/50 transition-all rounded-sm lowercase"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="totalRevenue" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 ml-1">
                                Financial Value
                            </Label>
                            <div className="relative group">
                                <CircleDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/20 group-focus-within:text-chroma-orange transition-colors" />
                                <Input
                                    id="totalRevenue"
                                    type="number"
                                    placeholder="0"
                                    className="pl-12 bg-white/5 border-white/10 h-12 text-[12px] font-bold tracking-widest placeholder:text-muted-foreground/10 focus:border-chroma-orange/50 transition-all rounded-sm"
                                    value={totalRevenue}
                                    onChange={(e) => setTotalRevenue(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="accountManagerId" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 ml-1">
                                Relationship Lead
                            </Label>
                            <Select value={accountManagerId} onValueChange={setAccountManagerId}>
                                <SelectTrigger id="accountManagerId" className="h-12 bg-white/5 border-white/10 rounded-sm text-[11px] font-bold uppercase tracking-widest focus:ring-chroma-orange/50">
                                    <div className="flex items-center gap-2">
                                        <User className="h-3.5 w-3.5 text-muted-foreground/40" />
                                        <SelectValue placeholder="SELECT MANAGER" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="glass-md border-white/10 p-1">
                                    {users?.map((user: any) => {
                                        const displayName = user.displayName ||
                                            (user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : null) ||
                                            user.name ||
                                            (user.email ? user.email.split('@')[0] : 'Unknown User');
                                        return (
                                            <SelectItem key={user.id} value={user.id} className="text-[11px] font-bold uppercase tracking-wider">
                                                {displayName}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {error && (
                        <div className="text-[10px] font-bold text-destructive uppercase tracking-widest bg-destructive/10 p-3 border border-destructive/20 rounded-sm">
                            {error}
                        </div>
                    )}

                    <DialogFooter className="pt-6 border-t border-white/5 flex items-center justify-between sm:justify-between w-full">
                        {isEditMode ? (
                            <Button
                                type="button"
                                variant="ghost"
                                className="h-12 px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-destructive hover:bg-destructive/10 hover:text-destructive rounded-sm transition-all"
                                onClick={handleDelete}
                                disabled={isDeleting || updateClient.isPending}
                            >
                                <Trash2 className="h-3.5 w-3.5 mr-2" />
                                {isDeleting ? 'Removing...' : 'Remove Account'}
                            </Button>
                        ) : <div />}
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="glass"
                                className="h-12 px-6 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm"
                                onClick={() => onOpenChange(false)}
                                disabled={isDeleting || createClient.isPending || updateClient.isPending}
                            >
                                Discard
                            </Button>
                            <Button
                                type="submit"
                                className="h-12 px-8 bg-chroma-orange text-white hover:bg-chroma-orange/90 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm shadow-lg shadow-chroma-orange/20 transition-all"
                                disabled={createClient.isPending || updateClient.isPending}
                            >
                                {isEditMode
                                    ? (updateClient.isPending ? 'Saving...' : 'Confirm Changes')
                                    : (createClient.isPending ? 'Syncing...' : 'Create Account')}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
