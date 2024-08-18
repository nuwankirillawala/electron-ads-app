import { app } from "electron";
import { createMainWindow } from "./windows.js";
import { initializeTray } from "./tray.js";
import { initializeIpcHandlers } from "./ipcHandlers.js";
import { setupAutoLaunch } from "./autoLaunch.js";
import { registerAppEvents } from "./events.js";

app.whenReady().then(() => {
  mainWindow = createMainWindow();
  initializeTray(mainWindow);
  initializeIpcHandlers();
  setupAutoLaunch();
  registerAppEvents();
});
