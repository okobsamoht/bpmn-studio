# Changelog

All notable changes to BPMN Studio are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- Initial release

---

## [1.0.0] — 2024-01-01

### Added
- Full BPMN 2.0 diagram editor powered by bpmn-js v17
- Project management: create, rename, and delete projects with multiple diagrams each
- Real-time linting via bpmnlint with expandable results panel
- Token simulation via bpmn-js-token-simulation
- Auto-save: all changes persisted automatically to local storage
- Import BPMN 2.0 XML files from disk
- Export diagrams as standard BPMN XML or SVG
- Undo/redo with keyboard shortcuts
- Zoom controls with fit-to-viewport
- Right-click context menus on projects and diagrams
- Inline rename for projects and diagrams
- Cross-platform builds: macOS (.dmg), Windows (.exe/NSIS), Linux (.AppImage, .deb)
- Auto-updater via electron-updater (packaged builds only)
- GitHub Actions CI (build matrix across all three platforms)
- GitHub Actions release pipeline (triggered by version tags)

[Unreleased]: https://github.com/bokothomas/bpmn-studio/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/bokothomas/bpmn-studio/releases/tag/v1.0.0
