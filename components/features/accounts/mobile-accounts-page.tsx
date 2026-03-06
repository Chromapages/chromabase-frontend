'use client';

import { useState, useMemo } from 'react';
import { Client } from '@/types';
import { MobileAccountCard } from './mobile-account-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Menu, MoreVertical, X, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { MobileFAB } from '@/components/features/dashboard/mobile-fab';
import { createPortal } from 'react-dom';
import { Sidebar } from '@/components/layout/sidebar';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface MobileAccountsPageProps {
    accounts: Client[] | undefined;
    isLoading: boolean;
    onNewAccount: () => void;
}

type AccountStatusFilter = 'all' | 'active' | 'onboarding' | 'inactive';

export function MobileAccountsPage({ accounts, isLoading, onNewAccount }: MobileAccountsPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<AccountStatusFilter>('all');
    const router = useRouter();

    const filteredAccounts = useMemo(() => {
        if (!accounts) return [];
        return accounts.filter(account => {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                account.companyName.toLowerCase().includes(query) ||
                account.industry.toLowerCase().includes(query);

            const matchesStatus = statusFilter === 'all' || account.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [accounts, searchQuery, statusFilter]);

    const stats = useMemo(() => {
        if (!accounts) return { total: 0, revenue: 0, active: 0 };
        return {
            total: accounts.length,
            revenue: accounts.reduce((sum, acc) => sum + (acc.totalRevenue || 0), 0),
            active: accounts.filter(acc => acc.status === 'active').length
        };
    }, [accounts]);

    const filterOptions: { id: AccountStatusFilter; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'active', label: 'Active' },
        { id: 'onboarding', label: 'Onboarding' },
        { id: 'inactive', label: 'Inactive' }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="fixed inset-0 bg-background z-[45] flex flex-col overflow-hidden pb-[70px]">
            {/* Header */}
            <header className="px-5 pt-8 pb-4 bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/40">
                <div className="flex items-center justify-between mb-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-border/40 active:scale-95 transition-transform">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-[280px] border-r-border/40">
                            <SheetHeader className="sr-only">
                                <SheetTitle>Navigation Menu</SheetTitle>
                            </SheetHeader>
                            <Sidebar className="border-none" />
                        </SheetContent>
                    </Sheet>

                    <div className="text-center">
                        <h1 className="text-[17px] font-bold tracking-tight">Accounts</h1>
                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5 opacity-70">
                            {format(new Date(), 'MMMM d, yyyy')}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-border/40">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <Input
                        placeholder="Search accounts..."
                        className="h-11 pl-10 bg-accent/30 border-none rounded-2xl text-[15px] focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-inner"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg text-muted-foreground hover:bg-accent/50"
                            onClick={() => setSearchQuery('')}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    )}
                </div>
            </header>

            {/* Summary Bar */}
            <div className="px-5 py-3 flex gap-3 overflow-x-auto no-scrollbar scroll-smooth">
                <div className="flex-shrink-0 bg-blue-600/10 border border-blue-500/20 rounded-2xl px-4 py-2.5 flex items-center gap-3">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div className="flex flex-col">
                        <span className="text-[13px] font-bold leading-none">{stats.total}</span>
                        <span className="text-[9px] text-blue-600 shadow-sm font-bold uppercase tracking-wider mt-1 opacity-70">Accounts</span>
                    </div>
                </div>
                <div className="flex-shrink-0 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl px-4 py-2.5 flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-indigo-600" />
                    <div className="flex flex-col">
                        <span className="text-[13px] font-bold leading-none">${(stats.revenue / 1000).toFixed(0)}k</span>
                        <span className="text-[9px] text-indigo-600 font-bold uppercase tracking-wider mt-1 opacity-70">Revenue</span>
                    </div>
                </div>
                <div className="flex-shrink-0 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl px-4 py-2.5 flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <div className="flex flex-col">
                        <span className="text-[13px] font-bold leading-none">{stats.active}</span>
                        <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider mt-1 opacity-70">Active</span>
                    </div>
                </div>
            </div>

            {/* Filter Chips */}
            <div className="px-5 py-2 flex gap-2 overflow-x-auto no-scrollbar">
                {filterOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => setStatusFilter(option.id)}
                        className={`flex-shrink-0 h-8 px-4 rounded-full text-[12px] font-bold transition-all ${statusFilter === option.id
                            ? 'bg-foreground text-background shadow-lg shadow-foreground/10'
                            : 'bg-muted text-muted-foreground hover:bg-accent border border-border/40'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Account List */}
            <div className="flex-1 overflow-y-auto px-5 pt-2 pb-24 no-scrollbar">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-28 bg-accent/20 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : filteredAccounts.length > 0 ? (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="space-y-1"
                    >
                        {filteredAccounts.map((account) => (
                            <motion.div key={account.id} variants={item}>
                                <MobileAccountCard
                                    account={account}
                                    onClick={(id) => router.push(`${ROUTES.ACCOUNTS}/${id}`)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="h-16 w-16 bg-muted rounded-3xl flex items-center justify-center">
                            <Users className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-[17px]">No accounts found</h3>
                            <p className="text-sm text-muted-foreground max-w-[200px] leading-relaxed">
                                Try adjusting your search or filters to find what you're looking for.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="h-10 px-6 rounded-full border-foreground/10 font-bold text-sm"
                            onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                        >
                            Reset Filters
                        </Button>
                    </div>
                )}
            </div>

            <MobileFAB onClick={onNewAccount} />
        </div>
    );
}
