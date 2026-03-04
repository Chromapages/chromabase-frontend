'use client';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { CommandPalette } from '@/components/global/command-palette';

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-64 hidden md:block border-r border-border/50 shrink-0">
                    <Sidebar />
                </aside>

                <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Header />
                    <div className="flex-1 overflow-auto bg-muted/20">
                        {children}
                    </div>
                    <CommandPalette />
                </main>
            </div>
        </div>
    );
}
