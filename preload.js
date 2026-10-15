const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  generateProject: (xml, options) => ipcRenderer.invoke('generate-project', xml, options),
  buildMod: (projectPath) => ipcRenderer.invoke('build-mod', projectPath),
  onBuildLog: (cb) => ipcRenderer.on('build-log', (e, d) => cb(d))
});
