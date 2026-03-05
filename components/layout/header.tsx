'use client';

import { Bell, Search, Menu, Moon, Sun, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { NotificationCenter } from '@/components/features/notifications/notification-center';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants';

export function Header() {
    const { theme, setTheme } = useTheme();
    const { user, loading, signInWithGoogle, logout } = useAuth();

    return (
        <header
            className={cn(
                'h-14 border-b border-border/60',
                'bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70',
                'flex items-center justify-between px-4 md:px-5',
                'sticky top-0 z-40 transition-all duration-200',
            )}
        >
            {/* ── Left: Mobile menu + Search ───────────────────── */}
            <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                            <Menu className="w-4 h-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-60">
                        <SheetTitle className="sr-only">Navigation</SheetTitle>
                        <Sidebar isMobile />
                    </SheetContent>
                </Sheet>

                {/* Search — Apple pill style */}
                <button
                    onClick={() =>
                        document.dispatchEvent(new CustomEvent('open-command-palette'))
                    }
                    className={cn(
                        'hidden md:flex items-center gap-2.5',
                        'h-8 w-80 px-3',
                        'bg-muted/70 hover:bg-muted',
                        'border border-border/50 hover:border-border/80',
                        'rounded-full text-[13px] text-muted-foreground',
                        'transition-all duration-150',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60',
                        'cursor-text',
                    )}
                >
                    <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                    <span className="flex-1 text-left text-[13px]">Search...</span>
                    <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-border bg-background/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground/80 shadow-xs">
                        ⌘K
                    </kbd>
                </button>
            </div>

            {/* ── Right: Actions + Avatar ───────────────────────── */}
            <div className="flex items-center gap-1">
                {/* Mobile search */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() =>
                        document.dispatchEvent(new CustomEvent('open-command-palette'))
                    }
                >
                    <Search className="w-4 h-4" />
                    <span className="sr-only">Search</span>
                </Button>

                {/* Help button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    asChild
                >
                    <Link href={ROUTES.GUIDE}>
                        <HelpCircle className="h-4 w-4" />
                        <span className="sr-only">Help Guide</span>
                    </Link>
                </Button>

                {/* Theme toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                {/* Notifications */}
                <NotificationCenter />

                {/* Divider */}
                <div className="w-px h-5 bg-border/80 mx-1" />

                {/* User avatar / auth */}
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-8 w-8 rounded-full p-0 ring-2 ring-transparent hover:ring-primary/20 transition-all duration-150"
                            >
                                <Avatar className="h-7 w-7">
                                    <AvatarImage
                                        src={
                                            user.photoURL ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=007AFF&color=fff&bold=true`
                                        }
                                        alt={user.displayName || 'User'}
                                    />
                                    <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                                        {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-52" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal py-2">
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-[13px] font-semibold leading-none truncate">
                                        {user.displayName || 'User'}
                                    </p>
                                    <p className="text-[11px] leading-none text-muted-foreground truncate mt-1">
                                        {user.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-[13px] cursor-pointer">
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-[13px] cursor-pointer">
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={logout}
                                className="text-[13px] text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                            >
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button
                        variant="default"
                        size="sm"
                        onClick={signInWithGoogle}
                        disabled={loading}
                        className="h-8 text-[13px] cursor-pointer"
                    >
                        {loading ? 'Loading…' : 'Sign in'}
                    </Button>
                )}
            </div>
        </header>
    );
}
