import { use } from 'react';
import { LeadDetailPage } from '@/components/features/leads/lead-detail-page';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <LeadDetailPage id={id} />;
}
