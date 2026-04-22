import React, { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import type { WorkflowNode, AutomationAction } from '../../types';
import { mockApi } from '../../api/mockApi';
import './Forms.css';

interface NodeFormProps {
  node: WorkflowNode;
  onClose: () => void;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

export const NodeForm: React.FC<NodeFormProps> = ({ node, onClose, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState<any>(node.data);
  const [automations, setAutomations] = useState<AutomationAction[]>([]);

  useEffect(() => {
    setFormData(node.data);
    if (node.type === 'automatedNode') {
      mockApi.getAutomations().then(setAutomations);
    }
  }, [node]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(node.id, formData);
    onClose();
  };

  const renderFields = () => {
    switch (node.type) {
      case 'startNode':
        return (
          <div className="form-group">
            <label>Trigger Source</label>
            <select name="triggerSource" value={formData.triggerSource || ''} onChange={handleChange}>
              <option value="">Select Trigger...</option>
              <option value="new_hire">New Hire Created</option>
              <option value="manual_trigger">Manual Trigger</option>
              <option value="api_call">API Call</option>
            </select>
          </div>
        );
      case 'taskNode':
        return (
          <>
            <div className="form-group">
              <label>Assignee</label>
              <input type="text" name="assignee" value={formData.assignee || ''} onChange={handleChange} placeholder="e.g. HR Manager" />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" name="dueDate" value={formData.dueDate || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority || 'medium'} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </>
        );
      case 'approvalNode':
        return (
          <>
            <div className="form-group">
              <label>Approver Role</label>
              <select name="approverRole" value={formData.approverRole || ''} onChange={handleChange}>
                <option value="">Select Role...</option>
                <option value="manager">Manager</option>
                <option value="hrbp">HRBP</option>
                <option value="director">Director</option>
              </select>
            </div>
            <div className="form-group">
              <label>Auto-approve Threshold (%)</label>
              <input type="number" name="threshold" value={formData.threshold || 0} onChange={handleChange} min="0" max="100" />
            </div>
          </>
        );
      case 'automatedNode':
        return (
          <>
            <div className="form-group">
              <label>Action</label>
              <select name="actionId" value={formData.actionId || ''} onChange={handleChange}>
                <option value="">Select Action...</option>
                {automations.map(a => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
            </div>
            {formData.actionId && (
              <div className="automation-config">
                <h4>Parameters</h4>
                {automations.find(a => a.id === formData.actionId)?.params.map(param => (
                  <div key={param} className="form-group">
                    <label>{param.charAt(0).toUpperCase() + param.slice(1)}</label>
                    <input 
                      type="text" 
                      onChange={(e) => {
                        setFormData((prev: any) => ({
                          ...prev,
                          config: { ...(prev.config || {}), [param]: e.target.value }
                        }))
                      }}
                      value={formData.config?.[param] || ''}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        );
      case 'endNode':
        return (
          <>
            <div className="form-group">
              <label>Final Message</label>
              <input type="text" name="outcome" value={formData.outcome || ''} onChange={handleChange} placeholder="e.g. Onboarding Complete" />
            </div>
            <div className="form-group checkbox-group">
              <input 
                type="checkbox" 
                id="isSummaryVisible"
                name="isSummaryVisible" 
                checked={formData.isSummaryVisible || false} 
                onChange={(e) => setFormData((prev: any) => ({ ...prev, isSummaryVisible: e.target.checked }))} 
              />
              <label htmlFor="isSummaryVisible">Show Summary Result</label>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="node-config-panel">
      <div className="panel-header">
        <div className="header-info">
          <h3>Configure {node.data.label || 'Node'}</h3>
          <span>ID: {node.id.slice(0, 8)}</span>
        </div>
        <button onClick={onClose} className="btn-icon">
          <X size={20} />
        </button>
      </div>

      <div className="panel-body">
        <div className="form-group">
          <label>Title</label>
          <input type="text" name="label" value={formData.label || ''} onChange={handleChange} />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea 
            name="description" 
            value={formData.description || ''} 
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="divider" />
        
        {renderFields()}
      </div>

      <div className="panel-footer">
        <button onClick={() => onDelete(node.id)} className="btn-danger">
          <Trash2 size={16} />
          Delete
        </button>
        <div className="footer-right">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn-primary">
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
