'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import { useAuth } from './use-auth';

interface UseRemoteUpdateOptions {
    collection: string;
    entityId?: string;
    onPulse?: () => void;
}

export function useRemoteUpdate({ collection, entityId, onPulse }: UseRemoteUpdateOptions) {
    const [isPulsing, setIsPulsing] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<number | null>(null);
    const { user } = useAuth();

    const handleDataChange = useCallback((payload: { type: string; collection: string; entityId?: string | null }) => {
        if (payload.collection === collection) {
            if (entityId && payload.entityId === entityId) {
                setIsPulsing(true);
                setLastUpdate(Date.now());
                onPulse?.();
                setTimeout(() => setIsPulsing(false), 1500);
            } else if (!entityId) {
                setIsPulsing(true);
                setLastUpdate(Date.now());
                onPulse?.();
                setTimeout(() => setIsPulsing(false), 1500);
            }
        }
    }, [collection, entityId, onPulse]);

    useSocket(user?.uid, handleDataChange);

    return { isPulsing, lastUpdate };
}

export function useRemoteUpdates(collectionNames: string[]) {
    const [pulsingCollections, setPulsingCollections] = useState<Record<string, boolean>>({});
    const [lastUpdates, setLastUpdates] = useState<Record<string, number | null>>({});
    const { user } = useAuth();

    const handleDataChange = useCallback((payload: { type: string; collection: string; entityId?: string | null }) => {
        if (collectionNames.includes(payload.collection)) {
            setPulsingCollections(prev => ({ ...prev, [payload.collection]: true }));
            setLastUpdates(prev => ({ ...prev, [payload.collection]: Date.now() }));
            setTimeout(() => {
                setPulsingCollections(prev => ({ ...prev, [payload.collection]: false }));
            }, 1500);
        }
    }, [collectionNames]);

    useSocket(user?.uid, handleDataChange);

    return { pulsingCollections, lastUpdates };
}
