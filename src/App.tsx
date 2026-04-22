import { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Sidebar } from './components/sidebar/Sidebar';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { NodeForm } from './components/forms/NodeForm';
import { SimulationPanel } from './components/sandbox/SimulationPanel';
import { EmployeeList } from './components/employees/EmployeeList';
import { SettingsView } from './components/settings/SettingsView';
import { useWorkflow } from './hooks/useWorkflow';
import { User, Settings, Database, Share2, Briefcase } from 'lucide-react';
import './App.css';

type ViewType = 'workflows' | 'employees' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('workflows');
  const {
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
    onExport,
    onImport,
    getInvalidNodes,
  } = useWorkflow();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const invalidNodeIds = getInvalidNodes();

  const renderContent = () => {
    switch (currentView) {
      case 'employees':
        return <EmployeeList />;
      case 'settings':
        return <SettingsView />;
      case 'workflows':
      default:
        return (
          <>
            <Sidebar />
            <div className="editor-area">
              <ReactFlowProvider>
                <WorkflowCanvas 
                  nodes={nodes.map(n => ({
                    ...n,
                    data: { ...n.data, isInvalid: invalidNodeIds.includes(n.id) }
                  }))}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onAddNode={onAddNode}
                  onNodeClick={(_, node) => setSelectedNodeId(node.id)}
                />
              </ReactFlowProvider>
              
              <SimulationPanel nodes={nodes} edges={edges} />
            </div>

            {selectedNode && (
              <NodeForm 
                node={selectedNode}
                onClose={() => setSelectedNodeId(null)}
                onUpdate={onUpdateNode}
                onDelete={onDeleteNode}
              />
            )}
          </>
        );
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo" onClick={() => setCurrentView('workflows')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <Briefcase size={20} />
          </div>
          <h1>HRFlow Studio</h1>
        </div>
        
        <nav className="header-nav">
          <button 
            className={`nav-item ${currentView === 'workflows' ? 'active' : ''}`}
            onClick={() => setCurrentView('workflows')}
          >
            <Database size={16} /> Workflows
          </button>
          <button 
            className={`nav-item ${currentView === 'employees' ? 'active' : ''}`}
            onClick={() => setCurrentView('employees')}
          >
            <User size={16} /> Employees
          </button>
          <button 
            className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentView('settings')}
          >
            <Settings size={16} /> Settings
          </button>
        </nav>

        <div className="header-actions">
          {currentView === 'workflows' && (
            <>
              <button className="btn-secondary" onClick={onExport}>
                <Share2 size={16} /> Export
              </button>
              <label className="btn-secondary" style={{ cursor: 'pointer' }}>
                <Database size={16} /> Import
                <input type="file" accept=".json" onChange={onImport} style={{ display: 'none' }} />
              </label>
            </>
          )}
          <div className="user-profile">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
          </div>
        </div>
      </header>

      <main className="app-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
