'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut
} from '@/components/ui/command';
import {
    Search,
    User,
    Building2,
    FileText,
    Calendar,
    Settings,
    LayoutDashboard,
    CheckSquare,
    Plus,
    Users,
    BarChart3,
    FileStack,
    Terminal
} from 'lucide-react';
import { ROUTES } from '@/constants';

export function CommandPalette() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        const handleCustomEvent = () => setOpen(true);

        document.addEventListener('keydown', down);
        document.addEventListener('open-command-palette', handleCustomEvent);

        return () => {
            document.removeEventListener('keydown', down);
            document.removeEventListener('open-command-palette', handleCustomEvent);
        };
    }, []);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Navigation">
                    <CommandItem onSelect={() => runCommand(() => router.push(ROUTES.DASHBOARD))}>
                        <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Dashboard</span>
                        <CommandShortcut>G D</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push(ROUTES.LEADS))}>
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Leads</span>
                        <CommandShortcut>G L</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push(ROUTES.ACCOUNTS))}>
                        <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Accounts</span>
                        <CommandShortcut>G A</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push(ROUTES.PROPOSALS))}>
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Proposals</span>
                        <CommandShortcut>G P</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push(ROUTES.QUOTES))}>
                        <FileStack className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Quotes</span>
                        <CommandShortcut>G Q</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push(ROUTES.TASKS))}>
                        <CheckSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Tasks</span>
                        <CommandShortcut>G T</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push(ROUTES.CALENDAR))}>
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Calendar</span>
                        <CommandShortcut>G C</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push(ROUTES.TEAM))}>
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Team</span>
                        <CommandShortcut>G M</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push(ROUTES.REPORTS))}>
                        <BarChart3 className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Reports</span>
                        <CommandShortcut>G R</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push(ROUTES.API_DOCS))}>
                        <Terminal className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>API Explorer</span>
                        <CommandShortcut>G E</CommandShortcut>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Quick Actions">
                    <CommandItem onSelect={() => runCommand(() => router.push(`${ROUTES.TASKS}?new=true`))}>
                        <Plus className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Create Task</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push(`${ROUTES.LEADS}?new=true`))}>
                        <Plus className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Add Lead</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                    <CommandItem onSelect={() => runCommand(() => router.push(ROUTES.SETTINGS))}>
                        <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Settings</span>
                        <CommandShortcut>⌘ S</CommandShortcut>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
