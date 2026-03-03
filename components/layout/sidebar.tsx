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
    TrendingUp
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
    { name: 'Team Hub', href: ROUTES.TEAM, icon: Users },
    { name: 'Reports', href: ROUTES.REPORTS, icon: PieChart },
];

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <div className={cn("flex flex-col h-full bg-sidebar", className)}>
            <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
                <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary text-xl">C</span>
                    </div>
                    ChromaBase
                </Link>
            </div>

            <ScrollArea className="flex-1 w-full p-4">
                <div className="space-y-1">
                    {NAVIGATION_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
