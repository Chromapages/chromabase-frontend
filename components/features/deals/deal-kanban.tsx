'use client';

import { useState, useEffect } from 'react';
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
    arrayMove,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Deal } from '@/types';
import { DEAL_STAGE_OPTIONS } from '@/constants';
import { DealKanbanColumn } from './deal-kanban-column';
import { DealCard } from './deal-card';
import { createPortal } from 'react-dom';

interface DealKanbanProps {
    deals: Deal[];
    onDealUpdate: (dealId: string, updates: Partial<Deal>) => void;
}

export function DealKanban({ deals, onDealUpdate }: DealKanbanProps) {
    const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
    const [columns] = useState(() => DEAL_STAGE_OPTIONS);
    const [items, setItems] = useState<Deal[]>(deals);

    useEffect(() => {
        setItems(deals);
    }, [deals]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const onDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const activeDealItem = items.find(deal => deal.id === active.id);
        if (activeDealItem) setActiveDeal(activeDealItem);
    };

    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveADeal = active.data.current?.type === 'Deal';
        const isOverADeal = over.data.current?.type === 'Deal';
        const isOverAColumn = over.data.current?.type === 'Column';

        if (!isActiveADeal) return;

        // Dropping a Deal over another Deal
        if (isActiveADeal && isOverADeal) {
            setItems((items) => {
                const activeIndex = items.findIndex((t) => t.id === activeId);
                const overIndex = items.findIndex((t) => t.id === overId);

                if (items[activeIndex].stage !== items[overIndex].stage) {
                    const newItems = [...items];
                    newItems[activeIndex] = { ...newItems[activeIndex], stage: items[overIndex].stage };
                    return arrayMove(newItems, activeIndex, overIndex);
                }

                return arrayMove(items, activeIndex, overIndex);
            });
        }

        // Dropping a Deal over a Column
        if (isActiveADeal && isOverAColumn) {
            setItems((items) => {
                const activeIndex = items.findIndex((t) => t.id === activeId);
                const newItems = [...items];
                const newStage = overId as Deal['stage'];

                if (newItems[activeIndex].stage !== newStage) {
                    newItems[activeIndex] = { ...newItems[activeIndex], stage: newStage };
                    return arrayMove(newItems, activeIndex, activeIndex);
                }

                return newItems;
            });
        }
    };

    const onDragEnd = (event: DragEndEvent) => {
        setActiveDeal(null);
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id;

        const activeDealItem = items.find(l => l.id === activeId);

        let newStage = activeDealItem?.stage;
        if (over.data.current?.type === 'Column') {
            newStage = overId as Deal['stage'];
        } else if (over.data.current?.type === 'Deal') {
            const overDeal = items.find(l => l.id === overId);
            newStage = overDeal?.stage;
        }

        if (activeDealItem && newStage && activeDealItem.stage !== newStage) {
            const originalDeal = deals.find(l => l.id === activeId);
            if (originalDeal && originalDeal.stage !== newStage) {
                onDealUpdate(activeId, { stage: newStage as Deal['stage'] });
            }
        }
    };

    return (
        <div className="flex w-full overflow-x-auto overflow-y-hidden gap-4 pb-4 h-[calc(100vh-18rem)]">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
            >
                <div className="flex gap-4 h-full w-full min-w-max">
                    {columns.map((col) => (
                        <DealKanbanColumn
                            key={col.value}
                            column={col}
                            deals={items.filter((deal) => deal.stage === col.value)}
                        />
                    ))}
                </div>

                {typeof window !== 'undefined' && createPortal(
                    <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
                        {activeDeal && <DealCard deal={activeDeal} />}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
}
