'use client';

import { WorkflowCard } from './workflow-card';
import { useWorkflows } from '@/hooks';

export function WorkflowList() {
    const { useList, useUpdate } = useWorkflows();
    const { data: workflows, isLoading } = useList();
    const updateWorkflow = useUpdate();

    const handleToggle = (id: string, isActive: boolean) => {
        updateWorkflow.mutate({ id, data: { isActive, updatedAt: Date.now() } });
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading workflows...</div>;
    }

    if (!workflows || workflows.length === 0) {
        return (
            <div className="p-12 text-center text-muted-foreground bg-card border border-dashed rounded-xl">
                No workflows found.
            </div>
        );
    }

    const activeWorkflows = workflows.filter(w => w.isActive);
    const inactiveWorkflows = workflows.filter(w => !w.isActive);

    return (
        <div className="space-y-8">
            {activeWorkflows.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold tracking-tight">Active Workflows</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeWorkflows.map(wf => (
                            <WorkflowCard key={wf.id} workflow={wf} onToggle={handleToggle} />
                        ))}
                    </div>
                </div>
            )}

            {inactiveWorkflows.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold tracking-tight text-muted-foreground">Inactive Workflows</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-75">
                        {inactiveWorkflows.map(wf => (
                            <WorkflowCard key={wf.id} workflow={wf} onToggle={handleToggle} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
