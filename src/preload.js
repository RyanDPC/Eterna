const { contextBridge, ipcRenderer } = require('electron');

// Exposer les APIs sécurisées au renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Contrôles de fenêtre
  minimize: () => ipcRenderer.invoke('minimize-window'),
  maximize: () => ipcRenderer.invoke('maximize-window'),
  close: () => ipcRenderer.invoke('close-window'),
  
  // Persistance des données
  saveData: (filename, data) => ipcRenderer.invoke('save-data', filename, data),
  loadData: (filename) => ipcRenderer.invoke('load-data', filename),
  deleteData: (filename) => ipcRenderer.invoke('delete-data', filename),
  
  // Informations de l'application
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppName: () => ipcRenderer.invoke('get-app-name'),
  
  // Utilitaires
  isElectron: true,
  platform: process.platform
});

// Exposer les événements IPC
contextBridge.exposeInMainWorld('ipcRenderer', {
  on: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  once: (channel, func) => {
    ipcRenderer.once(channel, (event, ...args) => func(...args));
  },
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});
