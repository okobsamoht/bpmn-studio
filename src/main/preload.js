const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  loadProjects: () => ipcRenderer.invoke('load-projects'),
  saveProjects: (projects) => ipcRenderer.invoke('save-projects', projects),
  exportSVG: (svg, name) => ipcRenderer.invoke('export-svg', svg, name),
  exportBPMN: (xml, name) => ipcRenderer.invoke('export-bpmn', xml, name),
  importBPMN: () => ipcRenderer.invoke('import-bpmn')
});
