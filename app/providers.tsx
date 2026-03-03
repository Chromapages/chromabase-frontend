'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { DemoBanner } from '@/components/layout/demo-banner';
import { CommandPalette } from '@/components/global/command-palette';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <div className="flex flex-col h-screen overflow-hidden bg-background">
                <DemoBanner />
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
        </QueryClientProvider>
    );
}
