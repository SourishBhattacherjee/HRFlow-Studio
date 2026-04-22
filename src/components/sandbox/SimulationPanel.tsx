import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import type { SimulationResult, WorkflowNode, WorkflowEdge } from '../../types';
import { mockApi } from '../../api/mockApi';
import './SimulationPanel.css';

interface SimulationPanelProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({ nodes, edges }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const resultsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resultsEndRef.current) {
      resultsEndRef.current.scrollTop = resultsEndRef.current.scrollHeight;
    }
  }, [results]);

  const runSimulation = async () => {
    setIsRunning(true);
    setResults([]);
    setError(null);

    try {
      const data = await mockApi.simulateWorkflow({ nodes, edges });
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="simulation-overlay">
      <div className="simulation-panel">
        <div className="simulation-header">
          <div className="title-area">
            <h3>Workflow Sandbox</h3>
            <p>Validate and simulate your HR process</p>
          </div>
          <div className="header-actions">
            <button 
              onClick={runSimulation} 
              disabled={isRunning}
              className={`btn-simulate ${isRunning ? 'loading' : ''}`}
            >
              {isRunning ? <Clock className="spin" size={18} /> : <Play size={18} />}
              {isRunning ? 'Running...' : 'Run Simulation'}
            </button>
            <button onClick={() => setResults([])} className="btn-icon">
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {error && (
          <div className="simulation-error">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        <div className="simulation-results" ref={resultsEndRef}>
          {results.length === 0 && !isRunning && !error && (
            <div className="empty-state">
              <div className="empty-icon">🧪</div>
              <p>Ready to test? Click 'Run Simulation' to see how your workflow executes.</p>
            </div>
          )}

          {results.map((res, index) => (
            <div key={index} className="result-item" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="result-status">
                {res.status === 'completed' ? (
                  <CheckCircle2 size={18} className="text-success" />
                ) : (
                  <AlertTriangle size={18} className="text-error" />
                )}
              </div>
              <div className="result-content">
                <div className="result-top">
                  <span className="step-badge">Step {res.step}</span>
                  <span className="node-name">{res.nodeLabel}</span>
                  <span className="timestamp">{new Date(res.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="result-msg">{res.message}</p>
              </div>
            </div>
          ))}

          {isRunning && (
            <div className="simulation-loading">
              <div className="loading-bar"></div>
              <p>Processing workflow steps...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
