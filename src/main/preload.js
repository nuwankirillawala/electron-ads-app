const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  showAd: (ad) => ipcRenderer.send("show-ad", ad),
  minimizeWindow: () => ipcRenderer.send("minimize-window"),
  closeWindow: () => ipcRenderer.send("close-window"),
  saveUserData: (user) => ipcRenderer.send("save-user-data", user),
  clearUserData: () => ipcRenderer.send("clear-user-data"),
  on: (channel, listener) => ipcRenderer.on(channel, listener),
  off: (channel, listener) => ipcRenderer.off(channel, listener),
});
