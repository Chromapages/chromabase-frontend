'use client';

import { Client } from '@/types';
import { Badge } from '@/components/ui/badge';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Phone, ChevronRight, Globe, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface MobileAccountCardProps {
    account: Client;
    onClick: (id: string) => void;
}

export function MobileAccountCard({ account, onClick }: MobileAccountCardProps) {
    const x = useMotionValue(0);
    const opacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);
    const actionX = useTransform(x, [-100, 0], [0, 100]);

    const handleDragEnd = (_: any, info: any) => {
        if (info.offset.x > -50) {
            x.set(0);
        } else {
            x.set(-140);
        }
    };

    const statusConfig = {
        active: { label: 'Active', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', borderColor: 'border-l-emerald-500' },
        onboarding: { label: 'Onboarding', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20', borderColor: 'border-l-amber-500' },
        inactive: { label: 'Inactive', className: 'bg-muted text-muted-foreground border-border', borderColor: 'border-l-muted-foreground/30' }
    };

    const tierConfig = {
        Gold: 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20',
        Silver: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
        Bronze: 'text-orange-600 bg-orange-500/10 border-orange-500/20',
        Standard: 'text-muted-foreground bg-muted border-border'
    };

    const config = statusConfig[account.status as keyof typeof statusConfig] || statusConfig.inactive;
    const tierClass = account.tier ? tierConfig[account.tier as keyof typeof tierConfig] : '';

    const date = typeof account.createdAt === 'object' && account.createdAt !== null && 'toDate' in account.createdAt
        ? (account.createdAt as any).toDate()
        : new Date(Number(account.createdAt));

    return (
        <div className="relative overflow-hidden rounded-xl bg-card border border-border/50 shadow-sm mb-3">
            {/* Action Background */}
            <motion.div
                style={{ opacity }}
                className="absolute inset-0 bg-blue-600 flex justify-end items-center px-6 gap-4"
            >
                <motion.div style={{ x: actionX }} className="flex gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/30 border-none"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `mailto:${account.companyName.toLowerCase().replace(/\s/g, '')}@example.com`;
                        }}
                    >
                        <Mail className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/30 border-none"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `tel:+1234567890`;
                        }}
                    >
                        <Phone className="h-5 w-5" />
                    </Button>
                </motion.div>
            </motion.div>

            {/* Main Card Content */}
            <motion.div
                style={{ x }}
                drag="x"
                dragConstraints={{ left: -140, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                onClick={() => onClick(account.id)}
                className={`relative z-10 bg-card p-4 border-l-4 ${config.borderColor} active:bg-accent/50 transition-colors cursor-pointer`}
            >
                <div className="flex justify-between items-start mb-2">
                    <div className="space-y-1">
                        <h3 className="font-bold text-[15px] leading-tight text-foreground tracking-tight">
                            {account.companyName}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                                {account.industry}
                            </span>
                            {account.tier && (
                                <Badge variant="outline" className={`h-4 text-[9px] px-1 font-bold ${tierClass}`}>
                                    {account.tier}
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                        <Badge className={`text-[10px] h-5 px-1.5 font-bold border ${config.className}`}>
                            {config.label}
                        </Badge>
                        <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-mono text-[13px] font-bold">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            ${((account.totalRevenue || 0) / 1000).toFixed(0)}k
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                    <div className="flex items-center gap-3">
                        {account.website && (
                            <div className="flex items-center text-[11px] text-muted-foreground">
                                <Globe className="h-3 w-3 mr-1 opacity-70" />
                                {account.website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                            </div>
                        )}
                        <div className="text-[11px] text-muted-foreground/60">
                            Added {format(date, 'MMM d')}
                        </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
                </div>
            </motion.div>
        </div>
    );
}
