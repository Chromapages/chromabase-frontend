'use client';

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
    UsersRound
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export const NAVIGATION_ITEMS = [
    { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: BarChart3 },
    { name: 'Leads', href: ROUTES.LEADS, icon: Users },
    { name: 'Accounts', href: ROUTES.ACCOUNTS, icon: Briefcase },
    { name: 'Deals', href: ROUTES.DEALS, icon: TrendingUp },
    { name: 'Contacts', href: ROUTES.CONTACTS, icon: User2 },
    { name: 'Tasks', href: ROUTES.TASKS, icon: CheckSquare },
    { name: 'Proposals', href: ROUTES.PROPOSALS, icon: FileText },
    { name: 'Calendar', href: ROUTES.CALENDAR, icon: Calendar },
    { name: 'Team Hub', href: ROUTES.TEAM, icon: UsersRound },
    { name: 'Reports', href: ROUTES.REPORTS, icon: PieChart },
];

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <div className={cn("flex flex-col h-full bg-sidebar/80 backdrop-blur-xl border-r border-sidebar-border transition-colors duration-300", className)}>
            <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
                <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M12 2L2 12l10 10 10-10L12 2zm0 14.5L7.5 12 12 7.5 16.5 12 12 16.5z" />
                        </svg>
                    </div>
                    ChromaBase
                </Link>
            </div>

            <ScrollArea className="flex-1 w-full p-4">
                <div className="space-y-1">
                    {NAVIGATION_ITEMS.map((item) => {
                        const isActive = pathname === item.href || (pathname.startsWith(`${item.href}/`));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-sm font-medium",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </ScrollArea>

            <div className="p-4 mt-auto border-t border-border/50 shrink-0 space-y-1">
                <Link
                    href={ROUTES.API_DOCS}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                        pathname === ROUTES.API_DOCS && "bg-primary/10 text-primary"
                    )}
                >
                    <Terminal className="w-4 h-4" />
                    API Explorer
                </Link>
                <Link
                    href={ROUTES.SETTINGS}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                        pathname === ROUTES.SETTINGS && "bg-primary/10 text-primary"
                    )}
                >
                    <Settings className="w-4 h-4" />
                    Settings
                </Link>
                <div className="pt-2 px-3 flex items-center gap-3 select-none cursor-default">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-500/80">API Connected</span>
                </div>
            </div>
        </div>
    );
}
