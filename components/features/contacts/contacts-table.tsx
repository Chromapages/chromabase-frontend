'use client';

import { Contact } from '@/types';
import { Pencil, Trash2, User, Mail, Phone, Building2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';

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
        <div className="bg-card/60 backdrop-blur-2xl rounded-3xl border border-border/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-border/30">
                        <tr>
                            <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                            <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client</th>
                            <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Job Title</th>
                            <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</th>
                            <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Contacted</th>
                            <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Primary</th>
                            <th className="text-right px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {contacts.map((contact) => (
                            <ContextMenu key={contact.id}>
                                <ContextMenuTrigger asChild>
                                    <tr className="hover:bg-muted/40 transition-colors group">
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
                                </ContextMenuTrigger>
                                <ContextMenuContent className="w-48">
                                    <ContextMenuLabel className="text-xs text-muted-foreground font-normal">Actions for {contact.firstName}</ContextMenuLabel>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem onClick={() => onEdit(contact.id)}>
                                        Edit Contact
                                    </ContextMenuItem>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem onClick={() => window.location.href = `mailto:${contact.email}`}>
                                        Send Email
                                    </ContextMenuItem>
                                    {contact.phone && (
                                        <ContextMenuItem onClick={() => window.location.href = `tel:${contact.phone}`}>
                                            Call Contact
                                        </ContextMenuItem>
                                    )}
                                    <ContextMenuSeparator />
                                    <ContextMenuItem variant="destructive" onClick={() => onDelete(contact.id)}>
                                        Delete Contact
                                        <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
                                    </ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
