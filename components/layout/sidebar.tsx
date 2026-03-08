'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

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
    isMobile = false,
}: {
    label?: string;
    items: Array<{ name: string; href: string; icon: LucideIcon }>;
    pathname: string;
    isCollapsed: boolean;
    isMobile?: boolean;
}) {
    return (
        <div className={cn("space-y-1", isMobile && "space-y-1.5")}>
            {label && !isCollapsed && (
                <p className={cn(
                    "text-label-micro text-muted-foreground/40 px-3 pt-6 pb-2 select-none tracking-widest transition-opacity duration-300 uppercase",
                    isMobile && "px-4 pt-8 pb-3 text-[10px]"
                )}>
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
                            'group flex items-center transition-all duration-300 outline-none',
                            isMobile
                                ? 'gap-4 px-4 py-4 rounded-2xl text-[15px]'
                                : 'gap-3 px-3 py-2.5 rounded-xl text-[14px]',
                            isActive
                                ? isMobile
                                    ? 'bg-primary/10 text-primary font-bold shadow-[inset_0_0_0_1px_rgba(var(--primary),0.1)]'
                                    : 'bg-primary text-primary-foreground shadow-[0_4px_20px_-4px_rgba(249,115,22,0.4)] scale-[1.02] font-display'
                                : 'text-foreground/70 active:bg-secondary/60 font-sans'
                        )}
                        title={isCollapsed ? item.name : undefined}
                    >
                        <Icon
                            className={cn(
                                'shrink-0 transition-all duration-300 group-active:scale-90',
                                isMobile ? 'w-5 h-5' : 'w-[18px] h-[18px]',
                                isActive
                                    ? isMobile ? 'text-primary' : 'text-primary-foreground'
                                    : 'text-foreground/40 group-hover:text-foreground/70'
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
    const { user } = useAuth();

    const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
    const userSubtext = user?.email || 'Administrator';
    const initials = displayName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase() || 'U';

    const [sidebarWidth, setSidebarWidth] = useState(280);
    const [isResizing, setIsResizing] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Load width from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('sidebar-width');
        if (saved) {
            const width = parseInt(saved, 10);
            if (!isNaN(width)) setSidebarWidth(width);
        }
    }, []);

    const startResizing = useCallback((e: React.PointerEvent) => {
        e.preventDefault();
        setIsResizing(true);
    }, []);

    const stopResizing = useCallback(() => {
        if (isResizing) {
            setIsResizing(false);
            localStorage.setItem('sidebar-width', sidebarWidth.toString());
        }
    }, [isResizing, sidebarWidth]);

    const resize = useCallback((e: PointerEvent) => {
        if (!isResizing) return;

        let newWidth = e.clientX;
        if (newWidth < 200) newWidth = 200;
        if (newWidth > 480) newWidth = 480;

        setSidebarWidth(newWidth);
    }, [isResizing]);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('pointermove', resize);
            window.addEventListener('pointerup', stopResizing);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        } else {
            window.removeEventListener('pointermove', resize);
            window.removeEventListener('pointerup', stopResizing);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
        return () => {
            window.removeEventListener('pointermove', resize);
            window.removeEventListener('pointerup', stopResizing);
        };
    }, [isResizing, resize, stopResizing]);

    // Force expanded state on mobile
    const effectiveCollapsed = isMobile ? false : isCollapsed;

    return (
        <div
            ref={sidebarRef}
            className={cn(
                'relative flex flex-col h-full bg-background lg:bg-transparent lg:glass transition-all duration-400 ease-soft border-r border-border/50 group/sidebar',
                isMobile ? "w-full h-screen border-r-0 overflow-hidden" : "",
                isResizing && "transition-none",
                className
            )}
            style={{
                width: isMobile ? undefined : (effectiveCollapsed ? '78px' : `${sidebarWidth}px`)
            }}
        >
            {/* ── Resize Handle ─────────────────────────────────── */}
            {!isMobile && !effectiveCollapsed && (
                <div
                    onPointerDown={startResizing}
                    className={cn(
                        "absolute right-0 top-0 bottom-0 w-1 cursor-col-resize z-50 group/handle transition-colors",
                        isResizing ? "bg-primary/40" : "hover:bg-primary/20"
                    )}
                >
                    <div className={cn(
                        "absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-full bg-border transition-all group-hover/handle:h-12 group-hover/handle:bg-primary/40",
                        isResizing && "bg-primary/60 h-16"
                    )} />
                </div>
            )}

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

            <div className={cn(
                "h-20 flex items-center shrink-0 transition-all duration-300 px-6",
                effectiveCollapsed && "px-0 justify-center",
                isMobile && "px-6 pt-4"
            )}>
                <Link
                    href={ROUTES.DASHBOARD}
                    className="flex items-center gap-3 group/logo"
                >
                    <div className={cn(
                        "rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 transition-transform duration-300",
                        isMobile ? "w-9 h-9" : "w-10 h-10 group-hover/logo:scale-105"
                    )}>
                        <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={isMobile ? "w-5 h-5" : "w-6 h-6"}
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
                        <div className={cn(
                            "flex flex-col leading-tight animate-in fade-in duration-500",
                            isMobile && "gap-0.5 ml-1"
                        )}>
                            <span className={cn(
                                "font-bold tracking-tighter text-foreground font-display",
                                isMobile ? "text-lg" : "text-xl"
                            )}>
                                Chroma<span className="text-primary tracking-normal">BASE</span>
                            </span>
                            <span className={cn(
                                "font-medium tracking-[0.25em] uppercase text-muted-foreground/50 decoration-primary/30 underline-offset-4 decoration-2",
                                isMobile ? "text-[9px]" : "text-[9px]"
                            )}>
                                CRM Intelligence
                            </span>
                        </div>
                    )}
                </Link>
            </div>

            {/* ── Navigation List ────────────────────────────────── */}
            <ScrollArea className={cn("flex-1 min-h-0 px-4 scrollbar-thin", isMobile && "px-4")}>
                <div className={cn("py-2 space-y-1", isMobile && "pt-4 pb-8 space-y-4")}>
                    <NavSection items={MAIN_NAV} pathname={pathname} isCollapsed={effectiveCollapsed} isMobile={isMobile} />
                    <NavSection label="Workspace" items={WORK_NAV} pathname={pathname} isCollapsed={effectiveCollapsed} isMobile={isMobile} />
                    <NavSection label="Organization" items={TEAM_NAV} pathname={pathname} isCollapsed={effectiveCollapsed} isMobile={isMobile} />
                </div>
            </ScrollArea>

            {/* ── Footer / User / Status ─────────────────────────── */}
            <div className={cn(
                "shrink-0 p-4 space-y-2",
                isMobile && "p-4 pb-[calc(24px+env(safe-area-inset-bottom))] bg-secondary/10 border-t border-border/20"
            )}>
                {/* User Snippet */}
                <div className={cn(
                    "flex items-center gap-3 p-2 rounded-2xl transition-all duration-300",
                    isMobile
                        ? "bg-card border border-border/50 shadow-sm p-3 mb-4"
                        : (effectiveCollapsed ? "justify-center px-0 bg-transparent" : "bg-secondary/30 hover:bg-secondary/50 cursor-pointer")
                )}>
                    <div className={cn(
                        "rounded-xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center font-bold text-primary-foreground shadow-sm shrink-0",
                        isMobile ? "w-10 h-10 text-[14px]" : "w-9 h-9 text-[13px]"
                    )}>
                        {initials}
                    </div>
                    {!effectiveCollapsed && (
                        <div className="flex flex-col min-w-0 pr-2">
                            <span className={cn(
                                "font-bold truncate text-foreground",
                                isMobile ? "text-[14px]" : "text-[13px]"
                            )}>{displayName}</span>
                            <span className={cn(
                                "text-muted-foreground truncate leading-none mt-0.5",
                                isMobile ? "text-[12px]" : "text-[11px]"
                            )}>{userSubtext}</span>
                        </div>
                    )}
                </div>

                {!effectiveCollapsed ? (
                    <div className={cn("space-y-1 pt-2", isMobile && "pt-0 grid grid-cols-2 gap-2 space-y-0")}>
                        <Link
                            href={ROUTES.SETTINGS}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all group",
                                isMobile && "bg-secondary/40 justify-center h-11 px-4",
                                pathname === ROUTES.SETTINGS ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                            )}
                        >
                            <Settings className={cn("w-[17px] h-[17px] transition-transform duration-500", !isMobile && "group-hover:rotate-45")} />
                            Settings
                        </Link>
                        <Link
                            href={ROUTES.API_DOCS}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all group",
                                isMobile && "bg-secondary/40 justify-center h-11 px-4",
                                pathname === ROUTES.API_DOCS ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                            )}
                        >
                            <Terminal className="w-[17px] h-[17px]" />
                            API Access
                        </Link>

                        {/* Status Dot */}
                        <div className={cn(
                            "flex items-center justify-between px-3 pt-4 border-t border-border/40 mt-2",
                            isMobile && "col-span-2 border-t-0 pt-2 px-1"
                        )}>
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
