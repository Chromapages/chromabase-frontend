'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Terminal,
    Globe,
    Copy,
    Check,
    Search,
    Code2,
    Zap,
    BookOpen,
    Play
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Endpoint {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    description: string;
    params?: string[];
    example?: string;
}

const ENDPOINTS: Record<string, Endpoint[]> = {
    'Tasks': [
        { method: 'GET', path: '/api/tasks', description: 'Retrieve all tasks, ordered by due date.' },
        { method: 'POST', path: '/api/tasks', description: 'Create a new task.', example: '{"title": "New Task", "status": "todo"}' },
        { method: 'POST', path: '/api/tasks/bulk-delete', description: 'Delete multiple tasks at once.', example: '{"ids": ["id1", "id2"]}' },
        { method: 'PUT', path: '/api/tasks/bulk-update', description: 'Update status/priority for multiple tasks.', example: '{"ids": ["id1"], "data": {"status": "completed"}}' },
        { method: 'GET', path: '/api/tasks/:id', description: 'Get details for a specific task.' },
        { method: 'PUT', path: '/api/tasks/:id', description: 'Update an existing task.' },
        { method: 'DELETE', path: '/api/tasks/:id', description: 'Remove a task permanently.' },
    ],
    'Clients': [
        { method: 'GET', path: '/api/clients', description: 'Fetch all client accounts.' },
        { method: 'POST', path: '/api/clients', description: 'Register a new client.' },
        { method: 'GET', path: '/api/clients/:id', description: 'Retrieve a single client profile.' },
        { method: 'PUT', path: '/api/clients/:id', description: 'Update client details.' },
        { method: 'DELETE', path: '/api/clients/:id', description: 'Deactivate/delete a client.' },
    ],
    'Leads': [
        { method: 'GET', path: '/api/leads', description: 'Retrieve all leads for the Kanban board.' },
        { method: 'POST', path: '/api/leads', description: 'Create a new lead.' },
        { method: 'PUT', path: '/api/leads/:id', description: 'Update lead status or position.' },
    ],
    'Proposals': [
        { method: 'GET', path: '/api/proposals', description: 'Fetch all client proposals.' },
        { method: 'POST', path: '/api/proposals', description: 'Create a new proposal doc.' },
        { method: 'GET', path: '/api/proposals/:id', description: 'Retrieve a single proposal.' },
        { method: 'PUT', path: '/api/proposals/:id', description: 'Update proposal terms/status.' },
        { method: 'DELETE', path: '/api/proposals/:id', description: 'Remove a proposal.' },
    ],
    'CRM Utilities': [
        { method: 'GET', path: '/api/stats', description: 'Get high-level dashboard metrics (Revenue, Client counts, etc).' },
        { method: 'GET', path: '/api/activities', description: 'Fetch the global activity stream (last 100 items).' },
        { method: 'GET', path: '/api/health', description: 'Check API and Firestore connection status.' },
    ],
    'Communications': [
        { method: 'GET', path: '/api/notifications', description: 'Fetch unread notifications for the active user.' },
        { method: 'PUT', path: '/api/notifications/:id', description: 'Mark notification as read.' },
        { method: 'POST', path: '/api/comments', description: 'Post a comment to a task or entity.', example: '{"entityId": "task123", "text": "Hello!"}' },
        { method: 'GET', path: '/api/comments', description: 'Get comments (query param: ?entityId=...)' },
    ]
};

const COMMANDS = [
    { name: 'Start Dev Environment', cmd: 'npm run dev', description: 'Launches the Next.js frontend with Hot Module Replacement.' },
    { name: 'Start REST API', cmd: 'node server.js', description: 'Runs the Express backend server on Port 3000.' },
    { name: 'Build for Production', cmd: 'npm run build', description: 'Compiles the application for optimal production usage.' },
    { name: 'Deploy to Cloud', cmd: 'firebase deploy', description: 'Pushes the current build and firestore rules to Firebase.' },
    { name: 'Lint Check', cmd: 'npm run lint', description: 'Analyzes code for styling and structural issues.' },
];

