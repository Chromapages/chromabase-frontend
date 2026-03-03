'use client';

import { Search, Plus, Users } from 'lucide-react';
import { Client } from '@/types';

interface ContactsFilterBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedClientId: string;
    onClientChange: (clientId: string) => void;
    clients: Client[];
    onNewContact: () => void;
    contactCount: number;
}

export function ContactsFilterBar({
    searchQuery,
    onSearchChange,
    selectedClientId,
    onClientChange,
    clients,
    onNewContact,
    contactCount,
}: ContactsFilterBarProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-1">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 pr-4 py-2 w-64 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                </div>

                <select
                    value={selectedClientId}
                    onChange={(e) => onClientChange(e.target.value)}
                    className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                    <option value="all">All Clients</option>
                    {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                            {client.companyName}
                        </option>
                    ))}
                </select>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{contactCount} contact{contactCount !== 1 ? 's' : ''}</span>
                </div>
            </div>

            <button
                onClick={onNewContact}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
                <Plus className="w-4 h-4" />
                Add Contact
            </button>
        </div>
    );
}
