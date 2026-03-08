import { Bell, CheckCircle2, MessageSquare, ListTodo, Circle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useNotifications } from '@/hooks';
import { useMobile } from '@/hooks/use-mobile';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export function NotificationCenter() {
    const { useList, useUpdate, useDelete } = useNotifications();
    const { data: notifications = [] } = useList();
    const { mutate: updateNotification } = useUpdate();
    const { mutate: deleteNotification } = useDelete();
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useMobile();
    const router = useRouter();

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleMarkAllAsRead = () => {
        notifications.forEach(n => {
            if (!n.isRead) {
                updateNotification({ id: n.id, data: { isRead: true, readAt: Date.now() } });
            }
        });
    };

    const handleNotificationClick = (notification: any) => {
        if (!notification.isRead) {
            updateNotification({ id: notification.id, data: { isRead: true, readAt: Date.now() } });
        }
        if (notification.href) {
            router.push(notification.href);
            setIsOpen(false);
        }
    };

    const sortedNotifications = useMemo(() =>
        [...notifications].sort((a, b) => b.createdAt - a.createdAt),
        [notifications]
    );

    const NotificationItem = ({ notification }: { notification: any }) => {
        const getIcon = (type: string) => {
            switch (type) {
                case 'task_assigned':
                    return <div className="p-2 rounded-xl bg-blue-500/10"><ListTodo className="w-4 h-4 text-blue-500" /></div>;
                case 'mention':
                    return <div className="p-2 rounded-xl bg-orange-500/10"><MessageSquare className="w-4 h-4 text-orange-500" /></div>;
                case 'task_completed':
                    return <div className="p-2 rounded-xl bg-green-500/10"><CheckCircle2 className="w-4 h-4 text-green-500" /></div>;
                default:
                    return <div className="p-2 rounded-xl bg-muted/20"><Bell className="w-4 h-4 text-muted-foreground" /></div>;
            }
        };

        return (
            <button
                onClick={() => handleNotificationClick(notification)}
                className={cn(
                    "w-full flex items-start gap-4 p-4 text-left transition-all duration-200",
                    "hover:bg-accent/40 active:bg-accent/60 active:scale-[0.99]",
                    !notification.isRead && "bg-primary/[0.03]"
                )}
            >
                <div className="flex-shrink-0">
                    {getIcon(notification.type)}
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <p className={cn(
                            "text-sm tracking-tight leading-tight truncate",
                            notification.isRead ? "font-medium text-foreground/70" : "font-bold text-foreground"
                        )}>
                            {notification.title}
                        </p>
                        {!notification.isRead && (
                            <Circle className="w-2 h-2 fill-primary text-primary flex-shrink-0 animate-pulse" />
                        )}
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-snug line-clamp-2">
                        {notification.body}
                    </p>
                    <p className="text-[11px] font-medium text-muted-foreground/50 mt-1 uppercase tracking-wider">
                        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                    </p>
                </div>
            </button>
        );
    };

    const NotificationListContent = () => (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm tracking-tight text-foreground/90 uppercase">Notifications</h4>
                    {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
                            {unreadCount} New
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-[12px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-tight"
                    >
                        Mark all as read
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto w-full scrollbar-none">
                {sortedNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-muted/10 flex items-center justify-center mb-4">
                            <Bell className="w-6 h-6 text-muted-foreground/40" />
                        </div>
                        <p className="text-sm font-semibold text-foreground/60 tracking-tight">All caught up</p>
                        <p className="text-[12px] text-muted-foreground mt-1">No notifications right now.</p>
                    </div>
                ) : (
                    <div className="flex flex-col divide-y divide-border/30 pb-4">
                        {sortedNotifications.map((notification) => (
                            <NotificationItem key={notification.id} notification={notification} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const Trigger = (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                "relative h-8 w-8 rounded-full transition-all duration-200",
                isOpen ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
        >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background animate-in zoom-in" />
            )}
            <span className="sr-only">Notifications</span>
        </Button>
    );

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    {Trigger}
                </SheetTrigger>
                <SheetContent side="bottom" className="p-0 h-[80vh] rounded-t-[32px] border-t border-border/40 overflow-hidden z-50">
                    <SheetTitle className="sr-only">Notifications</SheetTitle>
                    <NotificationListContent />
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                {Trigger}
            </PopoverTrigger>
            <PopoverContent className="w-[380px] p-0 mr-4 mt-2 rounded-2xl border-border/40 shadow-2xl shadow-black/10 overflow-hidden" align="end">
                <NotificationListContent />
            </PopoverContent>
        </Popover>
    );
}

