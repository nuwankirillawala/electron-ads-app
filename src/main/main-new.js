const { app } = require("electron");
const { createMainWindow } = require("./windows");
const { initializeTray } = require("./tray");
const { initializeIpcHandlers } = require("./ipcHandlers");
const { setupAutoLaunch } = require("./autoLaunch");
const { registerAppEvents } = require("./events");

app.whenReady().then(() => {
  createMainWindow();
  initializeTray();
  initializeIpcHandlers();
  setupAutoLaunch();
  registerAppEvents();
});
