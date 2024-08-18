import { BrowserWindow, screen, app } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isDev = process.env.NODE_ENV === "development";
console.log("development mode: ", isDev);
console.log("production mode: ", !isDev);

let mainWindow;
let adWindows = [];

function createMainWindow() {
  const iconPath = path.join(__dirname, "../../public/assets/images/icon.png");
  const startUrl = isDev
    ? "http://localhost:3000" // Load from Vite dev server in development mode
    : `file://${path.join(__dirname, "../../dist/index.html")}`; // Load the production build in production mode

  console.log("start ", startUrl);

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false,
    },
  });

  mainWindow.loadURL(startUrl);

  mainWindow.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on("minimize", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });
}

function createAdWindow(ad, user) {
  const adWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false,
    },
  });

  adWindow.loadURL(
    isDev
      ? "http://localhost:3000" // Load from Vite dev server in development mode
      : `file://${path.join(__dirname, "../../dist/index.html")}`
  ); // Load the production build in production mode

  adWindow.webContents.on("did-finish-load", () => {
    adWindow.webContents.send("navigate-to-ad-window", ad, user);
  });

  adWindow.on("closed", () => {
    adWindows = adWindows.filter((win) => win !== adWindow);
  });

  adWindows.push(adWindow);
}

function createFullAdWindow(ad, user) {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const adWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false,
    },
  });

  adWindow.loadURL(
    isDev
      ? "http://localhost:3000" // Load from Vite dev server in development mode
      : `file://${path.join(__dirname, "../../dist/index.html")}`
  ); // Load the production build in production mode

  adWindow.webContents.on("did-finish-load", () => {
    adWindow.webContents.send("navigate-to-ad-window", ad, user);
  });

  adWindow.on("closed", () => {
    adWindows = adWindows.filter((win) => win !== adWindow);
  });

  adWindows.push(adWindow);
}

export { createMainWindow, createAdWindow, createFullAdWindow };
