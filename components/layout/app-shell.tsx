'use client';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { CommandPalette } from '@/components/global/command-palette';

/*
 * AppShell — Swiss Modernism 2.0
 *
 * Structure:
 *  ┌──────────────────────────────────────────┐
 *  │  Sidebar (240px)  │  Header (h-14)       │
 *  │                   │──────────────────────│
 *  │                   │  <page content>      │
 *  │                   │  dot-grid bg         │
 *  └──────────────────────────────────────────┘
 *
 * Background: subtle dot-grid texture — Swiss graph paper aesthetic
 * Sidebar: 240px — narrower than typical 256px, feels tighter and more Swiss
 */
export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar — Dynamic Swiss Precision Width */}
            <aside className="hidden md:flex flex-col shrink-0 transition-all duration-400 ease-spring">
                <Sidebar />
            </aside>

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header />

                {/* Scrollable content — dot grid provides Swiss graph-paper depth */}
                <main className="flex-1 overflow-auto scrollbar-thin relative dot-grid">
                    {/* Subtle radial vignette — Apple vibrancy depth */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,122,255,0.025) 0%, transparent 70%)',
                        }}
                        aria-hidden
                    />

                    {/* Page content with consistent padding */}
                    <div className="relative z-10 min-h-full">
                        {children}
                    </div>
                </main>
            </div>

            <CommandPalette />
        </div>
    );
}
