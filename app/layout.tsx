import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import { AppShell } from '@/components/layout/app-shell';
import { Fira_Code, Inter } from 'next/font/google';

/*
 * Fonts — Swiss Modernism 2.0
 * Inter: screen-optimised Helvetica Neue descendant, perfect Swiss grid weight
 * Fira Code: monospace for API docs, code blocks
 *
 * Variable names match what globals.css @theme references:
 *   --font-geist-sans → Inter
 *   --font-geist-mono → Fira Code
 */
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-geist-sans',
    display: 'swap',
    weight: ['300', '400', '500', '600', '700', '800'],
});

const firaCode = Fira_Code({
    subsets: ['latin'],
    variable: '--font-geist-mono',
    display: 'swap',
    weight: ['400', '500', '600'],
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#f5f5f7' },
        { media: '(prefers-color-scheme: dark)',  color: '#000000' },
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
            className={`${inter.variable} ${firaCode.variable}`}
        >
            <body className="font-sans antialiased">
                <Providers>
                    <AppShell>
                        {children}
                    </AppShell>
                </Providers>
            </body>
        </html>
    );
}
