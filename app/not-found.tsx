'use client';

import { Button } from '@/components/ui/button';
import { FileQuestion, Home } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
            <div className="bg-card border border-border/50 rounded-2xl p-8 max-w-md w-full shadow-sm">
                <div className="w-16 h-16 bg-muted text-muted-foreground rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileQuestion className="w-8 h-8" />
                </div>

                <h1 className="text-2xl font-bold mb-2 text-foreground">Page Not Found</h1>

                <p className="text-muted-foreground mb-8 text-sm">
                    We couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
                </p>

                <div className="flex justify-center">
                    <Button asChild>
                        <Link href={ROUTES.DASHBOARD}>
                            <Home className="mr-2 h-4 w-4" /> Return to Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
