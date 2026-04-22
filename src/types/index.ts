import type { Node, Edge } from 'reactflow';

export type NodeType = 'startNode' | 'taskNode' | 'approvalNode' | 'automatedNode' | 'endNode';

export interface BaseNodeData {
  label: string;
  description?: string;
  type: NodeType;
}

export interface StartNodeData extends BaseNodeData {
  triggerSource: string;
  metadata: Record<string, string>;
}

export interface TaskNodeData extends BaseNodeData {
  assignee: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ApprovalNodeData extends BaseNodeData {
  approverRole: string;
  threshold: number;
}

export interface AutomatedNodeData extends BaseNodeData {
  actionId: string;
  config: Record<string, any>;
}

export interface EndNodeData extends BaseNodeData {
  outcome: string;
  isSummaryVisible: boolean;
}

export type WorkflowNode = Node<BaseNodeData | StartNodeData | TaskNodeData | ApprovalNodeData | AutomatedNodeData | EndNodeData>;
export type WorkflowEdge = Edge;

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationResult {
  step: number;
  nodeId: string;
  nodeLabel: string;
  status: 'completed' | 'pending' | 'failed';
  message: string;
  timestamp: string;
}

export interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
}
