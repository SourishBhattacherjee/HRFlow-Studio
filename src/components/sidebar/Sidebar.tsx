import React from 'react';
import { Play, CheckSquare, UserCheck, Zap, Square, Info } from 'lucide-react';
import './Sidebar.css';

const nodeTypes = [
  { type: 'startNode', label: 'Start', icon: Play, description: 'Triggers the workflow' },
  { type: 'taskNode', label: 'Task', icon: CheckSquare, description: 'Human assigned task' },
  { type: 'approvalNode', label: 'Approval', icon: UserCheck, description: 'Wait for sign-off' },
  { type: 'automatedNode', label: 'Automation', icon: Zap, description: 'System automation' },
  { type: 'endNode', label: 'End', icon: Square, description: 'Terminates flow' },
];

export const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Components</h2>
        <p>Drag and drop nodes to build your workflow</p>
      </div>

      <div className="nodes-list">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            className={`dnd-node dnd-${node.type.replace('Node', '').toLowerCase()}`}
            onDragStart={(event) => onDragStart(event, node.type)}
            draggable
          >
            <div className="dnd-node-icon">
              <node.icon size={18} />
            </div>
            <div className="dnd-node-info">
              <span className="dnd-node-label">{node.label}</span>
              <span className="dnd-node-desc">{node.description}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="help-card">
          <Info size={16} />
          <p>Click a node on canvas to configure its properties.</p>
        </div>
      </div>
    </aside>
  );
};
