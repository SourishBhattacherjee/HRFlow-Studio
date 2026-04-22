import { useCallback, useRef, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  Panel,
  type ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  StartNode, 
  TaskNode, 
  ApprovalNode, 
  AutomatedNode, 
  EndNode 
} from '../nodes';
import type { WorkflowNode, WorkflowEdge, NodeType } from '../../types';
import './WorkflowCanvas.css';

const nodeTypes = {
  startNode: StartNode,
  taskNode: TaskNode,
  approvalNode: ApprovalNode,
  automatedNode: AutomatedNode,
  endNode: EndNode,
};

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  onAddNode: (type: NodeType, position: { x: number, y: number }) => void;
  onNodeClick: (event: React.MouseEvent, node: WorkflowNode) => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onAddNode,
  onNodeClick,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      onAddNode(type, position);
    },
    [reactFlowInstance, onAddNode]
  );

  return (
    <div className="canvas-wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#334155" gap={20} />
        <Controls className="custom-controls" />
        <MiniMap 
          nodeColor={(n) => {
            if (n.type === 'startNode') return '#22c55e';
            if (n.type === 'taskNode') return '#3b82f6';
            if (n.type === 'approvalNode') return '#eab308';
            if (n.type === 'automatedNode') return '#a855f7';
            if (n.type === 'endNode') return '#ef4444';
            return '#334155';
          }}
          maskColor="rgba(15, 23, 42, 0.7)"
          className="custom-minimap"
        />
        
        <Panel position="top-left" className="canvas-panel">
          <div className="canvas-badge">HR Workflow Editor</div>
        </Panel>
      </ReactFlow>
    </div>
  );
};
