import type { AutomationAction, SimulationResult, WorkflowNode, WorkflowEdge } from '../types';

const MOCK_AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'slack_notification', label: 'Slack Notification', params: ['channel', 'message'] },
  { id: 'create_jira_ticket', label: 'Create Jira Ticket', params: ['project', 'summary', 'description'] },
  { id: 'update_crm', label: 'Update CRM Record', params: ['recordId', 'status'] },
];

export const mockApi = {
  getAutomations: async (): Promise<AutomationAction[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_AUTOMATIONS);
      }, 500);
    });
  },

  simulateWorkflow: async (workflow: { nodes: WorkflowNode[]; edges: WorkflowEdge[] }): Promise<SimulationResult[]> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { nodes, edges } = workflow;
        
        // Basic validation
        const hasStart = nodes.some(n => n.type === 'startNode');
        const hasEnd = nodes.some(n => n.type === 'endNode');
        
        if (!hasStart) {
          reject(new Error('Workflow must have a Start Node'));
          return;
        }
        if (!hasEnd) {
          reject(new Error('Workflow must have an End Node'));
          return;
        }

        const results: SimulationResult[] = [];
        let currentNode = nodes.find(n => n.type === 'startNode');
        let stepCount = 0;
        const visitedNodes = new Set<string>();

        while (currentNode && stepCount < 50) {
          if (visitedNodes.has(currentNode.id)) {
            results.push({
              step: stepCount + 1,
              nodeId: 'loop',
              nodeLabel: 'Infinite Loop Detected',
              status: 'failed',
              message: 'Simulation aborted: Circular dependency found.',
              timestamp: new Date().toISOString(),
            });
            break;
          }
          
          visitedNodes.add(currentNode.id);
          stepCount++;
          
          results.push({
            step: stepCount,
            nodeId: currentNode.id,
            nodeLabel: currentNode.data.label || 'Unnamed Node',
            status: 'completed',
            message: `Executed node: ${currentNode.data.label} (${currentNode.type})`,
            timestamp: new Date().toISOString(),
          });

          if (currentNode.type === 'endNode') break;

          const outgoingEdges = edges.filter(e => e.source === currentNode?.id);
          if (outgoingEdges.length === 0) {
            results.push({
              step: stepCount + 1,
              nodeId: 'error',
              nodeLabel: 'Broken Flow',
              status: 'failed',
              message: 'Flow stopped: No outgoing connection found.',
              timestamp: new Date().toISOString(),
            });
            break;
          }

          // Pick the first available edge (could be improved for branching later)
          const nextEdge = outgoingEdges[0];
          const nextNode = nodes.find(n => n.id === nextEdge.target);
          
          if (!nextNode) {
            results.push({
              step: stepCount + 1,
              nodeId: 'error',
              nodeLabel: 'Missing Target',
              status: 'failed',
              message: 'Flow stopped: Target node does not exist.',
              timestamp: new Date().toISOString(),
            });
            break;
          }
          
          currentNode = nextNode;
        }

        if (stepCount >= 50 && currentNode?.type !== 'endNode') {
          results.push({
            step: stepCount + 1,
            nodeId: 'timeout',
            nodeLabel: 'Simulation Timeout',
            status: 'failed',
            message: 'Workflow exceeded 50 steps. Possible logical error.',
            timestamp: new Date().toISOString(),
          });
        }

        resolve(results);
      }, 1500);
    });
  },
};
