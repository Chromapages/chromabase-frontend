'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    TrendingUp,
    CheckSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants';

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard, href: ROUTES.DASHBOARD },
    { id: 'leads', label: 'Leads', icon: Users, href: ROUTES.LEADS },
    { id: 'accounts', label: 'Accounts', icon: Briefcase, href: ROUTES.ACCOUNTS },
    { id: 'deals', label: 'Deals', icon: TrendingUp, href: ROUTES.DEALS },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, href: ROUTES.TASKS },
] as const;

export function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/40 z-50 pb-[env(safe-area-inset-bottom)] lg:hidden">
            <div className="flex justify-around items-center h-16 md:h-20 px-2 md:px-6">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 transition-all duration-300 min-w-[64px]",
                                isActive ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className={cn(
                                "p-1.5 md:p-2 rounded-xl transition-colors",
                                isActive ? "bg-primary/10" : "bg-transparent"
                            )}>
                                <Icon className={cn("w-5 h-5 md:w-6 md:h-6", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                            </div>
                            <span className={cn(
                                "text-[10px] md:text-[11px] font-bold tracking-tight transition-opacity",
                                isActive ? "opacity-100" : "opacity-70"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
