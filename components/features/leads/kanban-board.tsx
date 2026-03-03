'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Lead } from '@/types';
import { LEAD_STATUS_OPTIONS } from '@/constants';
import { KanbanColumn } from './kanban-column';
import { KanbanItem } from './kanban-item';
import { createPortal } from 'react-dom';

interface KanbanBoardProps {
    leads: Lead[];
    onLeadUpdate: (leadId: string, updates: Partial<Lead>) => void;
}

export function KanbanBoard({ leads, onLeadUpdate }: KanbanBoardProps) {
    const [activeLead, setActiveLead] = useState<Lead | null>(null);
    const [columns, setColumns] = useState(() => LEAD_STATUS_OPTIONS);
    // State for local items to allow optimistic updates during drag
    const [items, setItems] = useState<Lead[]>(leads);

    // Update items when leads prop changes from server
    useEffect(() => {
        setItems(leads);
    }, [leads]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const onDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const activeLeadItem = items.find(lead => lead.id === active.id);
        if (activeLeadItem) setActiveLead(activeLeadItem);
    };

    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveALead = active.data.current?.type === 'Lead';
        const isOverALead = over.data.current?.type === 'Lead';
        const isOverAColumn = over.data.current?.type === 'Column';

        if (!isActiveALead) return;

        // Dropping a Lead over another Lead
        if (isActiveALead && isOverALead) {
            setItems((items) => {
                const activeIndex = items.findIndex((t) => t.id === activeId);
                const overIndex = items.findIndex((t) => t.id === overId);

                if (items[activeIndex].status !== items[overIndex].status) {
                    const newItems = [...items];
                    newItems[activeIndex] = { ...newItems[activeIndex], status: items[overIndex].status };
                    return arrayMove(newItems, activeIndex, overIndex);
                }

                return arrayMove(items, activeIndex, overIndex);
            });
        }

        // Dropping a Lead over a Column
        if (isActiveALead && isOverAColumn) {
            setItems((items) => {
                const activeIndex = items.findIndex((t) => t.id === activeId);
                const newItems = [...items];
                const newStatus = overId as Lead['status'];

                if (newItems[activeIndex].status !== newStatus) {
                    newItems[activeIndex] = { ...newItems[activeIndex], status: newStatus };
                    return arrayMove(newItems, activeIndex, activeIndex);
                }

                return newItems;
            });
        }
    };

    const onDragEnd = (event: DragEndEvent) => {
        setActiveLead(null);
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id;

        const activeLeadItem = items.find(l => l.id === activeId);

        // Determine the new status
        let newStatus = activeLeadItem?.status;
        if (over.data.current?.type === 'Column') {
            newStatus = overId as Lead['status'];
        } else if (over.data.current?.type === 'Lead') {
            const overLead = items.find(l => l.id === overId);
            newStatus = overLead?.status;
        }

        if (activeLeadItem && newStatus && activeLeadItem.status !== newStatus) {
            // Only trigger update if the status actually changed based on the prop array
            const originalLead = leads.find(l => l.id === activeId);
            if (originalLead && originalLead.status !== newStatus) {
                onLeadUpdate(activeId, { status: newStatus as Lead['status'] });
            }
        }
    };

    return (
        <div className="flex w-full overflow-x-auto overflow-y-hidden gap-4 pb-4 h-[calc(100vh-14rem)]">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
            >
                <div className="flex gap-4 h-full">
                    {columns.map((col) => (
                        <KanbanColumn
                            key={col.value}
                            column={col}
                            leads={items.filter((lead) => lead.status === col.value)}
                        />
                    ))}
                </div>

                {typeof window !== 'undefined' && createPortal(
                    <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
                        {activeLead && <KanbanItem lead={activeLead} />}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
}
