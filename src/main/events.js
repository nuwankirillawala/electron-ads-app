import { app, BrowserWindow } from "electron";
import { createMainWindow } from "./windows"; // Import your createMainWindow function

/**
 * Registers app-level events for the Electron application.
 * This ensures proper behavior across different platforms and situations.
 */
function registerAppEvents() {
  /**
   * Event: 'before-quit'
   * This event is emitted when the application is about to quit.
   * It's a good place to perform cleanup tasks or log actions.
   */
  app.on("before-quit", () => {
    console.log("App is quitting...");
  });

  /**
   * Event: 'window-all-closed'
   * This event is emitted when all windows are closed.
   * - On Windows and Linux, this will quit the application.
   * - On macOS, the application remains active until the user quits explicitly.
   */
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      // Quit the application for non-macOS platforms
      app.quit();
    }
  });

  /**
   * Event: 'activate'
   * This event is emitted when the application is activated (e.g., when clicked on the dock icon on macOS).
   * If there are no open windows, it creates a new main window.
   */
  app.on("activate", () => {
    // On macOS, re-create a window if none are open when the dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
}

export { registerAppEvents };
