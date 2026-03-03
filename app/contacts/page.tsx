'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { useContacts, useClients } from '@/hooks';
import { ContactsTable } from '@/components/features/contacts/contacts-table';
import { ContactsFilterBar } from '@/components/features/contacts/contacts-filter-bar';
import { ContactDialog } from '@/components/features/contacts/contact-dialog';
import { TableSkeleton } from '@/components/shared/loading-skeleton';

export default function ContactsPage() {
    const { useList, useCreate, useUpdate, useDelete } = useContacts();
    const { useList: useClientList } = useClients();
    
    const { data: contacts = [], isLoading } = useList();
    const { data: clients = [] } = useClientList();
    
    const createContact = useCreate();
    const updateContact = useUpdate();
    const deleteContact = useDelete();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClientId, setSelectedClientId] = useState<string>('all');
    const [editingContact, setEditingContact] = useState<string | null>(null);

    // Create client lookup map
    const clientMap = useMemo(() => {
        return clients.reduce((acc, client) => {
            acc[client.id] = client;
            return acc;
        }, {} as Record<string, typeof clients[0]>);
    }, [clients]);

    // Add client name to contacts
    const contactsWithClient = useMemo(() => {
        return contacts.map(contact => ({
            ...contact,
            clientName: clientMap[contact.clientId]?.companyName || 'Unknown',
        }));
    }, [contacts, clientMap]);

    // Filter contacts
    const filteredContacts = useMemo(() => {
        return contactsWithClient.filter(contact => {
            const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
            const matchesSearch = 
                fullName.includes(searchQuery.toLowerCase()) ||
                contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.clientName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesClient = selectedClientId === 'all' || contact.clientId === selectedClientId;
            return matchesSearch && matchesClient;
        });
    }, [contactsWithClient, searchQuery, selectedClientId]);

    const handleSaveContact = (data: any) => {
        if (editingContact) {
            updateContact.mutate({ id: editingContact, data });
        } else {
            createContact.mutate(data);
        }
        setIsDialogOpen(false);
        setEditingContact(null);
    };

    const handleEditContact = (contactId: string) => {
        const contact = contacts.find(c => c.id === contactId);
        if (contact) {
            setEditingContact(contactId);
            setIsDialogOpen(true);
        }
    };

    const handleDeleteContact = (contactId: string) => {
        if (confirm('Are you sure you want to delete this contact?')) {
            deleteContact.mutate(contactId);
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-[1700px] mx-auto space-y-4 md:space-y-6">
            <PageHeader
                title="Contacts"
                description="Manage client contacts and relationships."
            />

            <ContactsFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedClientId={selectedClientId}
                onClientChange={setSelectedClientId}
                clients={clients}
                onNewContact={() => {
                    setEditingContact(null);
                    setIsDialogOpen(true);
                }}
                contactCount={filteredContacts.length}
            />

            {isLoading ? (
                <TableSkeleton rows={8} />
            ) : (
                <ContactsTable
                    contacts={filteredContacts}
                    onEdit={handleEditContact}
                    onDelete={handleDeleteContact}
                />
            )}

            <ContactDialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) setEditingContact(null);
                }}
                contact={editingContact ? contacts.find(c => c.id === editingContact) : undefined}
                clients={clients}
                onSave={handleSaveContact}
            />
        </div>
    );
}
