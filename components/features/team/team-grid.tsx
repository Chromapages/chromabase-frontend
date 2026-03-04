'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FilterBar } from '@/components/shared/filter-bar';
import { Plus, Mail, Phone, MoreHorizontal, Clock, Target, Users as UsersIcon, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User } from '@/types';
import { UserDialog } from './user-dialog';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { useUsers } from '@/hooks';

interface TeamGridProps {
    users: User[] | undefined;
    isLoading: boolean;
}

export function TeamGrid({ users, isLoading }: TeamGridProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
    const [userToDelete, setUserToDelete] = useState<User | undefined>(undefined);
    const { useDelete } = useUsers();
    const deleteMutation = useDelete();

    const filteredUsers = (users || []).filter(user => {
        const displayName = (user as any).displayName ||
            (user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : null) ||
            (user as any).name ||
            (user.email ? user.email.split('@')[0] : 'Unknown User');
        const searchName = displayName.toLowerCase();
        const role = (user.role || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        return searchName.includes(query) || role.includes(query);
    });

    const getRoleColor = (role?: string) => {
        switch (role) {
            case 'admin': return 'bg-destructive/10 text-destructive hover:bg-destructive/20';
            case 'sales_manager': return 'bg-primary/10 text-primary hover:bg-primary/20';
            case 'account_manager': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
            case 'marketing': return 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getInitials = (firstName?: string, lastName?: string) => {
        const first = firstName ? firstName.charAt(0) : '';
        const last = lastName ? lastName.charAt(0) : '';
        return `${first}${last}`.toUpperCase() || '?';
    };

    const getSimulatedMetrics = (id: string) => {
        const safeId = id || 'default';
        const hash = safeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return {
            activeLeads: (hash % 15) + 5,
            winRate: (hash % 40) + 20,
            responseTime: (hash % 24) + 1,
            isOnline: hash % 2 === 0
        };
    };

    const handleAddMember = () => {
        setSelectedUser(undefined);
        setIsDialogOpen(true);
    };

    const handleEditMember = (user: User) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search team members by name or role..."
                actionButton={{
                    label: 'Add Member',
                    onClick: handleAddMember,
                    icon: Plus
                }}
            />

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader className="h-24 bg-muted/50"></CardHeader>
                            <CardContent className="h-48"></CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredUsers.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-xl">
                            No team members match your search.
                        </div>
                    ) : (
                        filteredUsers.map(user => {
                            const metrics = getSimulatedMetrics(user.id);
                            const displayName = (user as any).displayName ||
                                (user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : null) ||
                                (user as any).name ||
                                (user.email ? user.email.split('@')[0] : 'Unknown User');
                            return (
                                <Card key={user.id} className="shadow-sm border-border/50 hover:border-primary/50 transition-colors overflow-hidden group">
                                    <div className="h-16 bg-muted/30 w-full"></div>
                                    <div className="px-6 relative pb-4 cursor-pointer" onClick={() => router.push(`/team/${user.id}`)}>
                                        <div className="absolute -top-10 left-6">
                                            <div className="relative">
                                                <Avatar className="w-20 h-20 border-4 border-card rounded-full shadow-sm">
                                                    <AvatarImage src={user.avatarUrl || ''}  alt="User avatar" />
                                                    <AvatarFallback className="text-xl bg-primary/10 text-primary">{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                                                </Avatar>
                                                <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-card ${metrics.isOnline ? 'bg-green-500' : 'bg-muted-foreground'}`}></div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-3">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-muted rounded-full" onClick={(e) => e.stopPropagation()}>
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEditMember(user)}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Edit Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => setUserToDelete(user)}>
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Remove Member
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="mt-2 text-left">
                                            <h3 className="font-semibold text-lg">{displayName}</h3>
                                            <p className="text-sm text-muted-foreground flex items-center mt-1 truncate" title={user.email || 'No email provided'}>
                                                <Mail className="w-3.5 h-3.5 mr-1.5 shrink-0" /> {user.email || 'No email provided'}
                                            </p>

                                            <div className="mt-3">
                                                <Badge variant="secondary" className={`capitalize font-medium text-xs ${getRoleColor(user.role)}`}>
                                                    {(user.role || 'Member').replace('_', ' ')}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-border/50 bg-muted/10 p-4">
                                        <div className="grid grid-cols-3 gap-2 text-center divide-x divide-border/50">
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center font-medium"><UsersIcon className="w-3 h-3 mr-1" /> Leads</span>
                                                <span className="font-semibold text-foreground">{metrics.activeLeads}</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center font-medium"><Target className="w-3 h-3 mr-1" /> Win Rate</span>
                                                <span className="font-semibold text-foreground">{metrics.winRate}%</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center font-medium"><Clock className="w-3 h-3 mr-1" /> Resp.</span>
                                                <span className="font-semibold text-foreground">{metrics.responseTime}h</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>
            )}

            <UserDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                user={selectedUser}
            />

            <ConfirmDialog
                open={!!userToDelete}
                onOpenChange={(open) => !open && setUserToDelete(undefined)}
                title="Remove Team Member"
                description={`Are you sure you want to remove ${userToDelete?.firstName || ''} ${userToDelete?.lastName || ''}? This action cannot be undone.`}
                confirmLabel="Remove Member"
                variant="destructive"
                onConfirm={() => {
                    if (userToDelete) {
                        deleteMutation.mutate(userToDelete.id);
                        setUserToDelete(undefined);
                    }
                }}
            />
        </div>
    );
}
