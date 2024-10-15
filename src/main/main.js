import { app, BrowserWindow } from "electron";
import dotenv from "dotenv";
import { initializeTray } from "./tray.js";
import { setupAutoLaunch } from "./autoLaunch.js";
import { createMainWindow } from "./windows.js";
import { initializeIpcHandlers } from "./ipcHandlers.js";

dotenv.config();

let mainWindow;

app.whenReady().then(() => {
  // Create the main window
  mainWindow = createMainWindow();

  // Setup the auto launch
  setupAutoLaunch();

  // Initialize the Tray icon
  initializeTray(mainWindow);

  // IPC Handlers
  initializeIpcHandlers(mainWindow);
});

// Handle app events
app.on("before-quit", () => {
  console.log("App is quitting...");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
