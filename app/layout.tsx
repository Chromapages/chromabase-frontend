import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from 'sonner';
import { Fira_Code } from 'next/font/google';

/*
 * Fonts — Soft Swiss Modernism 2.0
 * Fonts are imported globally in globals.css via Fontshare (Satoshi & General Sans)
 * Fira Code: kept for mono variable consistency
 */

const firaCode = Fira_Code({
    subsets: ['latin'],
    variable: '--font-mono',
    display: 'swap',
    weight: ['400', '500', '600'],
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#F2F2F7' },
        { media: '(prefers-color-scheme: dark)', color: '#050505' },
    ],
};

export const metadata: Metadata = {
    title: { template: '%s | ChromaBASE', default: 'ChromaBASE CRM' },
    description: 'A modern, unified CRM workspace.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${firaCode.variable}`}
        >
            <body className="font-sans antialiased text-foreground selection:bg-primary/20">
                <Providers>
                    <AppShell>
                        {children}
                    </AppShell>
                    <Toaster position="bottom-right" theme="system" />
                </Providers>
            </body>
        </html>
    );
}
