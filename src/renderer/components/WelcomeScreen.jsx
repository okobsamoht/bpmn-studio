import React, { useState } from 'react';
import { useApp } from '../App';

export default function WelcomeScreen() {
  const { state, actions } = useApp();
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewDiagram, setShowNewDiagram] = useState(false);
  const [name, setName] = useState('');

  const hasProjects = state.projects.length > 0;

  const submitProject = () => {
    if (name.trim()) { actions.createProject(name.trim()); setName(''); setShowNewProject(false); }
  };
  const submitDiagram = () => {
    if (name.trim() && state.currentProjectId) { actions.createDiagram(state.currentProjectId, name.trim()); setName(''); setShowNewDiagram(false); }
  };

  return (
    <div className="welcome">
      <div className="welcome-inner">
        <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="14" fill="#ede9fe"/>
          <path d="M12 24h8M28 24h8M20 16v16M28 16v16" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="24" cy="24" r="4" fill="#4f46e5"/>
        </svg>
        <h2>Welcome to BPMN Studio</h2>
        <p>{hasProjects ? 'Select a diagram from the sidebar, or create a new one.' : 'Get started by creating your first project.'}</p>

        <div className="welcome-actions">
          {!hasProjects && (
            <button className="btn btn-primary" onClick={() => setShowNewProject(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Project
            </button>
          )}
          {hasProjects && state.currentProjectId && (
            <button className="btn btn-primary" onClick={() => setShowNewDiagram(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Diagram
            </button>
          )}
          {hasProjects && !state.currentProjectId && (
            <p className="welcome-hint">Select a project in the sidebar to get started.</p>
          )}
        </div>

        <div className="welcome-tips">
          <div className="tip"><span className="tip-key">Right-click</span> projects and diagrams for options</div>
          <div className="tip"><span className="tip-key">Drag</span> elements on the canvas to rearrange</div>
          <div className="tip"><span className="tip-key">Simulate</span> token flow with the ▶ button in the toolbar</div>
        </div>
      </div>

      {(showNewProject || showNewDiagram) && (
        <div className="modal-overlay" onClick={() => { setShowNewProject(false); setShowNewDiagram(false); setName(''); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{showNewProject ? 'New Project' : 'New Diagram'}</h3>
            <input
              autoFocus
              className="modal-input"
              placeholder={showNewProject ? 'Project name…' : 'Diagram name…'}
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') showNewProject ? submitProject() : submitDiagram(); if (e.key === 'Escape') { setShowNewProject(false); setShowNewDiagram(false); setName(''); } }}
            />
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => { setShowNewProject(false); setShowNewDiagram(false); setName(''); }}>Cancel</button>
              <button className="btn btn-primary" onClick={showNewProject ? submitProject : submitDiagram}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
