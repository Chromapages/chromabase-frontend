'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, UserPlus } from 'lucide-react';
import { useUsers } from '@/hooks';
import { User, Role } from '@/types';

interface UserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User;
}

const ROLES: { value: Role; label: string }[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'sales_manager', label: 'Sales Manager' },
    { value: 'account_manager', label: 'Account Manager' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'member', label: 'Member' },
];

export function UserDialog({ open, onOpenChange, user }: UserDialogProps) {
    const isEdit = !!user;
    const { useCreate, useUpdate, useDelete } = useUsers();
    const createUser = useCreate();
    const updateUser = useUpdate();
    const deleteUser = useDelete();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Role>('member');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            if (user) {
                setFirstName(user.firstName || '');
                setLastName(user.lastName || '');
                setEmail(user.email || '');
                setRole(user.role || 'member');
                setAvatarUrl(user.avatarUrl || '');
            } else {
                setFirstName('');
                setLastName('');
                setEmail('');
                setRole('member');
                setAvatarUrl('');
            }
            setError('');
        }
    }, [open, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!firstName.trim() || !lastName.trim() || !email.trim()) {
            setError('All fields are required');
            return;
        }

        const now = Date.now();
        const data = {
            firstName,
            lastName,
            email,
            role,
            avatarUrl: avatarUrl || null,
            updatedAt: now,
        };

        if (isEdit && user) {
            updateUser.mutate({ id: user.id, data }, {
                onSuccess: () => onOpenChange(false),
                onError: (err) => setError(err instanceof Error ? err.message : 'Failed to update user')
            });
        } else {
            createUser.mutate({
                ...data,
                createdAt: now,
            }, {
                onSuccess: () => onOpenChange(false),
                onError: (err) => setError(err instanceof Error ? err.message : 'Failed to add user')
            });
        }
    };

    const handleDelete = () => {
        if (!user) return;
        deleteUser.mutate(user.id, {
            onSuccess: () => onOpenChange(false),
            onError: (err) => setError(err instanceof Error ? err.message : 'Failed to delete user')
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Update member profile and role permissions.' : 'Invite a new member to join the ChromaBase team.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                placeholder="Jane"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                placeholder="Doe"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="jane@chromabase.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isEdit}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={role} onValueChange={(v: Role) => setRole(v)}>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ROLES.map((r) => (
                                        <SelectItem key={r.value} value={r.value}>
                                            {r.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="avatarUrl">Avatar URL (Optional)</Label>
                            <Input
                                id="avatarUrl"
                                placeholder="https://..."
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
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
                                    <AlertDialogTrigger asChild>
                                        <Button type="button" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Remove
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will remove the user from the team. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                Remove Member
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
                            <Button type="submit" disabled={createUser.isPending || updateUser.isPending}>
                                {isEdit ? (updateUser.isPending ? 'Saving...' : 'Update Member') : (createUser.isPending ? 'Inviting...' : 'Add Member')}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
