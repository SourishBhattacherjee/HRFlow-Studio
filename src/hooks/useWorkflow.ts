import { useCallback, useState } from 'react';
import { 
  addEdge, 
  applyEdgeChanges, 
  applyNodeChanges, 
  type Connection, 
  type Edge, 
  type OnConnect, 
  type OnEdgesChange, 
  type OnNodesChange 
} from 'reactflow';
import { nanoid } from 'nanoid';
import type { WorkflowNode, NodeType } from '../types';

const initialNodes: WorkflowNode[] = [
  {
    id: 'start-1',
    type: 'startNode',
    data: { label: 'Start Flow', type: 'startNode', triggerSource: 'manual_trigger' },
    position: { x: 250, y: 50 },
  },
];

export const useWorkflow = () => {
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds) as WorkflowNode[]),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onAddNode = useCallback((type: NodeType, position: { x: number, y: number }) => {
    const newNode: WorkflowNode = {
      id: nanoid(),
      type,
      position,
      data: { 
        label: `${type.charAt(0).toUpperCase()}${type.slice(1)}`,
        type,
        ...(type === 'taskNode' ? { priority: 'medium' } : {}),
        ...(type === 'approvalNode' ? { timeoutHours: 24 } : {}),
      } as any,
    };
    setNodes((nds) => nds.concat(newNode));
  }, []);

  const onUpdateNode = useCallback((id: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      })
    );
  }, []);

  const onDeleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    setSelectedNodeId(null);
  }, []);

  return {
    nodes,
    edges,
    selectedNodeId,
    setSelectedNodeId,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onAddNode,
    onUpdateNode,
    onDeleteNode,
    setNodes,
    setEdges,
    onExport: () => {
      const flow = { nodes, edges };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flow));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "hr-workflow.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    },
    onImport: (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileReader = new FileReader();
      const file = e.target.files?.[0];
      if (!file) return;

      fileReader.onload = (event) => {
        const result = event.target?.result as string;
        try {
          const flow = JSON.parse(result);
          if (flow.nodes && flow.edges) {
            setNodes(flow.nodes);
            setEdges(flow.edges);
          }
        } catch (err) {
          alert("Invalid JSON file");
        }
      };
      fileReader.readAsText(file);
    },
    getInvalidNodes: () => {
      const invalidIds: string[] = [];
      nodes.forEach(node => {
        const hasIncoming = edges.some(e => e.target === node.id);
        const hasOutgoing = edges.some(e => e.source === node.id);
        
        if (node.type === 'startNode' && !hasOutgoing) invalidIds.push(node.id);
        else if (node.type === 'endNode' && !hasIncoming) invalidIds.push(node.id);
        else if (node.type !== 'startNode' && node.type !== 'endNode' && (!hasIncoming || !hasOutgoing)) {
          invalidIds.push(node.id);
        }
      });
      return invalidIds;
    }
  };
};