export function ApiExplorer() {
    const [activeTab, setActiveTab] = React.useState('endpoints');
    const [search, setSearch] = React.useState('');
    const [copied, setCopied] = React.useState<string | null>(null);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000);
    };

    const methodColor = (method: string) => {
        switch (method) {
            case 'GET': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'POST': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'PUT': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'DELETE': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return '';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">API Reference</h2>
                    <p className="text-muted-foreground">Technical explorer for developers and integration partners.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        className="w-full bg-muted/50 border rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        placeholder="Search endpoints..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-muted/50 p-1 mb-8">
                    <TabsTrigger value="endpoints" className="gap-2 rounded-md transition-all">
                        <Globe className="h-4 w-4" /> Endpoints
                    </TabsTrigger>
                    <TabsTrigger value="commands" className="gap-2 rounded-md transition-all">
                        <Terminal className="h-4 w-4" /> CLI Commands
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="endpoints" className="m-0 space-y-8">
                    {Object.entries(ENDPOINTS).map(([category, endpoints]) => {
                        const filtered = endpoints.filter(e =>
                            e.path.toLowerCase().includes(search.toLowerCase()) ||
                            e.description.toLowerCase().includes(search.toLowerCase()) ||
                            category.toLowerCase().includes(search.toLowerCase())
                        );

                        if (filtered.length === 0) return null;

                        return (
                            <div key={category} className="space-y-4">
                                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider pl-1">{category}</h3>
                                <div className="grid gap-3">
                                    {filtered.map((endpoint, i) => (
                                        <Card key={i} className="group overflow-hidden border-border/50 hover:border-primary/50 transition-colors shadow-none hover:shadow-lg hover:shadow-primary/5">
                                            <CardContent className="p-0">
                                                <div className="flex flex-col md:flex-row md:items-center">
                                                    <div className="flex items-center gap-3 p-4 md:w-1/3">
                                                        <Badge variant="outline" className={cn("font-mono font-bold px-2 py-0.5", methodColor(endpoint.method))}>
                                                            {endpoint.method}
                                                        </Badge>
                                                        <code className="text-sm font-semibold truncate">{endpoint.path}</code>
                                                    </div>
                                                    <div className="flex-1 p-4 text-sm text-muted-foreground border-t md:border-t-0 md:border-l border-border/50">
                                                        {endpoint.description}
                                                    </div>
                                                    <div className="p-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                                                        <Button variant="ghost" size="icon" onClick={() => handleCopy(endpoint.path)}>
                                                            {copied === endpoint.path ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                                        </Button>
                                                    </div>
                                                </div>
                                                {endpoint.example && (
                                                    <div className="bg-muted/30 p-4 border-t border-border/50">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                                                <Code2 className="h-3 w-3" /> Body Example
                                                            </span>
                                                        </div>
                                                        <pre className="text-xs font-mono bg-background/50 p-3 rounded border border-border/50 text-primary/80 overflow-x-auto">
                                                            {endpoint.example}
                                                        </pre>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </TabsContent>

                <TabsContent value="commands" className="m-0">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {COMMANDS.map((cmd, i) => (
                            <Card key={i} className="border-border/50 hover:border-primary/50 transition-all shadow-none">
                                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-base font-bold">{cmd.name}</CardTitle>
                                    <div className="p-2 rounded-full bg-primary/5 text-primary">
                                        <Play className="h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md border text-xs font-mono group relative">
                                        <code className="flex-1 text-primary truncate">{cmd.cmd}</code>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleCopy(cmd.cmd)}
                                        >
                                            {copied === cmd.cmd ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {cmd.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            <Card className="border-primary/20 bg-primary/5 ring-1 ring-primary/10">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Zap className="h-5 w-5" />
                        </div>
                        <CardTitle>Getting Started</CardTitle>
                    </div>
                    <CardDescription className="text-primary/70">
                        ChromaBase logic uses an idempotent REST design. Auth is handled via custom headers or system service accounts.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed">
                        To interface with this CRM from external scripts, use the JSON-API standard. Every request returns a <code>status</code> field: <code>"success"</code> or <code>"error"</code>.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="default" size="sm" className="gap-2">
                            <BookOpen className="h-4 w-4" /> Download SDK
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <a href="https://nextjs.org/docs" target="_blank" rel="noreferrer">Frontend Docs</a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
