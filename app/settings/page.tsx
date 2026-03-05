'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    User,
    Palette,
    Bell,
    Database,
    Monitor,
    Moon,
    Sun,
    Laptop,
    ArrowRight,
    Globe
} from 'lucide-react';
import { useUsers } from '@/hooks';
import { ROUTES } from '@/constants';
import { apiRequest } from '@/lib/firestore';

// Local mock for missing useToast
const useToast = () => ({
    toast: ({ title, description }: any) => {
        if (typeof window !== 'undefined') {
            window.alert(`${title || ''}\n${description || ''}`);
        }
    }
});

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    // Simulate current user using the first mock user
    const { useList } = useUsers();
    const { data: users } = useList();
    const currentUser = users?.[0] || { firstName: 'Demo', lastName: 'User', email: 'demo@example.com', role: 'admin' };

    const [profileData, setProfileData] = useState({
        firstName: currentUser?.firstName || '',
        lastName: currentUser?.lastName || '',
        email: currentUser?.email || ''
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSaveProfile = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1000);
    };

    const [discordWebhookUrl, setDiscordWebhookUrl] = useState('');
    const [isTestingDiscord, setIsTestingDiscord] = useState(false);
    const [discordOptions, setDiscordOptions] = useState({ highPriorityTasks: true, dealStageChanges: true });
    const { toast } = useToast();

    useEffect(() => {
        const fetchDiscordSettings = async () => {
            try {
                const data = await apiRequest<any>('/api/settings/discord');
                if (data) {
                    setDiscordWebhookUrl(data.webhookUrl || '');
                    if (data.options) setDiscordOptions(data.options);
                }
            } catch (e) { console.error("Failed to load discord settings", e); }
        };
        fetchDiscordSettings();
    }, []);

    const handleSaveDiscordOptions = async () => {
        try {
            await apiRequest('/api/settings/discord', {
                method: 'POST',
                body: JSON.stringify({ webhookUrl: discordWebhookUrl, options: discordOptions })
            });
            toast({ title: 'Integration Saved', description: 'Your Discord settings have been updated.' });
        } catch (e) { toast({ title: 'Error', description: 'Failed to save settings.', variant: 'destructive' }); }
    };

    const handleTestDiscord = async () => {
        if (!discordWebhookUrl) return;
        setIsTestingDiscord(true);
        try {
            await apiRequest('/api/discord/test', {
                method: 'POST',
                body: JSON.stringify({ webhookUrl: discordWebhookUrl })
            });
            toast({
                title: "Integration Successful",
                description: "A test message was sent to your Discord channel.",
            });
        } catch (e: any) {
            toast({
                variant: "destructive",
                title: "Integration Failed",
                description: e.message || "Network error.",
            });
        } finally {
            setIsTestingDiscord(false);
        }
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto flex flex-col h-[calc(100vh-4rem)] space-y-4">
            <PageHeader
                title="Settings"
                description="Manage your account settings and preferences."
            />

            <div className="flex-1 overflow-y-auto min-h-0 bg-card border border-border/50 rounded-2xl shadow-sm backdrop-blur-sm bg-card/50">
                <Tabs defaultValue="profile" className="flex flex-col md:flex-row w-full h-full">

                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border/50 p-4 shrink-0 bg-muted/10">
                        <TabsList className="flex flex-row md:flex-col h-auto w-full bg-transparent p-0 gap-1 items-start justify-start overflow-x-auto hide-scrollbar">
                            <TabsTrigger
                                value="profile"
                                className="w-full justify-start gap-3 px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
                            >
                                <User className="w-4 h-4" />
                                Profile
                            </TabsTrigger>
                            <TabsTrigger
                                value="appearance"
                                className="w-full justify-start gap-3 px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
                            >
                                <Palette className="w-4 h-4" />
                                Appearance
                            </TabsTrigger>
                            <TabsTrigger
                                value="notifications"
                                className="w-full justify-start gap-3 px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
                            >
                                <Bell className="w-4 h-4" />
                                Notifications
                            </TabsTrigger>
                            <TabsTrigger
                                value="api"
                                className="w-full justify-start gap-3 px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
                            >
                                <Database className="w-4 h-4" />
                                API & Data
                            </TabsTrigger>
                            <TabsTrigger
                                value="integrations"
                                className="w-full justify-start gap-3 px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
                            >
                                <Globe className="w-4 h-4" />
                                Integrations
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-6 md:p-8 overflow-y-auto overflow-x-hidden">

                        {/* PROFILE TAB */}
                        <TabsContent value="profile" className="m-0 space-y-6 max-w-2xl focus-visible:outline-none">
                            <div>
                                <h3 className="text-lg font-medium">Profile Settings</h3>
                                <p className="text-sm text-muted-foreground">Manage your personal information and identity.</p>
                            </div>

                            <div className="flex items-center gap-6 py-4">
                                <Avatar className="w-20 h-20 border-2 border-border">
                                    <AvatarImage src="" alt="User avatar" />
                                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                        {(profileData.firstName?.[0] || 'U').toUpperCase()}{(profileData.lastName?.[0] || '').toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <Button variant="outline" size="sm">Change Avatar</Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={profileData.firstName}
                                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={profileData.lastName}
                                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Input id="role" value={currentUser.role} disabled className="capitalize bg-muted" />
                                </div>
                            </div>

                            <Button onClick={handleSaveProfile} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </TabsContent>

                        {/* APPEARANCE TAB */}
                        <TabsContent value="appearance" className="m-0 space-y-6 max-w-2xl focus-visible:outline-none">
                            <div>
                                <h3 className="text-lg font-medium">Appearance</h3>
                                <p className="text-sm text-muted-foreground">Customize how ChromaBase looks on your device.</p>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-base">Theme</Label>
                                <p className="text-sm text-muted-foreground pb-2">Select your preferred color scheme.</p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div
                                        className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/50'}`}
                                        onClick={() => setTheme('light')}
                                    >
                                        <div className="w-full h-24 rounded-md bg-slate-100 border border-slate-200 flex flex-col gap-2 p-2 shadow-sm">
                                            <div className="w-full h-4 bg-white rounded flex gap-1 items-center px-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                            </div>
                                            <div className="flex-1 bg-white rounded" />
                                        </div>
                                        <div className="flex items-center gap-2 font-medium">
                                            <Sun className="w-4 h-4" />
                                            Light
                                        </div>
                                    </div>

                                    <div
                                        className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/50'}`}
                                        onClick={() => setTheme('dark')}
                                    >
                                        <div className="w-full h-24 rounded-md bg-slate-950 border border-slate-800 flex flex-col gap-2 p-2 shadow-sm">
                                            <div className="w-full h-4 bg-slate-900 rounded flex gap-1 items-center px-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                                            </div>
                                            <div className="flex-1 bg-slate-900 rounded" />
                                        </div>
                                        <div className="flex items-center gap-2 font-medium">
                                            <Moon className="w-4 h-4" />
                                            Dark
                                        </div>
                                    </div>

                                    <div
                                        className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/50'}`}
                                        onClick={() => setTheme('system')}
                                    >
                                        <div className="w-full h-24 rounded-md bg-gradient-to-br from-slate-100 to-slate-950 border border-border flex flex-col gap-2 p-2 shadow-sm">
                                            <div className="w-full h-4 bg-background/50 backdrop-blur-sm rounded flex gap-1 items-center px-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                                            </div>
                                            <div className="flex-1 bg-background/50 backdrop-blur-sm rounded" />
                                        </div>
                                        <div className="flex items-center gap-2 font-medium">
                                            <Monitor className="w-4 h-4" />
                                            System
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* NOTIFICATIONS TAB */}
                        <TabsContent value="notifications" className="m-0 space-y-6 max-w-2xl focus-visible:outline-none">
                            <div>
                                <h3 className="text-lg font-medium">Notifications</h3>
                                <p className="text-sm text-muted-foreground">Configure how you receive alerts and updates.</p>
                            </div>

                            <div className="space-y-4">
                                <Card className="border-border/50 shadow-none bg-background/50">
                                    <CardHeader className="py-4">
                                        <CardTitle className="text-base">Email Notifications</CardTitle>
                                        <CardDescription>Receive automated summaries and direct notifications via email.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Lead Updates</Label>
                                                <p className="text-sm text-muted-foreground">When a lead changes stage or is assigned to you.</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Task Reminders</Label>
                                                <p className="text-sm text-muted-foreground">Daily digest of overdue and upcoming tasks.</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Marketing Reports</Label>
                                                <p className="text-sm text-muted-foreground">Weekly analytics summary from active campaigns.</p>
                                            </div>
                                            <Switch />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-border/50 shadow-none bg-background/50">
                                    <CardHeader className="py-4">
                                        <CardTitle className="text-base">In-App Alerts</CardTitle>
                                        <CardDescription>Pop-up notifications while you are actively using the application.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Client Activity</Label>
                                                <p className="text-sm text-muted-foreground">When a client views or accepts a proposal/quote.</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Mention Alerts</Label>
                                                <p className="text-sm text-muted-foreground">When another team member tags you in a note.</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* API & DATA TAB */}
                        <TabsContent value="api" className="m-0 space-y-6 max-w-2xl focus-visible:outline-none">
                            <div>
                                <h3 className="text-lg font-medium">API & Data</h3>
                                <p className="text-sm text-muted-foreground">Manage external connections and testing environments.</p>
                            </div>

                            <Card className="border-primary/20 bg-primary/5">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                            Demo Mode Active
                                        </CardTitle>
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={ROUTES.API_DOCS} className="gap-2">
                                                <Globe className="h-4 w-4" /> API Explorer
                                            </a>
                                        </Button>
                                    </div>
                                    <CardDescription>
                                        The application is currently using localized mock data. To connect to a live Firebase backend, you must provide the necessary credentials.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 bg-background rounded-md border text-sm font-mono overflow-x-auto select-all">
                                        NEXT_PUBLIC_FIREBASE_API_KEY=<br />
                                        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<br />
                                        NEXT_PUBLIC_FIREBASE_PROJECT_ID=<br />
                                        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<br />
                                        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<br />
                                        NEXT_PUBLIC_FIREBASE_APP_ID=
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Place these variables inside your <code>.env.local</code> file at the root of the project and restart the development server.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50">
                                <CardHeader>
                                    <CardTitle>REST API Endpoints</CardTitle>
                                    <CardDescription>Quick reference for the most common CRM endpoints.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {[
                                            { m: 'GET', p: '/api/clients', d: 'List all accounts' },
                                            { m: 'POST', p: '/api/tasks', d: 'Create new task' },
                                            { m: 'GET', p: '/api/stats', d: 'Fetch dashboard stats' },
                                        ].map((e, i) => (
                                            <div key={i} className="flex items-center gap-3 text-xs font-mono p-2 rounded hover:bg-muted transition-colors">
                                                <span className="text-primary font-bold w-10">{e.m}</span>
                                                <span className="flex-1 truncate">{e.p}</span>
                                                <span className="text-muted-foreground">{e.d}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="link" className="px-0 gap-2" asChild>
                                        <a href={ROUTES.API_DOCS}>View all endpoints <ArrowRight className="h-4 w-4" /></a>
                                    </Button>
                                </CardFooter>
                            </Card>

                            <div className="pt-6 border-t border-border/50 mt-8">
                                <h4 className="text-base font-medium text-destructive mb-2">Danger Zone</h4>
                                <p className="text-sm text-muted-foreground mb-4">
                                    These actions are destructive and cannot be undone.
                                </p>
                                <Button variant="destructive">
                                    Reset Local State & Cache
                                </Button>
                            </div>
                        </TabsContent>

                        {/* INTEGRATIONS TAB */}
                        <TabsContent value="integrations" className="m-0 space-y-6 max-w-2xl focus-visible:outline-none">
                            <div>
                                <h3 className="text-lg font-medium">Integrations</h3>
                                <p className="text-sm text-muted-foreground">Connect ChromaBase with external services and automate tasks.</p>
                            </div>

                            <Card className="border-border/50 shadow-none bg-background/50">
                                <CardHeader className="py-4 border-b border-border/50 bg-indigo-50/50 dark:bg-indigo-950/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#5865F2]/10 flex items-center justify-center">
                                            {/* Discord simple icon */}
                                            <svg className="w-5 h-5 text-[#5865F2]" fill="currentColor" viewBox="0 0 127.14 96.36">
                                                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77.7,77.7,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.16,46,96.06,53,91,65.69,84.69,65.69Z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">Discord Webhook Integration</CardTitle>
                                            <CardDescription>Send automated task reminders and deal alerts to a Discord channel.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="discordWebhook">Webhook URL</Label>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <Input
                                                id="discordWebhook"
                                                placeholder="https://discord.com/api/webhooks/..."
                                                type="password"
                                                className="flex-1"
                                                value={discordWebhookUrl}
                                                onChange={(e) => setDiscordWebhookUrl(e.target.value)}
                                            />
                                            <Button
                                                variant="outline"
                                                className="shrink-0"
                                                onClick={handleTestDiscord}
                                                disabled={isTestingDiscord || !discordWebhookUrl}
                                            >
                                                {isTestingDiscord ? 'Testing...' : 'Test Connection'}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Create a webhook in your Discord 'Server Settings -{'>'} Integrations' to generate this URL.
                                        </p>
                                    </div>
                                    <div className="pt-4 border-t border-border/50 space-y-4">
                                        <h4 className="text-sm font-medium">Automation Rules</h4>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>High Priority Task Reminders</Label>
                                                <p className="text-sm text-muted-foreground">Alert 2 hours before deadline.</p>
                                            </div>
                                            <Switch defaultChecked={discordOptions.highPriorityTasks} onCheckedChange={(c) => setDiscordOptions({ ...discordOptions, highPriorityTasks: c })} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Deal Stage Changes</Label>
                                                <p className="text-sm text-muted-foreground">Alert when a deal moves to "Won" or "Lost".</p>
                                            </div>
                                            <Switch defaultChecked={discordOptions.dealStageChanges} onCheckedChange={(c) => setDiscordOptions({ ...discordOptions, dealStageChanges: c })} />
                                        </div>
                                    </div>
                                    <Button className="mt-4 w-full sm:w-auto bg-[#5865F2] hover:bg-[#4752C4]" onClick={handleSaveDiscordOptions}>Save Integration</Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
