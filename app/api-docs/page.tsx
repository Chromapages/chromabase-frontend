import { ApiExplorer } from '@/components/features/api-docs/api-explorer';

export default function ApiDocsPage() {
    return (
        <div className="flex-1 overflow-y-auto bg-background/50">
            <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <ApiExplorer />
            </div>
        </div>
    );
}
