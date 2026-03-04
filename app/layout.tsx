import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import { AppShell } from '@/components/layout/app-shell';
import { Fira_Code, Inter } from 'next/font/google';

const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-mono' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    title: { template: '%s | ChromaBASE', default: 'ChromaBASE CRM' },
    description: 'A modern, unified CRM workspace.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning className={`${firaCode.variable} ${inter.variable}`}>
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
