'use client';

import { Bell, Search, Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { NotificationCenter } from '@/components/features/notifications/notification-center';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
} from "@/components/ui/sheet";
import { Sidebar } from './sidebar';

export function Header() {
    const { theme, setTheme } = useTheme();
    const { user, loading, signInWithGoogle, logout } = useAuth();

    return (
        <header className="h-16 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="w-5 h-5" />
                            <span className="sr-only">Toggle mobile menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                        <Sidebar />
                    </SheetContent>
                </Sheet>

                <div className="relative hidden md:block w-96">
                    <button
                        onClick={() => document.dispatchEvent(new CustomEvent('open-command-palette'))}
                        className="w-full h-9 bg-muted/60 rounded-full border border-border/40 hover:border-border/80 hover:bg-muted/80 transition-all flex items-center px-4 gap-2 text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                    >
                        <Search className="h-4 w-4 shrink-0" />
                        <span className="flex-1 text-left">Search leads, accounts, proposals...</span>
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => document.dispatchEvent(new CustomEvent('open-command-palette'))}>
                    <Search className="w-5 h-5" />
                    <span className="sr-only">Search</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
                <NotificationCenter />

                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8 border border-border">
                                    <AvatarImage src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`} alt="User avatar" />
                                    <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none truncate">{user.displayName || 'User'}</p>
                                    <p className="text-xs leading-none text-muted-foreground truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 cursor-pointer">Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button variant="default" size="sm" onClick={signInWithGoogle} disabled={loading} className="cursor-pointer">
                        {loading ? 'Loading...' : 'Log In'}
                    </Button>
                )}
            </div>
        </header>
    );
}
