'use client';

import { Contact, Activity } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Clock, AlertTriangle, Calendar, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useState } from 'react';

interface ContactCardProps {
    contact: Contact;
    activities: Activity[];
}

export function ContactCard({ contact, activities }: ContactCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const isStale = () => {
        if (!contact.lastContactedAt) return true;
        const daysSinceLastContact = (Date.now() - contact.lastContactedAt) / (1000 * 60 * 60 * 24);
        return daysSinceLastContact > 30;
    };

    const stale = isStale();

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'meeting': return Calendar;
            case 'email': return Mail;
            case 'call': return Phone;
            case 'note': return FileText;
            default: return Clock;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'meeting': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400';
            case 'email': return 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400';
            case 'call': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400';
            case 'note': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400';
            default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    return (
        <Card className={`shadow-sm border-border/50 overflow-hidden transition-all duration-200 ${stale ? 'border-amber-500/30 bg-amber-500/5' : ''}`}>
            <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-base leading-none">{contact.firstName} {contact.lastName}</h4>
                        {contact.isPrimary && <Badge variant="secondary" className="text-[10px] h-5 px-1.5">Primary</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{contact.jobTitle}</p>
                </div>

                {stale && (
                    <div className="flex items-center text-amber-600 dark:text-amber-500 text-xs font-medium gap-1 bg-amber-100 dark:bg-amber-950/50 px-2 py-1 rounded-full">
                        <AlertTriangle className="w-3 h-3" /> Needs Follow-up
                    </div>
                )}
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span className="text-foreground">{contact.email}</span>
                    </div>
                    {contact.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span className="text-foreground">{contact.phone}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-3">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Last contacted: {contact.lastContactedAt ? formatDistanceToNow(contact.lastContactedAt, { addSuffix: true }) : 'Never'}
                    </div>
                    {activities.length > 0 && (
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setIsExpanded(!isExpanded)}>
                            {isExpanded ? 'Hide Activity' : 'View Activity'}
                            {isExpanded ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                        </Button>
                    )}
                </div>

                {isExpanded && activities.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/40 space-y-3">
                        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Activity Timeline</h5>
                        <div className="space-y-3 pl-2 border-l-2 border-muted/50">
                            {activities.slice(0, 5).map(activity => {
                                const Icon = getActivityIcon(activity.type);
                                return (
                                    <div key={activity.id} className="relative pl-4">
                                        <div className={`absolute -left-[17px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-card ${getActivityColor(activity.type)}`}>
                                            <Icon className="w-3 h-3" />
                                        </div>
                                        <div className="text-sm font-medium">{activity.description}</div>
                                        <div className="text-xs text-muted-foreground mt-0.5">
                                            {format(activity.timestamp, 'MMM d, yyyy \u2022 h:mm a')}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
