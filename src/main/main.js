const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function getProjectsPath() {
  return path.join(app.getPath('userData'), 'projects.json');
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    title: 'BPMN Studio',
    backgroundColor: '#f8f9fc',
    show: false
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (app.isPackaged) setupUpdater();
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

function setupUpdater() {
  try {
    const { autoUpdater } = require('electron-updater');
    autoUpdater.logger = null;
    autoUpdater.checkForUpdatesAndNotify();
  } catch {
    // updater unavailable (dev build or unsigned package)
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

ipcMain.handle('load-projects', () => {
  try {
    const p = getProjectsPath();
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
    return [];
  } catch { return []; }
});

ipcMain.handle('save-projects', (_, projects) => {
  try {
    fs.writeFileSync(getProjectsPath(), JSON.stringify(projects, null, 2), 'utf8');
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('export-svg', async (_, svg, name) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    defaultPath: name || 'diagram.svg',
    filters: [{ name: 'SVG Image', extensions: ['svg'] }]
  });
  if (!canceled && filePath) {
    fs.writeFileSync(filePath, svg, 'utf8');
    return { success: true };
  }
  return { success: false };
});

ipcMain.handle('export-bpmn', async (_, xml, name) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    defaultPath: name || 'diagram.bpmn',
    filters: [{ name: 'BPMN File', extensions: ['bpmn', 'xml'] }]
  });
  if (!canceled && filePath) {
    fs.writeFileSync(filePath, xml, 'utf8');
    return { success: true };
  }
  return { success: false };
});

ipcMain.handle('import-bpmn', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    filters: [{ name: 'BPMN File', extensions: ['bpmn', 'xml'] }],
    properties: ['openFile']
  });
  if (!canceled && filePaths.length > 0) {
    const content = fs.readFileSync(filePaths[0], 'utf8');
    return { success: true, content };
  }
  return { success: false };
});

ipcMain.handle('get-version', () => app.getVersion());
