import React, { useEffect, useRef, useState, useCallback } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import lintModule from 'bpmn-js-bpmnlint';
import TokenSimulationModule from 'bpmn-js-token-simulation';
import bpmnlintConfig from '../../../.bpmnlintrc';
import { useApp } from '../App';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css';

export default function DiagramEditor({ diagram }) {
  const { actions } = useApp();
  const containerRef = useRef(null);
  const modelerRef = useRef(null);
  const saveTimerRef = useRef(null);

  const [lintResults, setLintResults] = useState([]);
  const [lintPanelOpen, setLintPanelOpen] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [zoom, setZoom] = useState(100);

  const scheduleAutoSave = useCallback((xml) => {
    clearTimeout(saveTimerRef.current);
    setSaving(true);
    saveTimerRef.current = setTimeout(() => {
      actions.updateXml(diagram.id, xml);
      setSaving(false);
    }, 800);
  }, [diagram.id, actions]);

  useEffect(() => {
    if (!containerRef.current) return;

    const modeler = new BpmnModeler({
      container: containerRef.current,
      additionalModules: [lintModule, TokenSimulationModule],
      linting: { bpmnlint: bpmnlintConfig }
    });
    modelerRef.current = modeler;

    modeler.importXML(diagram.xml).catch(err => {
      console.error('Import error:', err);
    });

    modeler.on('linting.completed', ({ results }) => {
      const flat = [];
      Object.entries(results || {}).forEach(([id, issues]) => {
        issues.forEach(issue => flat.push({ id, ...issue }));
      });
      setLintResults(flat);
    });

    modeler.on('commandStack.changed', async () => {
      try {
        const { xml } = await modeler.saveXML({ format: true });
        scheduleAutoSave(xml);
      } catch (e) {
        console.error('Save error:', e);
      }
    });

    modeler.on('canvas.viewbox.changed', ({ viewbox }) => {
      setZoom(Math.round(viewbox.scale * 100));
    });

    return () => {
      clearTimeout(saveTimerRef.current);
      modeler.destroy();
      modelerRef.current = null;
    };
  }, [diagram.id]);

  const handleZoomIn = () => modelerRef.current?.get('zoomScroll').stepZoom(1);
  const handleZoomOut = () => modelerRef.current?.get('zoomScroll').stepZoom(-1);
  const handleZoomReset = () => modelerRef.current?.get('canvas').zoom('fit-viewport', 'auto');

  const handleUndo = () => modelerRef.current?.get('commandStack').undo();
  const handleRedo = () => modelerRef.current?.get('commandStack').redo();

  const handleExportSVG = async () => {
    try {
      const { svg } = await modelerRef.current.saveSVG();
      await window.electronAPI.exportSVG(svg, `${diagram.name}.svg`);
    } catch (e) { console.error(e); }
  };

  const handleExportBPMN = async () => {
    try {
      const { xml } = await modelerRef.current.saveXML({ format: true });
      await window.electronAPI.exportBPMN(xml, `${diagram.name}.bpmn`);
    } catch (e) { console.error(e); }
  };

  const handleImport = async () => {
    const result = await window.electronAPI.importBPMN();
    if (result.success) {
      try {
        await modelerRef.current.importXML(result.content);
        const { xml } = await modelerRef.current.saveXML({ format: true });
        actions.updateXml(diagram.id, xml);
      } catch (e) { console.error(e); }
    }
  };

  const toggleSimulation = () => {
    const toggleModule = modelerRef.current?.get('toggleMode', false);
    if (toggleModule) {
      toggleModule.toggleMode();
      setSimulating(s => !s);
    }
  };

  const errorCount = lintResults.filter(r => r.category === 'error').length;
  const warnCount = lintResults.filter(r => r.category === 'warn').length;

  return (
    <div className="editor-root">
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <button className="topbar-btn icon-btn" onClick={handleUndo} title="Undo (Ctrl+Z)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,14 4,9 9,4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
          </button>
          <button className="topbar-btn icon-btn" onClick={handleRedo} title="Redo (Ctrl+Shift+Z)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15,14 20,9 15,4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg>
          </button>
        </div>

        <div className="toolbar-divider"/>

        <div className="toolbar-group">
          <button className="topbar-btn icon-btn" onClick={handleZoomOut} title="Zoom out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
          <button className="topbar-btn zoom-label" onClick={handleZoomReset} title="Fit to view">{zoom}%</button>
          <button className="topbar-btn icon-btn" onClick={handleZoomIn} title="Zoom in">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
        </div>

        <div className="toolbar-divider"/>

        <div className="toolbar-group">
          <button className="topbar-btn" onClick={handleImport} title="Import BPMN file">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Import
          </button>
          <button className="topbar-btn" onClick={handleExportBPMN} title="Export as BPMN">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            BPMN
          </button>
          <button className="topbar-btn" onClick={handleExportSVG} title="Export as SVG">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            SVG
          </button>
        </div>

        <div className="toolbar-spacer"/>

        <div className="toolbar-group">
          {saving && <span className="save-indicator">Saving…</span>}
          <button
            className={`topbar-btn simulate-btn ${simulating ? 'active' : ''}`}
            onClick={toggleSimulation}
            title="Toggle token simulation"
          >
            {simulating
              ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Stop Simulation</>
              : <><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg> Simulate</>
            }
          </button>
        </div>
      </div>

      <div className="editor-body">
        <div className="bpmn-canvas" ref={containerRef}/>
      </div>

      <div className={`lint-panel ${lintPanelOpen ? 'open' : ''}`}>
        <div className="lint-header" onClick={() => setLintPanelOpen(o => !o)}>
          <div className="lint-header-left">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>Lint Results</span>
            {errorCount > 0 && <span className="lint-badge error">{errorCount} error{errorCount !== 1 ? 's' : ''}</span>}
            {warnCount > 0 && <span className="lint-badge warn">{warnCount} warning{warnCount !== 1 ? 's' : ''}</span>}
            {lintResults.length === 0 && <span className="lint-badge ok">All clear</span>}
          </div>
          <span className="lint-chevron">{lintPanelOpen ? '▾' : '▴'}</span>
        </div>
        {lintPanelOpen && (
          <div className="lint-body">
            {lintResults.length === 0 ? (
              <div className="lint-empty">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>
                No issues found — diagram looks good!
              </div>
            ) : (
              lintResults.map((r, i) => (
                <div key={i} className={`lint-item ${r.category}`}>
                  <span className="lint-item-icon">{r.category === 'error' ? '✕' : '⚠'}</span>
                  <span className="lint-item-msg">{r.message}</span>
                  <span className="lint-item-rule">{r.rule}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
