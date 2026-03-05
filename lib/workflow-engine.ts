import { CRMTask, Client, Workflow, WorkflowTrigger, WorkflowAction } from '@/types';

// Supported event types that can trigger workflows
export type WorkflowEventType =
    | 'TASK_COMPLETED'
    | 'TASK_OVERDUE'
    | 'TASK_STATUS_CHANGED'
    | 'CLIENT_CREATED';

export interface WorkflowEvent {
    type: WorkflowEventType;
    payload: {
        task?: CRMTask;
        client?: Client;
        [key: string]: any;
    };
}

export interface WorkflowResult {
    triggered: boolean;
    actionTaken?: WorkflowAction;
    message?: string;
    error?: string;
}

/**
 * Core workflow engine evaluator.
 * It takes an event, a list of active workflows, and evaluates which ones should trigger.
 */
export function evaluateWorkflows(event: WorkflowEvent, activeWorkflows: Workflow[]): WorkflowResult[] {
    return activeWorkflows
        .filter(wf => wf.isActive)
        .map(wf => {
            try {
                const isMatch = evaluateTrigger(event, wf.trigger);
                if (isMatch) {
                    return {
                        triggered: true,
                        actionTaken: wf.action,
                        message: `Workflow "${wf.name}" triggered.`
                    };
                }
                return { triggered: false };
            } catch (err: any) {
                return {
                    triggered: false,
                    error: `Error evaluating workflow "${wf.name}": ${err.message}`
                }
            }
        });
}

/**
 * Checks if a specific trigger condition matches the incoming event.
 */
function evaluateTrigger(event: WorkflowEvent, trigger: WorkflowTrigger): boolean {
    switch (trigger.type) {
        case 'task_completed':
            if (event.type !== 'TASK_COMPLETED' || !event.payload.task) return false;
            if (trigger.conditions?.taskType && event.payload.task.type !== trigger.conditions.taskType) return false;
            return true;

        case 'task_overdue':
            if (event.type !== 'TASK_OVERDUE' || !event.payload.task) return false;
            if (trigger.conditions?.accountTier && event.payload.client?.tier !== trigger.conditions.accountTier) return false;
            return true;

        case 'client_created':
            if (event.type !== 'CLIENT_CREATED' || !event.payload.client) return false;
            if (trigger.conditions?.status && event.payload.client.status !== trigger.conditions.status) return false;
            return true;

        case 'task_status_changed':
            if (event.type !== 'TASK_STATUS_CHANGED' || !event.payload.task) return false;
            if (trigger.conditions?.priority && event.payload.task.priority !== trigger.conditions.priority) return false;
            if (trigger.conditions?.accountTier && event.payload.client?.tier !== trigger.conditions.accountTier) return false;
            return true;

        default:
            return false;
    }
}
