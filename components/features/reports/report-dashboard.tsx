'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDeals, useLeads, useActivities, useUsers } from '@/hooks';
import { format, subMonths, isSameMonth } from 'date-fns';
import { Loader2 } from 'lucide-react';

const BASE_REVENUE_TARGET = 50000;
const MONTHLY_TARGET_GROWTH = 5000;

const revenueChartConfig = {
    revenue: { label: 'Revenue', color: 'hsl(var(--primary))' },
    target: { label: 'Target', color: 'hsl(var(--muted-foreground))' },
};

const conversionConfig = {
    new: { label: 'New', color: 'hsl(210 100% 50%)' },
    contacted: { label: 'Contacted', color: 'hsl(280 100% 60%)' },
    qualified: { label: 'Qualified', color: 'hsl(45 100% 50%)' },
    proposal: { label: 'Proposal', color: 'hsl(25 100% 50%)' },
    won: { label: 'Won', color: 'hsl(140 100% 40%)' },
};

const activityConfig = {
    emails: { label: 'Emails', color: 'hsl(var(--primary))' },
    calls: { label: 'Calls', color: 'hsl(280 100% 60%)' },
    meetings: { label: 'Meetings', color: 'hsl(45 100% 50%)' },
};

export function ReportDashboard() {
    const { useList: useDealsList } = useDeals();
    const { useList: useLeadsList } = useLeads();
    const { useList: useActivitiesList } = useActivities();
    const { useList: useUsersList } = useUsers();

    const { data: deals = [], isLoading: loadingDeals } = useDealsList();
    const { data: leads = [], isLoading: loadingLeads } = useLeadsList();
    const { data: activities = [], isLoading: loadingActivities } = useActivitiesList();
    const { data: users = [], isLoading: loadingUsers } = useUsersList();

    const isLoading = loadingDeals || loadingLeads || loadingActivities || loadingUsers;

    const revenueData = useMemo(() => {
        const now = new Date();
        const months = Array.from({ length: 6 }).map((_, i) => subMonths(now, 5 - i));

        return months.map(monthDate => {
            const revenue = deals
                .filter(d => d.stage === 'closed_won' && d.closeDate && isSameMonth(new Date(d.closeDate), monthDate))
                .reduce((sum, d) => sum + d.value, 0);

            return {
                month: format(monthDate, 'MMM'),
                revenue,
                target: BASE_REVENUE_TARGET + (monthDate.getMonth() * MONTHLY_TARGET_GROWTH)
            };
        });
    }, [deals]);

    const conversionData = useMemo(() => {
        const counts = { new: 0, contacted: 0, meeting: 0, proposal: 0, won: 0, lost: 0 };
        leads.forEach(lead => {
            if (lead.status === 'new') counts.new++;
            else if (lead.status === 'contacted') counts.contacted++;
            else if (lead.status === 'meeting_scheduled') counts.meeting++;
            else if (lead.status === 'proposal_sent') counts.proposal++;
            else if (lead.status === 'won') counts.won++;
            else if (lead.status === 'lost') counts.lost++;
        });

        const data = [
            { stage: 'New', count: counts.new, fill: 'var(--color-new)' },
            { stage: 'Contacted', count: counts.contacted, fill: 'var(--color-contacted)' },
            { stage: 'Meeting', count: counts.meeting, fill: 'var(--color-qualified)' },
            { stage: 'Proposal', count: counts.proposal, fill: 'var(--color-proposal)' },
            { stage: 'Won', count: counts.won, fill: 'var(--color-won)' },
            { stage: 'Lost', count: counts.lost, fill: 'hsl(0 100% 50%)' },
        ].filter(d => d.count > 0);

        // Ensure there's at least dummy data to render the chart if empty
        return data.length > 0 ? data : [{ stage: 'No Data', count: 1, fill: 'var(--color-new)' }];
    }, [leads]);

    const activityData = useMemo(() => {
        const counts = { email: 0, call: 0, meeting: 0, task: 0 };
        activities.forEach(act => {
            if (act.type === 'email') counts.email++;
            else if (act.type === 'call') counts.call++;
            else if (act.type === 'meeting') counts.meeting++;
            else counts.task++;
        });

        const data = [
            { type: 'Emails', count: counts.email, fill: 'var(--color-emails)' },
            { type: 'Calls', count: counts.call, fill: 'var(--color-calls)' },
            { type: 'Meetings', count: counts.meeting, fill: 'var(--color-meetings)' },
        ].filter(d => d.count > 0);

        return data.length > 0 ? data : [{ type: 'No Data', count: 1, fill: 'var(--color-emails)' }];
    }, [activities]);

    const topPerformers = useMemo(() => {
        const performerMap = new Map<string, { revenue: number, deals: number }>();
        deals.filter(d => d.stage === 'closed_won').forEach(deal => {
            if (!deal.ownerId) return;
            const current = performerMap.get(deal.ownerId) || { revenue: 0, deals: 0 };
            performerMap.set(deal.ownerId, {
                revenue: current.revenue + deal.value,
                deals: current.deals + 1
            });
        });

        return Array.from(performerMap.entries())
            .map(([userId, stats]) => {
                const user = users.find(u => u.id === userId);
                return {
                    id: userId,
                    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Unknown',
                    role: user?.role || 'Sales Rep',
                    avatarUrl: user?.avatarUrl || '',
                    ...stats
                };
            })
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 4);
    }, [deals, users]);

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Revenue vs Target</CardTitle>
                    <CardDescription>Monthly revenue performance for the current year</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={revenueChartConfig} className="h-[300px] w-full">
                        <BarChart data={revenueData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis tickFormatter={(val) => `$${val / 1000}k`} tickLine={false} axisLine={false} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="target" fill="var(--color-target)" radius={[4, 4, 0, 0]} opacity={0.5} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Top Performers Leaderboard */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Performers</CardTitle>
                    <CardDescription>Sales representatives ordered by total revenue</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6 mt-4">
                        {topPerformers.length === 0 ? (
                            <div className="text-center text-sm text-muted-foreground py-10">No closed deals yet.</div>
                        ) : topPerformers.map((person, index) => (
                            <div key={person.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="font-bold text-muted-foreground w-4 text-center">{index + 1}</div>
                                    <Avatar>
                                        <AvatarImage src={person.avatarUrl} alt="User avatar" />
                                        <AvatarFallback>{person.name.charAt(0)}{person.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium leading-none">{person.name}</p>
                                        <p className="text-sm text-muted-foreground mt-1 capitalize">{person.role.replace('_', ' ')}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-emerald-600 dark:text-emerald-400">
                                        ${person.revenue.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{person.deals} deals won</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Lead Conversion Funnel */}
            <Card>
                <CardHeader>
                    <CardTitle>Pipeline Conversion</CardTitle>
                    <CardDescription>Number of leads at each stage of the funnel</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <ChartContainer config={conversionConfig} className="h-full w-full">
                        <PieChart>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Pie
                                data={conversionData}
                                dataKey="count"
                                nameKey="stage"
                                innerRadius={60}
                                outerRadius={100}
                                strokeWidth={2}
                                paddingAngle={2}
                            >
                                {conversionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <ChartLegend content={<ChartLegendContent />} />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Activity Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Activity Breakdown</CardTitle>
                    <CardDescription>Distribution of logged activities</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <ChartContainer config={activityConfig} className="h-full w-full">
                        <PieChart>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Pie
                                data={activityData}
                                dataKey="count"
                                nameKey="type"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                strokeWidth={2}
                                fill="#8884d8"
                            >
                                {activityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <ChartLegend content={<ChartLegendContent />} />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
