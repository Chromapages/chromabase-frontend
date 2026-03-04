'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset?: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    const handleReset = () => {
        try {
            reset?.();
        } catch (e) {
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
            <div className="bg-card border border-border/50 rounded-2xl p-8 max-w-md w-full shadow-lg">
                <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8" />
                </div>

                <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>

                <p className="text-muted-foreground mb-8 text-sm">
                    An unexpected error occurred. Our team has been notified.
                    You can try refreshing the page or return to the dashboard.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button onClick={handleReset} className="w-full sm:w-auto">
                        <RefreshCcw className="mr-2 h-4 w-4" /> Try again
                    </Button>
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" /> Go to Dashboard
                        </Link>
                    </Button>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 text-left bg-muted p-4 rounded-md overflow-auto max-h-48 border border-border/50">
                        <p className="text-xs font-mono text-destructive font-semibold mb-1">{error.message}</p>
                        <pre className="text-[10px] font-mono text-muted-foreground whitespace-pre-wrap">
                            {error.stack}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
