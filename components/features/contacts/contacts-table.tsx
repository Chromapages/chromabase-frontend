'use client';

import { Contact } from '@/types';
import { Pencil, Trash2, User, Mail, Phone, Building2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ContactsTableProps {
    contacts: (Contact & { clientName?: string })[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export function ContactsTable({ contacts, onEdit, onDelete }: ContactsTableProps) {
    if (contacts.length === 0) {
        return (
            <div className="bg-card rounded-lg border border-border p-8 text-center">
                <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No contacts found</h3>
                <p className="text-muted-foreground text-sm">
                    Add your first contact to get started.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Name</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Client</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Job Title</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Contact</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Last Contacted</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Primary</th>
                            <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {contacts.map((contact) => (
                            <tr 
                                key={contact.id} 
                                className="hover:bg-muted/50 transition-colors"
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-sm font-medium text-primary">
                                                {contact.firstName[0]}{contact.lastName[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-medium">
                                                {contact.firstName} {contact.lastName}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Building2 className="w-4 h-4 text-muted-foreground" />
                                        {contact.clientName || 'Unknown'}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                    {contact.jobTitle}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="w-3 h-3 text-muted-foreground" />
                                            <span className="text-muted-foreground">{contact.email}</span>
                                        </div>
                                        {contact.phone && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="w-3 h-3 text-muted-foreground" />
                                                <span className="text-muted-foreground">{contact.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    {contact.lastContactedAt ? (
                                        <span className={
                                            Date.now() - contact.lastContactedAt > 30 * 24 * 60 * 60 * 1000
                                                ? 'text-amber-500'
                                                : 'text-muted-foreground'
                                        }>
                                            {formatDistanceToNow(contact.lastContactedAt, { addSuffix: true })}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">Never</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {contact.isPrimary && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                            Primary
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(contact.id)}
                                            className="p-1.5 rounded-md hover:bg-muted transition-colors"
                                            title="Edit contact"
                                        >
                                            <Pencil className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(contact.id)}
                                            className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                                            title="Delete contact"
                                        >
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
