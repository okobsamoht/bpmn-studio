import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import LandingPage from './components/LandingPage';
import Studio from './components/Studio';

export const AppContext = createContext(null);

const EMPTY_XML = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  targetNamespace="http://bpmn.io/schema/bpmn"
  id="Definitions_1">
  <process id="Process_1" isExecutable="false">
    <startEvent id="StartEvent_1" name="Start">
      <outgoing>Flow_1</outgoing>
    </startEvent>
    <endEvent id="EndEvent_1" name="End">
      <incoming>Flow_1</incoming>
    </endEvent>
    <sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="EndEvent_1"/>
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="232" width="36" height="36"/>
        <bpmndi:BPMNLabel><dc:Bounds x="155" y="275" width="30" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="432" y="232" width="36" height="36"/>
        <bpmndi:BPMNLabel><dc:Bounds x="437" y="275" width="26" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint xmlns:di="http://www.omg.org/spec/DD/20100524/DI" x="188" y="250"/>
        <di:waypoint xmlns:di="http://www.omg.org/spec/DD/20100524/DI" x="432" y="250"/>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`;

const initialState = {
  view: 'studio',
  projects: [],
  currentProjectId: null,
  currentDiagramId: null,
  isLoading: true
};

function reducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, projects: action.projects, isLoading: false };

    case 'SET_VIEW':
      return { ...state, view: action.view };

    case 'CREATE_PROJECT': {
      const project = { id: uuidv4(), name: action.name, createdAt: Date.now(), diagrams: [] };
      return { ...state, projects: [...state.projects, project], currentProjectId: project.id, currentDiagramId: null };
    }

    case 'DELETE_PROJECT': {
      const projects = state.projects.filter(p => p.id !== action.id);
      const currentProjectId = state.currentProjectId === action.id
        ? (projects[0]?.id || null)
        : state.currentProjectId;
      const currentProject = projects.find(p => p.id === currentProjectId);
      return { ...state, projects, currentProjectId, currentDiagramId: currentProject?.diagrams[0]?.id || null };
    }

    case 'RENAME_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.id ? { ...p, name: action.name } : p)
      };

    case 'CREATE_DIAGRAM': {
      const diagram = { id: uuidv4(), name: action.name, xml: EMPTY_XML, createdAt: Date.now(), updatedAt: Date.now() };
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.projectId ? { ...p, diagrams: [...p.diagrams, diagram] } : p
        ),
        currentDiagramId: diagram.id,
        currentProjectId: action.projectId
      };
    }

    case 'DELETE_DIAGRAM': {
      const projects = state.projects.map(p =>
        p.id === action.projectId ? { ...p, diagrams: p.diagrams.filter(d => d.id !== action.id) } : p
      );
      const project = projects.find(p => p.id === action.projectId);
      const currentDiagramId = state.currentDiagramId === action.id
        ? (project?.diagrams[0]?.id || null)
        : state.currentDiagramId;
      return { ...state, projects, currentDiagramId };
    }

    case 'RENAME_DIAGRAM':
      return {
        ...state,
        projects: state.projects.map(p => ({
          ...p,
          diagrams: p.diagrams.map(d => d.id === action.id ? { ...d, name: action.name } : d)
        }))
      };

    case 'UPDATE_XML':
      return {
        ...state,
        projects: state.projects.map(p => ({
          ...p,
          diagrams: p.diagrams.map(d =>
            d.id === action.id ? { ...d, xml: action.xml, updatedAt: Date.now() } : d
          )
        }))
      };

    case 'SET_CURRENT':
      return { ...state, currentProjectId: action.projectId, currentDiagramId: action.diagramId };

    default:
      return state;
  }
}

export function useApp() {
  return useContext(AppContext);
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    window.electronAPI.loadProjects().then(projects => {
      dispatch({ type: 'INIT', projects: projects || [] });
    });
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      window.electronAPI.saveProjects(state.projects);
    }
  }, [state.projects, state.isLoading]);

  const actions = {
    goToStudio: () => dispatch({ type: 'SET_VIEW', view: 'studio' }),
    goToLanding: () => dispatch({ type: 'SET_VIEW', view: 'landing' }),
    createProject: (name) => dispatch({ type: 'CREATE_PROJECT', name }),
    deleteProject: (id) => dispatch({ type: 'DELETE_PROJECT', id }),
    renameProject: (id, name) => dispatch({ type: 'RENAME_PROJECT', id, name }),
    createDiagram: (projectId, name) => dispatch({ type: 'CREATE_DIAGRAM', projectId, name }),
    deleteDiagram: (projectId, id) => dispatch({ type: 'DELETE_DIAGRAM', projectId, id }),
    renameDiagram: (id, name) => dispatch({ type: 'RENAME_DIAGRAM', id, name }),
    updateXml: (id, xml) => dispatch({ type: 'UPDATE_XML', id, xml }),
    setCurrent: (projectId, diagramId) => dispatch({ type: 'SET_CURRENT', projectId, diagramId })
  };

  if (state.isLoading) {
    return (
      <div className="splash">
        <div className="splash-logo">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="#4f46e5"/>
            <path d="M12 24h8M28 24h8M20 16v16M28 16v16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="24" cy="24" r="4" fill="white"/>
          </svg>
          <span>BPMN Studio</span>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ state, actions }}>
      {state.view === 'landing' ? <LandingPage /> : <Studio />}
    </AppContext.Provider>
  );
}
