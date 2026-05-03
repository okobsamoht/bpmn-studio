# BPMN Studio

A professional desktop application for designing, validating, and simulating BPMN 2.0 business process diagrams. Built with Electron, React, and the powerful bpmn.io open source ecosystem.

![BPMN Studio Screenshot](./docs/index.html)

---

## Features

- **Full BPMN 2.0 Editor** — drag-and-drop palette with tasks, gateways, events, lanes, pools, sub-processes and all standard BPMN 2.0 elements, powered by [bpmn-js](https://github.com/bpmn-io/bpmn-js)
- **Project Management** — organize diagrams into named projects; create, rename, and delete via the sidebar or right-click context menu
- **Real-time Linting** — inline validation powered by [bpmnlint](https://github.com/bpmn-io/bpmnlint) surfaces errors and warnings as you model, with rule names for quick lookup
- **Token Simulation** — simulate token flow through the process using [bpmn-js-token-simulation](https://github.com/bpmn-io/bpmn-js-token-simulation) to catch dead-ends and verify branching logic before deployment
- **Auto-save** — every diagram change is persisted automatically to local storage; no manual save needed
- **Import / Export** — import `.bpmn`/`.xml` files from any BPMN 2.0 tool; export as standard BPMN XML or SVG
- **Offline-first** — fully local, no internet connection required, no account, no telemetry
- **Cross-platform** — runs on macOS, Windows, and Linux via Electron

---

## Technology Stack

| Layer | Technology |
|---|---|
| Desktop runtime | [Electron](https://electronjs.org) v29 |
| UI framework | [React](https://react.dev) v18 |
| BPMN editor | [bpmn-js](https://github.com/bpmn-io/bpmn-js) v17 |
| Diagram linting | [bpmn-js-bpmnlint](https://github.com/bpmn-io/bpmn-js-bpmnlint) + [bpmnlint](https://github.com/bpmn-io/bpmnlint) |
| Token simulation | [bpmn-js-token-simulation](https://github.com/bpmn-io/bpmn-js-token-simulation) |
| Bundler | [Webpack](https://webpack.js.org) v5 |
| Transpiler | [Babel](https://babeljs.io) v7 |

---

## Project Structure

```
bpmn-studio/
├── src/
│   ├── main/
│   │   ├── main.js          # Electron main process — window, IPC, file I/O
│   │   └── preload.js       # Context bridge — exposes safe API to renderer
│   └── renderer/
│       ├── index.html       # HTML template
│       ├── index.jsx        # React entry point
│       ├── App.jsx          # Root component, global state (Context + useReducer)
│       ├── components/
│       │   ├── LandingPage.jsx    # In-app landing / onboarding screen
│       │   ├── Studio.jsx         # Main studio layout (sidebar + editor)
│       │   ├── Sidebar.jsx        # Project tree with inline editing & context menus
│       │   ├── DiagramEditor.jsx  # bpmn-js modeler with linting + simulation
│       │   └── WelcomeScreen.jsx  # Empty-state screen shown when no diagram is open
│       └── styles/
│           └── app.css      # All application styles (single CSS file, CSS variables)
├── docs/
│   └── index.html           # Standalone marketing / product landing page
├── dist/                    # Build output (git-ignored)
│   ├── main/
│   └── renderer/
├── .bpmnlintrc              # bpmnlint rule configuration (extends recommended)
├── .babelrc                 # Babel preset config
├── webpack.main.config.js   # Webpack config for Electron main process
├── webpack.renderer.config.js # Webpack config for React renderer
└── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or later
- npm v9 or later

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/bpmn-studio.git
cd bpmn-studio

# Install all dependencies
npm install
```

### Development

Build both processes and launch Electron:

```bash
npm run start
```

Or run webpack in watch mode and launch Electron separately for faster iteration:

```bash
# Terminal 1 — watch both processes
npm run dev

# Terminal 2 — launch Electron after initial build completes
npm run electron
```

### Production Build

```bash
npm run build
npm run electron
```

---

## Usage Guide

### Creating a Project

1. Click the **+** icon next to "Projects" in the left sidebar, or
2. Right-click anywhere in the sidebar and choose **New Project**

Projects are containers for related diagrams. A good rule of thumb: one project per business domain, team, or system.

### Adding a Diagram

1. Right-click a project in the sidebar → **New Diagram**, or
2. Hover over a project row and click the small **+** that appears, or
3. Use the welcome screen's **New Diagram** button when a project is selected

Each new diagram opens with a minimal valid BPMN skeleton (one start event, one end event, one sequence flow).

### Editing Diagrams

- **Palette** — the left-side palette contains all BPMN 2.0 element types. Drag elements onto the canvas.
- **Connection** — hover over an element edge until the connection handle appears, then drag to another element.
- **Labels** — double-click any element to edit its name inline.
- **Properties** — click an element to select it; use the property panel (if visible) to adjust attributes.
- **Undo/Redo** — use the toolbar buttons or `Ctrl+Z` / `Ctrl+Shift+Z`.
- **Zoom** — use the toolbar zoom buttons, the scroll wheel, or `Ctrl+scroll`. Click the percentage to fit the entire diagram in view.

### Linting

The lint panel at the bottom of the editor runs continuously as you draw. It shows:

| Indicator | Meaning |
|---|---|
| ✕ Error | Rule violation that must be fixed for a valid BPMN diagram |
| ⚠ Warning | Best-practice violation that should be addressed |
| ✓ All clear | Diagram passes all configured lint rules |

Click the lint panel header to expand or collapse it. Each issue shows the element ID, a human-readable message, and the rule name (e.g. `label-required`, `no-disconnected`) for cross-referencing the bpmnlint documentation.

To customise which rules are enforced, edit `.bpmnlintrc` at the project root:

```json
{
  "extends": "bpmnlint:recommended",
  "rules": {
    "label-required": "error",
    "no-disconnected": "warn"
  }
}
```

Run `npm run build` after changing `.bpmnlintrc` for changes to take effect.

### Token Simulation

1. Click **Simulate** in the top-right of the toolbar to enter simulation mode. The canvas border turns green.
2. Click a **Start Event** to fire a token from that point.
3. Watch tokens propagate through sequence flows, split at gateways, and reach end events.
4. At exclusive or inclusive gateways you will be prompted to choose the outgoing path.
5. Click **Stop Simulation** to exit and return to edit mode. All token state is discarded.

Token simulation is powered by [bpmn-js-token-simulation](https://github.com/bpmn-io/bpmn-js-token-simulation). Consult its documentation for advanced use (parallel gateways, boundary events, etc.).

### Importing and Exporting

| Action | How |
|---|---|
| Import BPMN | Toolbar → **Import** → choose a `.bpmn` or `.xml` file |
| Export BPMN | Toolbar → **BPMN** → choose save location |
| Export SVG | Toolbar → **SVG** → choose save location |

Exported BPMN XML is standard BPMN 2.0 and can be opened in Camunda Modeler, Activiti Designer, Flowable, or any other compliant tool.

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Ctrl+Scroll` | Zoom in / out |
| `Space + Drag` | Pan the canvas |
| `Delete` / `Backspace` | Delete selected element |
| `Ctrl+A` | Select all elements |
| `Escape` | Deselect / cancel current action |

---

## Data Storage

Projects and diagram XML are stored as a single JSON file in Electron's user data directory:

| Platform | Location |
|---|---|
| macOS | `~/Library/Application Support/bpmn-studio/projects.json` |
| Windows | `%APPDATA%\bpmn-studio\projects.json` |
| Linux | `~/.config/bpmn-studio/projects.json` |

All data stays on your machine. There is no cloud sync, no analytics, and no network requests of any kind.

---

## Architecture

### State Management

Global state lives in `App.jsx` using React's built-in `useContext` + `useReducer`. The state shape is:

```typescript
{
  view: 'landing' | 'studio';
  projects: Array<{
    id: string;           // UUID v4
    name: string;
    createdAt: number;    // Unix timestamp
    diagrams: Array<{
      id: string;
      name: string;
      xml: string;        // BPMN 2.0 XML string
      createdAt: number;
      updatedAt: number;
    }>;
  }>;
  currentProjectId: string | null;
  currentDiagramId: string | null;
  isLoading: boolean;
}
```

Every state change that modifies `projects` triggers an IPC call to the main process to persist the updated state.

### IPC API (preload bridge)

```typescript
window.electronAPI.loadProjects()              // → Project[]
window.electronAPI.saveProjects(projects)      // → { success: boolean }
window.electronAPI.exportSVG(svg, filename)    // → { success: boolean }
window.electronAPI.exportBPMN(xml, filename)   // → { success: boolean }
window.electronAPI.importBPMN()               // → { success: boolean, content?: string }
```

### bpmn-js Integration

`DiagramEditor.jsx` mounts a `BpmnModeler` instance with two additional modules:

```javascript
new BpmnModeler({
  container: ref.current,
  additionalModules: [lintModule, TokenSimulationModule],
  linting: { bpmnlint: bpmnlintConfig }
});
```

- `linting.completed` event → updates lint panel
- `commandStack.changed` event → schedules auto-save (debounced 800ms)
- `canvas.viewbox.changed` event → updates zoom indicator

---

## Landing Page

A standalone marketing page is available at `docs/index.html`. It is a self-contained single-file HTML page with no external dependencies — open it in any browser.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run a build to verify: `npm run build`
5. Commit: `git commit -m "feat: add my feature"`
6. Open a Pull Request

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---

## Acknowledgements

This application is built on the excellent open source work of the [bpmn.io](https://bpmn.io) team at Camunda:

- [bpmn-js](https://github.com/bpmn-io/bpmn-js) — BPMN 2.0 rendering and editing
- [bpmnlint](https://github.com/bpmn-io/bpmnlint) — BPMN diagram linting engine
- [bpmn-js-bpmnlint](https://github.com/bpmn-io/bpmn-js-bpmnlint) — bpmnlint integration for bpmn-js
- [bpmn-js-token-simulation](https://github.com/bpmn-io/bpmn-js-token-simulation) — token simulation overlay
