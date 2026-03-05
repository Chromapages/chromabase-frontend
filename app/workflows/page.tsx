import { PageHeader } from '@/components/layout/page-header';
import { WorkflowList } from '@/components/features/workflows/workflow-list';

export default function WorkflowsPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="Smart Workflows"
                description="Automate your sales pipeline with trigger-based actions."
            />
            <WorkflowList />
        </div>
    );
}
