const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  showAd: (ad) => ipcRenderer.send('show-ad', ad)
});
