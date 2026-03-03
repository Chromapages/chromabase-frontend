'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAppointments, useUsers } from '@/hooks';
import { AppointmentType } from '@/types';

interface EventDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EventDialog({ open, onOpenChange }: EventDialogProps) {
    const { useCreate } = useAppointments();
    const createAppointment = useCreate();

    const { useList: useUsersList } = useUsers();
    const { data: users } = useUsersList();

    const [title, setTitle] = useState('');
    const [type, setType] = useState<AppointmentType>('meeting');
    const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));
    const [endDate, setEndDate] = useState(new Date(Date.now() + 3600000).toISOString().slice(0, 16));
    const [assignedTo, setAssignedTo] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Event Title is required');
            return;
        }

        const now = Date.now();
        const startTimestamp = new Date(startDate).getTime();
        const endTimestamp = new Date(endDate).getTime();

        if (endTimestamp <= startTimestamp) {
            setError('End time must be after start time');
            return;
        }

        createAppointment.mutate({
            title,
            description: '',
            startTime: startTimestamp,
            endTime: endTimestamp,
            type,
            status: 'scheduled',
            clientId: null,
            leadId: null,
            assignedTo: assignedTo || 'unassigned',
            createdAt: now,
            updatedAt: now,
        }, {
            onSuccess: () => {
                setTitle('');
                setType('meeting');
                setAssignedTo('');
                onOpenChange(false);
            },
            onError: (err) => {
                setError(err instanceof Error ? err.message : 'Failed to create event');
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                    <DialogDescription>
                        Schedule a new meeting, call, or consultation.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Event Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Kickoff Meeting"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Event Type</Label>
                            <Select value={type} onValueChange={(v: any) => setType(v)}>
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="meeting">Meeting</SelectItem>
                                    <SelectItem value="call">Call</SelectItem>
                                    <SelectItem value="consultation">Consultation</SelectItem>
                                    <SelectItem value="follow_up">Follow Up</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="assignedTo">Host / Assignee</Label>
                            <Select value={assignedTo} onValueChange={setAssignedTo}>
                                <SelectTrigger id="assignedTo">
                                    <SelectValue placeholder="Select Host" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users?.map((user: any) => {
                                        const displayName = user.displayName ||
                                            (user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : null) ||
                                            user.name ||
                                            (user.email ? user.email.split('@')[0] : 'Unknown User');
                                        return (
                                            <SelectItem key={user.id} value={user.id}>
                                                {displayName}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Time</Label>
                            <Input
                                id="startDate"
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Time</Label>
                            <Input
                                id="endDate"
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-destructive font-medium">
                            {error}
                        </div>
                    )}

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createAppointment.isPending}>
                            {createAppointment.isPending ? 'Scheduling...' : 'Schedule Event'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
