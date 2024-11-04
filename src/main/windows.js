import { BrowserWindow, screen, app } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get the directory name of the current module file
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Check if the app is running in development mode
// const isDev = true; // You can change this or uncomment below line for dynamic environment setup
// Check if the app is running in development mode
const isDev = process.env.VITE_APP_MODE === "development";

console.log("VITE_APP_MODE:", process.env.VITE_APP_MODE);
console.log("isDev:", isDev);

// Helper function to get the platform-specific icon path
function getPlatformIcon() {
  switch (process.platform) {
    case "win32":
      return path.join(__dirname, "../../public/assets/images/icon.ico");
    case "darwin":
      return path.join(__dirname, "../../public/assets/images/icon.icns");
    case "linux":
    default:
      return path.join(__dirname, "../../public/assets/images/icon.png");
  }
}

let mainWindow;
let adWindows = []; // Array to keep track of ad windows

/**
 * Creates the main application window.
 * @returns {BrowserWindow} The main application window instance.
 */
function createMainWindow() {
  const iconPath = getPlatformIcon();
  // const iconPath = path.join(__dirname, "../../public/assets/images/icon.png");
  // const startUrl = isDev
  //   ? "http://localhost:3000"
  //   : `file://${path.join(__dirname, "../../dist/index.html")}`;

  const startUrl = isDev
    ? "http://localhost:3000"
    : `file://${path
        .join(__dirname, "../../dist/index.html")
        .replace(/\\/g, "/")}`;

  console.log("Start URL:", startUrl);

  // Main window configuration
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true,
    icon: iconPath,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false,
    },
  });

  // Load the initial URL in the main window
  mainWindow.loadURL(startUrl);

  // Event: When the window is about to close, hide it instead of closing
  mainWindow.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Event: When the window is minimized, hide it
  mainWindow.on("minimize", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  return mainWindow;
}

/**
 * Creates a normal-sized ad window.
 * @param {Object} ad - The ad object containing ad information.
 * @param {Object} user - The user object containing user information.
 * @param {boolean} runInBackground - Whether the ad window should run in the background.
 */
function createAdWindow(ad, user, runInBackground) {
  const iconPath = getPlatformIcon();
  const adWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    icon: iconPath,
    alwaysOnTop: !runInBackground, // Always on top unless running in the background
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false,
    },
  });

  // Load URL based on environment
  adWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../../dist/index.html")}`
  );

  // Send ad and user data when the content finishes loading
  adWindow.webContents.on("did-finish-load", () => {
    adWindow.webContents.send("navigate-to-ad-window", ad, user);
  });

  // Handle load failure
  adWindow.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription) => {
      console.error("Failed to load ad window:", errorDescription);
    }
  );

  // Clean up adWindows array when the window is closed
  adWindow.on("closed", () => {
    adWindows = adWindows.filter((win) => win !== adWindow);
  });

  adWindows.push(adWindow);
}

/**
 * Creates a full-size popup ad window.
 * @param {Object} ad - The ad object containing ad information.
 * @param {Object} user - The user object containing user information.
 * @param {boolean} runInBackground - Whether the ad window should run in the background.
 */
function createFullAdWindow(ad, user, runInBackground) {
  const iconPath = getPlatformIcon();
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const adWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    fullscreen: false,
    icon: iconPath,
    alwaysOnTop: !runInBackground,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false,
    },
  });

  // Load URL based on environment
  adWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../../dist/index.html")}`
  );

  // Send ad and user data when the content finishes loading
  adWindow.webContents.on("did-finish-load", () => {
    adWindow.webContents.send("navigate-to-ad-window", ad, user);
  });

  // Handle load failure
  adWindow.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription) => {
      console.error("Failed to load ad window:", errorDescription);
    }
  );

  // Clean up adWindows array when the window is closed
  adWindow.on("closed", () => {
    adWindows = adWindows.filter((win) => win !== adWindow);
  });

  adWindows.push(adWindow);
}

export { createMainWindow, createAdWindow, createFullAdWindow };
