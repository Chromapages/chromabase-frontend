'use client';

import { Bell, CheckCircle2, MessageSquare, ListTodo, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useNotifications } from '@/hooks';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function NotificationCenter() {
    const { useList, useUpdate } = useNotifications();
    const { data: notifications = [] } = useList();
    const { mutate: updateNotification } = useUpdate();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleMarkAllAsRead = () => {
        notifications.forEach(n => {
            if (!n.isRead) {
                updateNotification({ id: n.id, data: { isRead: true, readAt: Date.now() } });
            }
        });
    };

    const handleNotificationClick = (notification: typeof notifications[0]) => {
        if (!notification.isRead) {
            updateNotification({ id: notification.id, data: { isRead: true, readAt: Date.now() } });
        }
        if (notification.href) {
            router.push(notification.href);
            setIsOpen(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'task_assigned':
                return <ListTodo className="w-4 h-4 text-blue-500" />;
            case 'mention':
                return <MessageSquare className="w-4 h-4 text-orange-500" />;
            case 'task_completed':
                return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            default:
                return <Bell className="w-4 h-4 text-muted-foreground" />;
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Mark all read
                        </button>
                    )}
                </div>
                <div className="max-h-[400px] overflow-y-auto w-full scrollbar-none">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            No notifications
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.sort((a, b) => b.createdAt - a.createdAt).map((notification) => (
                                <button
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={cn(
                                        "flex items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50 border-b border-border/50 last:border-0",
                                        !notification.isRead && "bg-muted/20"
                                    )}
                                >
                                    <div className="mt-1 flex-shrink-0">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                                        <p className="text-sm font-medium leading-tight">
                                            {notification.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {notification.body}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground/70 mt-1">
                                            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                                        </p>
                                    </div>
                                    {!notification.isRead && (
                                        <Circle className="w-2 h-2 fill-blue-500 text-blue-500 mt-1 flex-shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
