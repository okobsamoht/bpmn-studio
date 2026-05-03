import React from 'react';
import { useApp } from '../App';

export default function LandingPage() {
  const { actions } = useApp();

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-nav-logo">
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="#4f46e5"/>
            <path d="M12 24h8M28 24h8M20 16v16M28 16v16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="24" cy="24" r="4" fill="white"/>
          </svg>
          <span>BPMN Studio</span>
        </div>
        <button className="btn btn-primary" onClick={actions.goToStudio}>
          Open Studio
        </button>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-badge">Professional BPMN 2.0 Editor</div>
        <h1 className="landing-hero-title">
          Design, Validate &amp;<br/>Simulate Business Processes
        </h1>
        <p className="landing-hero-sub">
          A powerful desktop studio for modeling BPMN 2.0 diagrams with real-time linting,
          token simulation, and project management — all in one place.
        </p>
        <div className="landing-hero-actions">
          <button className="btn btn-primary btn-lg" onClick={actions.goToStudio}>
            Launch Studio
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
        <div className="landing-hero-visual">
          <div className="landing-mockup">
            <div className="mockup-bar">
              <span className="mockup-dot" style={{background:'#ff5f57'}}/>
              <span className="mockup-dot" style={{background:'#febc2e'}}/>
              <span className="mockup-dot" style={{background:'#28c840'}}/>
              <span className="mockup-title">BPMN Studio — Order Process.bpmn</span>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="mockup-project">
                  <div className="mockup-project-icon">📁</div>
                  <span>E-Commerce</span>
                </div>
                <div className="mockup-diagram active">
                  <div className="mockup-diagram-icon">📄</div>
                  <span>Order Process</span>
                </div>
                <div className="mockup-diagram">
                  <div className="mockup-diagram-icon">📄</div>
                  <span>Returns Flow</span>
                </div>
                <div className="mockup-project">
                  <div className="mockup-project-icon">📁</div>
                  <span>HR Onboarding</span>
                </div>
              </div>
              <div className="mockup-canvas">
                <div className="mockup-bpmn">
                  <svg viewBox="0 0 340 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="70" r="16" stroke="#4f46e5" strokeWidth="2"/>
                    <rect x="70" y="50" width="60" height="40" rx="4" stroke="#64748b" strokeWidth="1.5" fill="#f8f9fc"/>
                    <text x="100" y="74" textAnchor="middle" fontSize="8" fill="#1e293b">Review</text>
                    <path d="M166 70 l12-20 l12 20 l-12 20 z" stroke="#f59e0b" strokeWidth="1.5" fill="#fef3c7"/>
                    <text x="178" y="98" textAnchor="middle" fontSize="7" fill="#92400e">Decision</text>
                    <rect x="210" y="50" width="60" height="40" rx="4" stroke="#64748b" strokeWidth="1.5" fill="#f8f9fc"/>
                    <text x="240" y="74" textAnchor="middle" fontSize="8" fill="#1e293b">Approve</text>
                    <circle cx="310" cy="70" r="16" stroke="#ef4444" strokeWidth="3"/>
                    <line x1="303" y1="63" x2="317" y2="77" stroke="#ef4444" strokeWidth="2"/>
                    <line x1="303" y1="77" x2="317" y2="63" stroke="#ef4444" strokeWidth="2"/>
                    <line x1="46" y1="70" x2="70" y2="70" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)"/>
                    <line x1="130" y1="70" x2="166" y2="70" stroke="#94a3b8" strokeWidth="1.5"/>
                    <line x1="190" y1="70" x2="210" y2="70" stroke="#94a3b8" strokeWidth="1.5"/>
                    <line x1="270" y1="70" x2="294" y2="70" stroke="#94a3b8" strokeWidth="1.5"/>
                    <defs>
                      <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L6,3 z" fill="#94a3b8"/>
                      </marker>
                    </defs>
                  </svg>
                </div>
                <div className="mockup-lint">
                  <div className="mockup-lint-header">
                    <span className="lint-dot warn"/>
                    <span>1 warning detected</span>
                  </div>
                  <div className="mockup-lint-item">⚠ Task "Approve" missing label description</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-features">
        <h2>Everything you need to model processes</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{background:'#ede9fe'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            </div>
            <h3>Project Management</h3>
            <p>Organize diagrams into projects. Create, rename and manage multiple workflows from a clean sidebar.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{background:'#dcfce7'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3>Real-time Linting</h3>
            <p>Built-in BPMN linting validates your diagrams as you draw. Catch errors and warnings instantly.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{background:'#fef3c7'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16"/></svg>
            </div>
            <h3>Token Simulation</h3>
            <p>Simulate token flow through your processes to validate behavior and spot dead-ends before deployment.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{background:'#e0f2fe'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </div>
            <h3>Export &amp; Import</h3>
            <p>Export diagrams as SVG or standard BPMN XML. Import existing BPMN files from any compatible tool.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{background:'#fce7f3'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
            </div>
            <h3>BPMN 2.0 Standard</h3>
            <p>Full BPMN 2.0 compliance with tasks, gateways, events, lanes, pools and all standard elements.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{background:'#f1f5f9'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <h3>Auto-save</h3>
            <p>Every change is persisted automatically. Your work is always safe, even after unexpected restarts.</p>
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <h2>Start modeling today</h2>
        <p>BPMN Studio runs entirely on your machine. No account required, no data sent anywhere.</p>
        <button className="btn btn-primary btn-lg" onClick={actions.goToStudio}>
          Open Studio
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </section>

      <footer className="landing-footer">
        <div className="landing-nav-logo">
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="#4f46e5"/>
            <path d="M12 24h8M28 24h8M20 16v16M28 16v16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="24" cy="24" r="4" fill="white"/>
          </svg>
          <span>BPMN Studio</span>
        </div>
        <span>Built with bpmn-js · Open Source</span>
      </footer>
    </div>
  );
}
