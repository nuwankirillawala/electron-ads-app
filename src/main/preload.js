const { contextBridge, ipcRenderer, shell } = require("electron");

/**
 * Expose limited and secure Electron APIs to the renderer process.
 * The methods defined here will be accessible via the `window.electron` object in the renderer.
 */
contextBridge.exposeInMainWorld("electron", {
  /**
   * Show an ad based on user and state data.
   * @param {Object} ad - The ad data to be shown.
   * @param {Object} user - The user information.
   * @param {String} state - The state of the ad (e.g., new, viewed).
   */
  showAd: (ad, user, state) => ipcRenderer.send("show-ad", ad, user, state),

  /**
   * Minimize the application window.
   */
  minimizeWindow: () => ipcRenderer.send("minimize-window"),

  /**
   * Close the application window.
   */
  closeWindow: () => ipcRenderer.send("close-window"),

  /**
   * Save user data.
   * @param {Object} user - The user data to be saved.
   */
  saveUserData: (user) => ipcRenderer.send("save-user-data", user),

  /**
   * Clear user data.
   */
  clearUserData: () => ipcRenderer.send("clear-user-data"),

  /**
   * Set the duration for which popups will be paused.
   * @param {Number} minutes - The duration in minutes to pause popups.
   */
  setPauseDuration: (minutes) =>
    ipcRenderer.send("set-pause-duration", minutes),

  /**
   * Update the mute status for popups.
   * @param {Boolean} isMuted - Whether popups should be muted.
   */
  updateMuteStatus: (isMuted) =>
    ipcRenderer.send("update-mute-status", isMuted),

  /**
   * Update the run-in-background status of the application.
   * @param {Boolean} runInBackground - Whether the app should run in the background.
   */
  updateRunInBackground: (runInBackground) =>
    ipcRenderer.send("update-run-in-background", runInBackground),

  /**
   * Get the popup queue asynchronously.
   * This uses ipcRenderer.invoke to get the current queue from the main process.
   * @returns {Promise<Array>} - A promise that resolves with the popup queue array.
   */
  getPopupQueue: () => ipcRenderer.invoke("get-popup-queue"),

  /**
   * Open a URL in the default system browser by sending an IPC message to the main process.
   * @param {String} url - The URL to open.
   */
  openExternal: (url) => {
    ipcRenderer.send("open-external", url);
  },

  /**
   * Listen for a specific IPC event channel from the main process.
   * @param {String} channel - The IPC channel name.
   * @param {Function} listener - The callback function when the event is received.
   */
  on: (channel, listener) => ipcRenderer.on(channel, listener),

  /**
   * Remove a listener for a specific IPC event channel.
   * @param {String} channel - The IPC channel name.
   * @param {Function} listener - The callback function to remove.
   */
  off: (channel, listener) => ipcRenderer.off(channel, listener),
});
