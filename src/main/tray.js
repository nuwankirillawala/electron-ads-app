import { Tray, Menu, app } from "electron";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module file
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let tray; // Variable to hold the tray instance

/**
 * Initializes the system tray for the application.
 * Sets up the tray icon, its context menu, and event listeners.
 * @param {BrowserWindow} mainWindow - The main application window instance.
 */
function initializeTray(mainWindow) {
  // Create the tray icon with the specified image path
  tray = new Tray(path.join(__dirname, "../../public/assets/images/icon.png"));

  // Define the context menu for the tray icon
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: () => mainWindow.show(), // Show the main window when clicked
    },
    {
      label: "Quit",
      click: () => {
        app.isQuiting = true;
        app.quit(); // Quit the application when clicked
      },
    },
  ]);

  // Set the tooltip for the tray icon
  tray.setToolTip("QuantumHR - Acorn Popups Portal");

  // Set the context menu for the tray icon
  tray.setContextMenu(contextMenu);

  // Event: When the tray icon is clicked, show the main window
  tray.on("click", () => {
    mainWindow.show();
  });
}

export { initializeTray };
