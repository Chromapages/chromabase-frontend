'use client';

import { isFirebaseConfigured } from '@/lib/firebase';
import { AlertCircle } from 'lucide-react';

export function DemoBanner() {
    return (
        <div className={`px-4 py-1 flex items-center justify-center gap-2 text-xs font-medium border-b ${isFirebaseConfigured ? 'bg-primary/5 text-primary/70 border-primary/10' : 'bg-warning/10 text-warning border-warning/20'}`}>
            <AlertCircle className="w-3 h-3" />
            <span>
                {isFirebaseConfigured
                    ? `Connected to Firestore (chromabase2)`
                    : 'Demo Mode: Firebase not configured. Data is local only.'}
            </span>
        </div>
    );
}
