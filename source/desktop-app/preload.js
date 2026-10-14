const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('modBuilder', {
  buildMod: () => ipcRenderer.send('build-mod'),
  onBuildLog: (callback) => ipcRenderer.on('build-log', (_, data) => callback(data)),
  onBuildFinished: (callback) => ipcRenderer.on('build-finished', (_, data) => callback(data)),
  saveProject: (payload) => ipcRenderer.invoke('save-project', payload)
});
