import { Workflow } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

interface WorkflowCardProps {
    workflow: Workflow;
    onToggle: (id: string, isActive: boolean) => void;
}

export function WorkflowCard({ workflow, onToggle }: WorkflowCardProps) {
    return (
        <Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        {workflow.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                        {workflow.description}
                    </CardDescription>
                </div>
                <Switch
                    checked={workflow.isActive}
                    onCheckedChange={(checked) => onToggle(workflow.id, checked)}
                />
            </CardHeader>
            <CardContent className="pt-2">
                <div className="flex flex-col gap-2 text-xs">
                    <div className="bg-muted/30 p-2 rounded-md border border-border/30">
                        <span className="font-semibold text-muted-foreground mr-2">WHEN</span>
                        <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-tighter bg-background">
                            {workflow.trigger.type.replace(/_/g, ' ')}
                        </Badge>
                    </div>
                    <div className="bg-muted/30 p-2 rounded-md border border-border/30">
                        <span className="font-semibold text-muted-foreground mr-2">THEN</span>
                        <Badge variant="secondary" className="text-[10px] uppercase font-mono tracking-tighter">
                            {workflow.action.type.replace(/_/g, ' ')}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
