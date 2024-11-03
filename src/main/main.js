import { app, BrowserWindow } from "electron";
import dotenv from "dotenv";
import { initializeTray } from "./tray.js";
import { setupAutoLaunch } from "./autoLaunch.js";
import { createMainWindow } from "./windows.js";
import { initializeIpcHandlers } from "./ipcHandlers.js";

// Load environment variables from .env file
dotenv.config();

app.setPath("userData", `${app.getPath("appData")}\\QuantumHR_Notify`);

let mainWindow; // Variable to hold the main window instance

/**
 * Main application setup when Electron is ready
 */
app.whenReady().then(() => {
  // Create the main application window
  mainWindow = createMainWindow();

  // Setup the auto-launch feature
  setupAutoLaunch();

  // Initialize the system tray icon and its functionalities
  initializeTray(mainWindow);

  // Initialize IPC handlers for communication between main and renderer processes
  initializeIpcHandlers(mainWindow);
});

/**
 * Application Event Handlers
 */

// Event: 'before-quit'
// Emitted when the application is about to quit. Useful for cleanup or logging.
app.on("before-quit", () => {
  console.log("App is quitting...");
});

// Event: 'window-all-closed'
// Emitted when all windows are closed.
// On macOS, the application should remain active until the user explicitly quits.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit(); // Quit the app for non-macOS platforms
  }
});

// Event: 'activate'
// Emitted when the application is activated (e.g., clicking on the dock icon in macOS).
// If no windows are open, create the main window.
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createMainWindow(); // Recreate the main window if none are open
  }
});
