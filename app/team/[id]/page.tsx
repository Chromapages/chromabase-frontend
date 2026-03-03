'use client';

import { useParams } from 'next/navigation';
import { MemberDetailPage } from '@/components/features/team/member-detail-page';

export default function TeamMemberPage() {
    const params = useParams();
    const id = params.id as string;

    return <MemberDetailPage id={id} />;
}
