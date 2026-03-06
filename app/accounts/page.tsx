'use client';

import { PageHeader } from '@/components/layout/page-header';
import { useClients } from '@/hooks';
import { ClientList } from '@/components/features/accounts/client-list';
import { useMobile } from '@/hooks/use-mobile';
import { MobileAccountsPage } from '@/components/features/accounts/mobile-accounts-page';
import { useState } from 'react';
import { ClientDialog } from '@/components/features/accounts/client-dialog';

export default function AccountsPage() {
    const { useList } = useClients();
    const { data: clients, isLoading, error } = useList();
    const isMobile = useMobile();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    if (error) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg text-destructive text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                    Error loading accounts: {(error as Error).message}
                </div>
            </div>
        );
    }

    if (isMobile) {
        return (
            <>
                <MobileAccountsPage
                    accounts={clients}
                    isLoading={isLoading}
                    onNewAccount={() => setIsAddDialogOpen(true)}
                />
                <ClientDialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                />
            </>
        );
    }

    return (
        <div className="p-6 max-w-[1700px] mx-auto space-y-4">
            <PageHeader
                title="Accounts"
                description="Manage your client relationships and accounts."
            />

            <ClientList clients={clients} isLoading={isLoading} />
        </div>
    );
}
