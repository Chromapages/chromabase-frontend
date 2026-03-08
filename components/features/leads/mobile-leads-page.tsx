'use client';

import { useMemo, useState } from 'react';
import { Lead, LeadStatus } from '@/types';
import { MobileLeadCard } from './mobile-lead-card';
import { MobileFAB } from '../dashboard/mobile-fab';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Plus,
    TrendingUp, Users, CheckCircle2,
} from 'lucide-react';
import { LEAD_STATUS_OPTIONS } from '@/constants';
import { format } from 'date-fns';

interface MobileLeadsPageProps {
    leads: Lead[];
    onNewLead: () => void;
    totalValue: number;
    leadCount: number;
}

export function MobileLeadsPage({
    leads,
    onNewLead,
    totalValue,
    leadCount
}: MobileLeadsPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [activeStatus, setActiveStatus] = useState<LeadStatus | 'all'>('all');

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const matchesSearch =
                lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.contactName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = activeStatus === 'all' || lead.status === activeStatus;
            return matchesSearch && matchesStatus;
        });
    }, [leads, searchQuery, activeStatus]);

    const wonLeadsCount = leads.filter(l => l.status === 'won').length;

    return (
        <div className="fixed inset-0 bg-background z-[45] flex flex-col overflow-hidden pt-14">
            {/* --- SUMMARY STATS --- */}
            <div className="px-5 py-4 flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory">
                <div className="flex-1 min-w-[120px] p-3 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex flex-col gap-1 snap-center">
                    <div className="flex items-center gap-1.5 text-blue-500/70">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Leads</span>
                    </div>
                    <span className="text-xl font-bold tabular-nums">{leadCount}</span>
                </div>
                <div className="flex-1 min-w-[120px] p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col gap-1 snap-center">
                    <div className="flex items-center gap-1.5 text-indigo-500/70">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Pipeline</span>
                    </div>
                    <span className="text-xl font-bold tabular-nums">${(totalValue / 1000).toFixed(1)}k</span>
                </div>
                <div className="flex-1 min-w-[120px] p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col gap-1 snap-center">
                    <div className="flex items-center gap-1.5 text-emerald-500/70">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Won</span>
                    </div>
                    <span className="text-xl font-bold tabular-nums">{wonLeadsCount}</span>
                </div>
            </div>

            {/* --- FILTER CHIPS --- */}
            <div className="px-5 pb-4 shrink-0">
                <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2">
                    <button
                        onClick={() => setActiveStatus('all')}
                        className={cn(
                            "px-5 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition-all border",
                            activeStatus === 'all'
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-accent/40 text-muted-foreground border-border/40"
                        )}
                    >
                        All
                    </button>
                    {LEAD_STATUS_OPTIONS.map((status) => (
                        <button
                            key={status.value}
                            onClick={() => setActiveStatus(status.value as LeadStatus)}
                            className={cn(
                                "px-5 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition-all border flex items-center gap-2",
                                activeStatus === status.value
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-accent/40 text-muted-foreground border-border/40"
                            )}
                        >
                            {status.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- LEADS LIST --- */}
            <div className="flex-1 overflow-y-auto px-5 pb-32">
                <AnimatePresence mode="popLayout">
                    {filteredLeads.length > 0 ? (
                        filteredLeads.map((lead, idx) => (
                            <motion.div
                                key={lead.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.03, duration: 0.3 }}
                                layout
                            >
                                <MobileLeadCard lead={lead} />
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20 text-center"
                        >
                            <div className="w-16 h-16 rounded-3xl bg-accent/50 flex items-center justify-center mb-4">
                                <Search className="w-7 h-7 text-muted-foreground/30" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-[16px] font-bold text-foreground/80">No leads found</h3>
                            <p className="text-[13px] text-muted-foreground mt-1 max-w-[200px]">
                                Try adjusting your filters or adding a new lead.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <MobileFAB onClick={onNewLead} />
        </div>
    );
}
