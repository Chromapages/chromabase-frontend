'use client';

import { useEffect, useState } from 'react';
import { Contact, Client, ContactFormData } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ContactDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contact?: Contact;
    clients: Client[];
    onSave: (data: ContactFormData) => void;
}

export function ContactDialog({
    open,
    onOpenChange,
    contact,
    clients,
    onSave,
}: ContactDialogProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        jobTitle: '',
        clientId: '',
        isPrimary: false,
        notes: '',
        lastContactedAt: null as number | null,
    });

    useEffect(() => {
        if (contact) {
            setFormData({
                firstName: contact.firstName,
                lastName: contact.lastName,
                email: contact.email,
                phone: contact.phone || '',
                jobTitle: contact.jobTitle,
                clientId: contact.clientId,
                isPrimary: contact.isPrimary,
                notes: contact.notes || '',
                lastContactedAt: contact.lastContactedAt || null,
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                jobTitle: '',
                clientId: clients[0]?.id || '',
                isPrimary: false,
                notes: '',
                lastContactedAt: null,
            });
        }
    }, [contact, clients, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            clientId: formData.clientId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            jobTitle: formData.jobTitle,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {contact ? 'Edit Contact' : 'Add New Contact'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title *</Label>
                        <Input
                            id="jobTitle"
                            value={formData.jobTitle}
                            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="clientId">Client *</Label>
                        <select
                            id="clientId"
                            value={formData.clientId}
                            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            required
                        >
                            <option value="">Select a client</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.companyName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isPrimary"
                            checked={formData.isPrimary}
                            onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                            className="w-4 h-4 rounded border-border"
                        />
                        <Label htmlFor="isPrimary" className="text-sm font-normal">
                            Primary contact for this client
                        </Label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {contact ? 'Save Changes' : 'Add Contact'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
