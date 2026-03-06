import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://api.chromapages.com';

export function useSocket(userUid: string | undefined, onDataChange: (data: any) => void) {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!userUid) return;

        // Initialize socket
        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket'],
            autoConnect: true,
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('[SOCKET] Connected:', socket.id);
            socket.emit('join', userUid);
        });

        socket.on('data_change', (payload) => {
            console.log('[SOCKET] Data Change Received:', payload);
            onDataChange(payload);
        });

        socket.on('disconnect', () => {
            console.log('[SOCKET] Disconnected');
        });

        return () => {
            socket.disconnect();
        };
    }, [userUid, onDataChange]);

    return socketRef.current;
}
