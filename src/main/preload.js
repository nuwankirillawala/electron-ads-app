const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  showAd: (ad, user, state) => ipcRenderer.send("show-ad", ad, user, state),
  minimizeWindow: () => ipcRenderer.send("minimize-window"),
  closeWindow: () => ipcRenderer.send("close-window"),
  saveUserData: (user) => ipcRenderer.send("save-user-data", user),
  clearUserData: () => ipcRenderer.send("clear-user-data"),
  setPauseDuration: (minutes) =>
    ipcRenderer.send("set-pause-duration", minutes),
  updateMuteStatus: (isMuted) =>
    ipcRenderer.send("update-mute-status", isMuted),
  updateRunInBackground: (runInBackground) =>
    ipcRenderer.send("update-run-in-background", runInBackground),
  getPopupQueue: () => ipcRenderer.invoke("get-popup-queue"),
  on: (channel, listener) => ipcRenderer.on(channel, listener),
  off: (channel, listener) => ipcRenderer.off(channel, listener),
});
