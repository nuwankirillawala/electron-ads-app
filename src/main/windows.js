import { BrowserWindow, screen, app } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get the directory name of the current module file
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Check if the app is running in development mode
const isDev = true; // You can change this or uncomment below line for dynamic environment setup
// const isDev = process.env.NODE_ENV === "development";

let mainWindow;
let adWindows = []; // Array to keep track of ad windows

/**
 * Creates the main application window.
 * @returns {BrowserWindow} The main application window instance.
 */
function createMainWindow() {
  const iconPath = path.join(__dirname, "../../public/assets/images/icon.png");
  const startUrl = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../../dist/index.html")}`;

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
  const adWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
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
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const adWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    fullscreen: false,
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
