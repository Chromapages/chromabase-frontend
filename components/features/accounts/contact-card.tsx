'use client';

import { Contact, Activity } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Clock, AlertTriangle, Calendar, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useState } from 'react';
import { cn } from '@/lib/utils';

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
            case 'meeting': return 'text-blue-400';
            case 'email': return 'text-emerald-400';
            case 'call': return 'text-purple-400';
            case 'note': return 'text-amber-400';
            default: return 'text-muted-foreground/40';
        }
    };

    return (
        <Card className={cn(
            "glass-sm border-white/5 shadow-xl rounded-sm overflow-hidden transition-all duration-500 hover:border-chroma-orange/20 group",
            stale && "border-amber-500/10 bg-amber-500/[0.02]"
        )}>
            <CardHeader className="p-6 pb-2 flex flex-row items-start justify-between bg-white/[0.01]">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                        <h4 className="font-bold text-[16px] tracking-tight text-foreground uppercase group-hover:text-chroma-orange transition-colors">
                            {contact.firstName} {contact.lastName}
                        </h4>
                        {contact.isPrimary && (
                            <span className="text-[9px] font-bold uppercase tracking-widest text-chroma-orange bg-chroma-orange/5 px-1.5 py-0.5 rounded-sm border border-chroma-orange/10">
                                Primary
                            </span>
                        )}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/40 font-sans">
                        {contact.jobTitle || 'Executive Delegate'}
                    </p>
                </div>

                {stale && (
                    <div className="flex items-center gap-2 px-2 py-1 rounded-sm bg-amber-500/5 border border-amber-500/10 text-amber-500 animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Latency Alert</span>
                    </div>
                )}
            </CardHeader>
            <CardContent className="p-6 pt-4 space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between group/item">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">Electronic Mail</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[12px] font-bold tracking-tight text-foreground/80 lowercase">{contact.email}</span>
                            <Mail className="w-3 h-3 text-muted-foreground/20 group-hover/item:text-chroma-orange transition-colors" />
                        </div>
                    </div>
                    {contact.phone && (
                        <div className="flex items-center justify-between group/item">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">Direct Line</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[12px] font-bold tracking-tight text-foreground/80 font-display">{contact.phone}</span>
                                <Phone className="w-3 h-3 text-muted-foreground/20 group-hover/item:text-chroma-orange transition-colors" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2 font-sans">
                        <Clock className="w-3 h-3" />
                        Sync: {contact.lastContactedAt ? formatDistanceToNow(contact.lastContactedAt, { addSuffix: true }) : 'N/A'}
                    </div>
                    {activities.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-3 text-[9px] font-bold uppercase tracking-widest hover:text-chroma-orange hover:bg-white/5 rounded-sm transition-all"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? 'Collapse Log' : 'Review Log'}
                            {isExpanded ? <ChevronUp className="w-2.5 h-2.5 ml-1.5" /> : <ChevronDown className="w-2.5 h-2.5 ml-1.5" />}
                        </Button>
                    )}
                </div>

                {isExpanded && activities.length > 0 && (
                    <div className="mt-4 pt-6 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
                        <h5 className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-4">Historical Narrative</h5>
                        <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5 text-[11px]">
                            {activities.slice(0, 5).map(activity => {
                                const Icon = getActivityIcon(activity.type);
                                return (
                                    <div key={activity.id} className="relative pl-8">
                                        <div className={cn(
                                            "absolute left-0 top-0.5 w-6 h-6 rounded-sm flex items-center justify-center border border-white/5 glass-sm",
                                            getActivityColor(activity.type).split(' ')[0]
                                        )}>
                                            <Icon className={cn("w-3 h-3", getActivityColor(activity.type))} />
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="font-bold tracking-tight text-foreground/90">{activity.description}</div>
                                            <div className="text-[9px] font-bold text-muted-foreground/30 uppercase font-sans tracking-widest">
                                                {format(activity.timestamp, 'MMM d, yyyy \u2022 h:mm a')}
                                            </div>
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
