'use client';

import { PageHeader } from '@/components/layout/page-header';
import { ReportDashboard } from '@/components/features/reports/report-dashboard';

export default function ReportsPage() {
    return (
        <div className="p-6 max-w-full mx-auto space-y-6">
            <PageHeader
                title="Reports & Analytics"
                description="Monitor sales performance, conversion rates, and team activity."
            />

            <ReportDashboard />
        </div>
    );
}

