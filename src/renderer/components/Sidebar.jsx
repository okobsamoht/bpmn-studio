import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../App';

function InlineEdit({ value, onSave, onCancel }) {
  const [val, setVal] = useState(value);
  const ref = useRef(null);
  useEffect(() => { ref.current?.select(); }, []);
  const commit = () => { if (val.trim()) onSave(val.trim()); else onCancel(); };
  return (
    <input
      ref={ref}
      className="inline-edit"
      value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') onCancel(); }}
    />
  );
}

function ContextMenu({ x, y, items, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const handle = (e) => { if (!ref.current?.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose]);
  return (
    <div ref={ref} className="context-menu" style={{ top: y, left: x }}>
      {items.map((item, i) =>
        item.separator
          ? <div key={i} className="context-menu-sep"/>
          : <button key={i} className={`context-menu-item ${item.danger ? 'danger' : ''}`} onClick={() => { item.action(); onClose(); }}>
              {item.icon && <span className="ctx-icon">{item.icon}</span>}
              {item.label}
            </button>
      )}
    </div>
  );
}

export default function Sidebar() {
  const { state, actions } = useApp();
  const [expandedProjects, setExpandedProjects] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [newProjectModal, setNewProjectModal] = useState(false);
  const [newDiagramModal, setNewDiagramModal] = useState(null);
  const [newName, setNewName] = useState('');
  const newInputRef = useRef(null);

  useEffect(() => {
    if (newProjectModal || newDiagramModal) {
      setTimeout(() => newInputRef.current?.focus(), 50);
    }
  }, [newProjectModal, newDiagramModal]);

  const toggleProject = (id) => setExpandedProjects(s => ({ ...s, [id]: !s[id] }));

  const handleProjectContext = (e, project) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX, y: e.clientY,
      items: [
        { label: 'New Diagram', icon: '📄', action: () => setNewDiagramModal(project.id) },
        { separator: true },
        { label: 'Rename', icon: '✏️', action: () => setEditingId(project.id) },
        { label: 'Delete Project', icon: '🗑️', danger: true, action: () => {
          if (confirm(`Delete project "${project.name}" and all its diagrams?`)) actions.deleteProject(project.id);
        }}
      ]
    });
  };

  const handleDiagramContext = (e, project, diagram) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX, y: e.clientY,
      items: [
        { label: 'Rename', icon: '✏️', action: () => setEditingId(diagram.id) },
        { label: 'Delete Diagram', icon: '🗑️', danger: true, action: () => {
          if (confirm(`Delete diagram "${diagram.name}"?`)) actions.deleteDiagram(project.id, diagram.id);
        }}
      ]
    });
  };

  const submitNewProject = () => {
    if (newName.trim()) {
      actions.createProject(newName.trim());
      setExpandedProjects(s => ({ ...s, [state.projects.length]: true }));
    }
    setNewProjectModal(false);
    setNewName('');
  };

  const submitNewDiagram = () => {
    if (newName.trim() && newDiagramModal) {
      actions.createDiagram(newDiagramModal, newName.trim());
      setExpandedProjects(s => ({ ...s, [newDiagramModal]: true }));
    }
    setNewDiagramModal(null);
    setNewName('');
  };

  const modalKeyDown = (e, submit) => {
    if (e.key === 'Enter') submit();
    if (e.key === 'Escape') { setNewProjectModal(false); setNewDiagramModal(null); setNewName(''); }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="10" fill="#4f46e5"/>
            <path d="M12 24h8M28 24h8M20 16v16M28 16v16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="24" cy="24" r="4" fill="white"/>
          </svg>
          <span>BPMN Studio</span>
        </div>
      </div>

      <div className="sidebar-section-header">
        <span>Projects</span>
        <button className="icon-btn small" onClick={() => setNewProjectModal(true)} title="New project">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>

      <div className="sidebar-tree">
        {state.projects.length === 0 && (
          <div className="sidebar-empty">
            <span>No projects yet</span>
            <button className="btn btn-sm btn-ghost" onClick={() => setNewProjectModal(true)}>Create your first project</button>
          </div>
        )}
        {state.projects.map(project => {
          const expanded = expandedProjects[project.id] !== false;
          return (
            <div key={project.id} className="tree-project">
              <div
                className={`tree-project-row ${state.currentProjectId === project.id ? 'active' : ''}`}
                onClick={() => { toggleProject(project.id); actions.setCurrent(project.id, state.currentDiagramId); }}
                onContextMenu={e => handleProjectContext(e, project)}
              >
                <span className="tree-arrow">{expanded ? '▾' : '▸'}</span>
                <span className="tree-icon">📁</span>
                {editingId === project.id
                  ? <InlineEdit value={project.name} onSave={n => { actions.renameProject(project.id, n); setEditingId(null); }} onCancel={() => setEditingId(null)}/>
                  : <span className="tree-label">{project.name}</span>}
                <span className="tree-count">{project.diagrams.length}</span>
                <button className="icon-btn tiny tree-add" onClick={e => { e.stopPropagation(); setNewDiagramModal(project.id); }} title="Add diagram">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>

              {expanded && (
                <div className="tree-diagrams">
                  {project.diagrams.length === 0 && (
                    <div className="tree-diagram-empty">No diagrams — <span className="link" onClick={() => setNewDiagramModal(project.id)}>add one</span></div>
                  )}
                  {project.diagrams.map(diagram => (
                    <div
                      key={diagram.id}
                      className={`tree-diagram-row ${state.currentDiagramId === diagram.id ? 'active' : ''}`}
                      onClick={() => actions.setCurrent(project.id, diagram.id)}
                      onContextMenu={e => handleDiagramContext(e, project, diagram)}
                    >
                      <span className="tree-icon small">📄</span>
                      {editingId === diagram.id
                        ? <InlineEdit value={diagram.name} onSave={n => { actions.renameDiagram(diagram.id, n); setEditingId(null); }} onCancel={() => setEditingId(null)}/>
                        : <span className="tree-label">{diagram.name}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x} y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}

      {(newProjectModal || newDiagramModal) && (
        <div className="modal-overlay" onClick={() => { setNewProjectModal(false); setNewDiagramModal(null); setNewName(''); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{newProjectModal ? 'New Project' : 'New Diagram'}</h3>
            <input
              ref={newInputRef}
              className="modal-input"
              placeholder={newProjectModal ? 'Project name…' : 'Diagram name…'}
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => modalKeyDown(e, newProjectModal ? submitNewProject : submitNewDiagram)}
            />
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => { setNewProjectModal(false); setNewDiagramModal(null); setNewName(''); }}>Cancel</button>
              <button className="btn btn-primary" onClick={newProjectModal ? submitNewProject : submitNewDiagram}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
