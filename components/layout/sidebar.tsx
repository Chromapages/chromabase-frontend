'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants';
import {
    BarChart3,
    Users,
    User2,
    Briefcase,
    FileText,
    Calendar,
    Settings,
    PieChart,
    CheckSquare,
    Terminal,
    TrendingUp,
    UsersRound,
    Megaphone,
    Quote,
    ChevronLeft,
    ChevronRight,
    Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

/* ── Navigation schema — Swiss section discipline ─────────── */
const MAIN_NAV = [
    { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: BarChart3 },
    { name: 'Leads', href: ROUTES.LEADS, icon: Users },
    { name: 'Accounts', href: ROUTES.ACCOUNTS, icon: Briefcase },
    { name: 'Deals', href: ROUTES.DEALS, icon: TrendingUp },
    { name: 'Contacts', href: ROUTES.CONTACTS, icon: User2 },
];

const WORK_NAV = [
    { name: 'Tasks', href: ROUTES.TASKS, icon: CheckSquare },
    { name: 'Calendar', href: ROUTES.CALENDAR, icon: Calendar },
    { name: 'Campaigns', href: ROUTES.CAMPAIGNS, icon: Megaphone },
    { name: 'Proposals', href: ROUTES.PROPOSALS, icon: FileText },
    { name: 'Quotes', href: ROUTES.QUOTES, icon: Quote },
    { name: 'Workflows', href: ROUTES.WORKFLOWS, icon: Zap },
];

const TEAM_NAV = [
    { name: 'Team Hub', href: ROUTES.TEAM, icon: UsersRound },
    { name: 'Reports', href: ROUTES.REPORTS, icon: PieChart },
];

function NavSection({
    label,
    items,
    pathname,
    isCollapsed,
}: {
    label?: string;
    items: Array<{ name: string; href: string; icon: any }>;
    pathname: string;
    isCollapsed: boolean;
}) {
    return (
        <div className="space-y-1">
            {label && !isCollapsed && (
                <p className="text-label-micro text-muted-foreground/40 px-3 pt-6 pb-2 select-none tracking-widest transition-opacity duration-300">
                    {label}
                </p>
            )}
            {label && isCollapsed && (
                <div className="h-px bg-border/40 mx-4 my-4 transition-opacity duration-300" />
            )}
            {items.map((item) => {
                const isActive =
                    pathname === item.href ||
                    (item.href !== ROUTES.DASHBOARD && pathname.startsWith(`${item.href}/`));
                const Icon = item.icon;

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 outline-none',
                            isActive
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]'
                                : 'text-foreground/70 hover:text-foreground hover:bg-secondary/50'
                        )}
                        title={isCollapsed ? item.name : undefined}
                    >
                        <Icon
                            className={cn(
                                'w-[18px] h-[18px] shrink-0 transition-transform duration-200 group-active:scale-95',
                                isActive ? 'text-primary-foreground' : 'text-foreground/40 group-hover:text-foreground/70'
                            )}
                        />
                        {!isCollapsed && (
                            <span className="truncate whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                                {item.name}
                            </span>
                        )}
                    </Link>
                );
            })}
        </div>
    );
}

export function Sidebar({ className, isMobile = false }: { className?: string; isMobile?: boolean }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Force expanded state on mobile
    const effectiveCollapsed = isMobile ? false : isCollapsed;

    return (
        <div
            className={cn(
                'relative flex flex-col h-full glass transition-all duration-400 ease-spring border-r border-border/50 group/sidebar',
                effectiveCollapsed ? 'w-[78px]' : 'w-[280px]',
                isMobile && "w-full border-r-0",
                className
            )}
        >
            {/* ── Collapse Toggle ────────────────────────────────── */}
            {!isMobile && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-3 top-20 z-50 h-6 w-6 rounded-full border bg-background shadow-md opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 hover:bg-accent"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {effectiveCollapsed ? (
                        <ChevronRight className="h-3 w-3" />
                    ) : (
                        <ChevronLeft className="h-3 w-3" />
                    )}
                </Button>
            )}

            {/* ── Header / Logo ─────────────────────────────────── */}
            <div className={cn(
                "h-20 flex items-center shrink-0 transition-all duration-300 px-6",
                effectiveCollapsed && "px-0 justify-center"
            )}>
                <Link
                    href={ROUTES.DASHBOARD}
                    className="flex items-center gap-3 group/logo"
                >
                    <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 group-hover/logo:scale-105 transition-transform duration-300">
                        <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                        >
                            <path
                                d="M10 2L3 10L10 18L17 10L10 2Z"
                                fill="white"
                            />
                            <path
                                d="M10 6L7 10L10 14L13 10L10 6Z"
                                fill="rgba(0,0,0,0.2)"
                            />
                        </svg>
                    </div>
                    {!effectiveCollapsed && (
                        <div className="flex flex-col leading-tight animate-in fade-in duration-500">
                            <span className="text-xl font-bold tracking-tighter text-foreground">
                                Chroma<span className="text-primary tracking-normal">BASE</span>
                            </span>
                            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground/60">
                                CRM Intelligence
                            </span>
                        </div>
                    )}
                </Link>
            </div>

            {/* ── Navigation List ────────────────────────────────── */}
            <ScrollArea className="flex-1 px-4 scrollbar-thin">
                <div className="py-2 space-y-1">
                    <NavSection items={MAIN_NAV} pathname={pathname} isCollapsed={effectiveCollapsed} />
                    <NavSection label="Workspace" items={WORK_NAV} pathname={pathname} isCollapsed={effectiveCollapsed} />
                    <NavSection label="Organization" items={TEAM_NAV} pathname={pathname} isCollapsed={effectiveCollapsed} />
                </div>
            </ScrollArea>

            {/* ── Footer / User / Status ─────────────────────────── */}
            <div className="shrink-0 p-4 space-y-2">
                {/* User Snippet */}
                <div className={cn(
                    "flex items-center gap-3 p-2 rounded-2xl bg-secondary/30 transition-all duration-300",
                    effectiveCollapsed ? "justify-center px-0 bg-transparent" : "hover:bg-secondary/50 cursor-pointer"
                )}>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-[13px] font-bold text-primary-foreground shadow-sm">
                        JD
                    </div>
                    {!effectiveCollapsed && (
                        <div className="flex flex-col min-w-0 pr-2">
                            <span className="text-[13px] font-bold truncate text-foreground">John Doe</span>
                            <span className="text-[11px] text-muted-foreground truncate leading-none">Administrator</span>
                        </div>
                    )}
                </div>

                {!effectiveCollapsed ? (
                    <div className="space-y-1 pt-2">
                        <Link
                            href={ROUTES.SETTINGS}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all group",
                                pathname === ROUTES.SETTINGS ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                            )}
                        >
                            <Settings className="w-[17px] h-[17px] group-hover:rotate-45 transition-transform duration-300" />
                            Settings
                        </Link>
                        <Link
                            href={ROUTES.API_DOCS}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all group",
                                pathname === ROUTES.API_DOCS ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                            )}
                        >
                            <Terminal className="w-[17px] h-[17px]" />
                            API Access
                        </Link>

                        {/* Status Dot */}
                        <div className="flex items-center justify-between px-3 pt-4 border-t border-border/40 mt-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">Core System</span>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                                </span>
                                <span className="text-[11px] font-medium text-success/80">Online</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 pt-4 border-t border-border/40">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

