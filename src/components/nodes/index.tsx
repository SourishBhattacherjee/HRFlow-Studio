import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Play, CheckSquare, UserCheck, Zap, Square, AlertCircle } from 'lucide-react';
import './Nodes.css';

const BaseNode = ({ 
  label, 
  description, 
  icon: Icon, 
  className = '', 
  selected,
  isInvalid,
  showTarget = true,
  showSource = true 
}: any) => {
  return (
    <div className={`custom-node ${className} ${selected ? 'selected' : ''} ${isInvalid ? 'invalid' : ''}`}>
      {showTarget && <Handle type="target" position={Position.Top} />}
      
      <div className="node-header">
        <div className="node-icon">
          <Icon size={16} />
        </div>
        <span>{label}</span>
        {isInvalid && <div className="invalid-icon"><AlertCircle size={14} /></div>}
      </div>
      
      {description && <div className="node-content">{description}</div>}
      
      {showSource && <Handle type="source" position={Position.Bottom} />}
    </div>
  );
};

export const StartNode = memo(({ data, selected }: any) => (
  <BaseNode 
    label={data.label || 'Start'} 
    description={data.triggerSource || 'Initial Trigger'} 
    icon={Play} 
    className="node-start"
    selected={selected}
    isInvalid={data.isInvalid}
    showTarget={false}
  />
));

export const TaskNode = memo(({ data, selected }: any) => (
  <BaseNode 
    label={data.label || 'Task'} 
    description={data.assignee ? `Assigned to: ${data.assignee}` : 'Pending assignment'} 
    icon={CheckSquare} 
    className="node-task"
    selected={selected}
    isInvalid={data.isInvalid}
  />
));

export const ApprovalNode = memo(({ data, selected }: any) => (
  <BaseNode 
    label={data.label || 'Approval'} 
    description={data.approverRole ? `Approver: ${data.approverRole}` : 'No role set'} 
    icon={UserCheck} 
    className="node-approval"
    selected={selected}
    isInvalid={data.isInvalid}
  />
));

export const AutomatedNode = memo(({ data, selected }: any) => (
  <BaseNode 
    label={data.label || 'Automation'} 
    description={data.actionId ? `Action: ${data.actionId}` : 'Select action...'} 
    icon={Zap} 
    className="node-automated"
    selected={selected}
    isInvalid={data.isInvalid}
  />
));

export const EndNode = memo(({ data, selected }: any) => (
  <BaseNode 
    label={data.label || 'End'} 
    description={data.outcome || 'Success'} 
    icon={Square} 
    className="node-end"
    selected={selected}
    isInvalid={data.isInvalid}
    showSource={false}
  />
));
