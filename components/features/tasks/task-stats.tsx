'use client';

import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';
import { StatsCard } from '@/components/shared/stats-card';
import { CRMTask } from '@/types';
import { isBefore, startOfDay } from 'date-fns';

interface TaskStatsProps {
    tasks: CRMTask[];
    isLoading?: boolean;
}

export function TaskStats({ tasks, isLoading }: TaskStatsProps) {
    const today = startOfDay(new Date());

    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        pending: tasks.filter(t => t.status !== 'completed').length,
        overdue: tasks.filter(t =>
            t.status !== 'completed' &&
            isBefore(new Date(t.dueDate), today)
        ).length
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatsCard
                title="Total Tasks"
                value={stats.total}
                icon={ListTodo}
                description="All recorded tasks"
                isLoading={isLoading}
            />
            <StatsCard
                title="Pending"
                value={stats.pending}
                icon={Clock}
                description="Active tasks to do"
                trend={{ value: 12, isPositive: false }}
                isLoading={isLoading}
            />
            <StatsCard
                title="Completed"
                value={stats.completed}
                icon={CheckCircle2}
                description="Successfully finished"
                trend={{ value: 8, isPositive: true }}
                isLoading={isLoading}
            />
            <StatsCard
                title="Overdue"
                value={stats.overdue}
                icon={AlertCircle}
                description="Tasks past due date"
                className={stats.overdue > 0 ? "text-destructive" : ""}
                isLoading={isLoading}
            />
        </div>
    );
}
