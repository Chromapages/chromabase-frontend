'use client';

import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { Phone, Mail, User as UserIcon, Calendar, CheckCircle2, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { FilterBar } from '@/components/shared/filter-bar';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { Activity } from '@/types';

interface ActivityFeedProps {
    activities: Activity[] | undefined;
    isLoading: boolean;
}

const getActivityIcon = (type: string) => {
    switch (type) {
        case 'call': return <Phone className="w-4 h-4 text-orange-500" />;
        case 'email': return <Mail className="w-4 h-4 text-blue-500" />;
        case 'meeting': return <Calendar className="w-4 h-4 text-purple-500" />;
        case 'status_change': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
        case 'note': return <MessageSquare className="w-4 h-4 text-slate-500" />;
        default: return <UserIcon className="w-4 h-4 text-muted-foreground" />;
    }
};

export function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredActivities = activities?.filter(a =>
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => b.timestamp - a.timestamp) || [];

    return (
        <div className="space-y-6">
            <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search activities by keyword..."
            />

            {isLoading ? (
                <TableSkeleton rows={8} />
            ) : (
                <Card className="shadow-sm border-border/50">
                    <CardContent className="p-6">
                        <div className="relative border-l border-border/50 ml-3 space-y-8 pb-4">
                            {filteredActivities.length === 0 ? (
                                <div className="pl-6 text-muted-foreground">No recent activities found.</div>
                            ) : (
                                filteredActivities.map((activity) => (
                                    <div key={activity.id} className="relative pl-8">
                                        <div className="absolute -left-3.5 top-1 bg-background border border-border/50 rounded-full p-1.5 shadow-sm">
                                            {getActivityIcon(activity.type)}
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{activity.description}</p>
                                                <p className="text-xs text-muted-foreground mt-1 gap-2 flex items-center">
                                                    <span className="capitalize">{activity.type.replace('_', ' ')}</span>
                                                    <span>•</span>
                                                    <span className="capitalize">{activity.relatedTo.type}</span>
                                                </p>
                                            </div>
                                            <div className="text-right sm:text-left shrink-0">
                                                <p className="text-xs text-muted-foreground" title={format(activity.timestamp, 'PPpp')}>
                                                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
