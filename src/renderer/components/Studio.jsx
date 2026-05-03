import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DiagramEditor from './DiagramEditor';
import WelcomeScreen from './WelcomeScreen';
import { useApp } from '../App';

export default function Studio() {
  const { state } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentProject = state.projects.find(p => p.id === state.currentProjectId);
  const currentDiagram = currentProject?.diagrams.find(d => d.id === state.currentDiagramId);

  return (
    <div className="studio">
      <div className={`studio-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <Sidebar />
      </div>
      <div className="studio-main">
        <div className="studio-topbar">
          <button className="topbar-btn icon-btn" onClick={() => setSidebarOpen(o => !o)} title="Toggle sidebar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="topbar-breadcrumb">
            {currentProject && <span className="breadcrumb-project">{currentProject.name}</span>}
            {currentProject && currentDiagram && <span className="breadcrumb-sep">›</span>}
            {currentDiagram && <span className="breadcrumb-diagram">{currentDiagram.name}</span>}
          </div>
        </div>
        <div className="studio-content">
          {currentDiagram
            ? <DiagramEditor key={currentDiagram.id} diagram={currentDiagram} />
            : <WelcomeScreen />}
        </div>
      </div>
    </div>
  );
}
