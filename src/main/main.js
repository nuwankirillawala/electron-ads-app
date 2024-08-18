import { app, BrowserWindow, Tray, Menu, ipcMain, screen } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import { initializeTray } from "./tray.js";
import { setupAutoLaunch } from "./autoLaunch.js";
import { createMainWindow } from "./windows.js";
import { initializeIpcHandlers } from "./ipcHandlers.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isDev = process.env.NODE_ENV === "development";

let mainWindow;
let tray;
let adWindows = [];

const userDataPath = path.join(app.getPath("userData"), "user_data.json");

const algorithm = "aes-256-cbc";
const key = crypto
  .createHash("sha256")
  .update(String("your-secret-key"))
  .digest("base64")
  .substr(0, 32);

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

function decrypt(text) {
  const [ivHex, encrypted] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

async function saveUserData(user) {
  console.log("saving user data");
  const userData = encrypt(JSON.stringify(user));
  fs.writeFileSync(userDataPath, userData, "utf8");
}

function loadUserData() {
  if (fs.existsSync(userDataPath)) {
    try {
      const encryptedData = fs.readFileSync(userDataPath, "utf8");
      return JSON.parse(decrypt(encryptedData));
    } catch (error) {
      console.error("Error decrypting user data:", error);
      clearUserData();
      return null;
    }
  }
  return null;
}

function clearUserData() {
  if (fs.existsSync(userDataPath)) {
    fs.unlinkSync(userDataPath);
  }
}

function createAdWindow(ad, user) {
  const adWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true,
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
      ? "http://localhost:3000" // Vite dev server URL
      : `file://${path.join(__dirname, "../../dist/index.html")}`
  );
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
      ? "http://localhost:3000" // Vite dev server URL
      : `file://${path.join(__dirname, "../../dist/index.html")}`
  );
  adWindow.webContents.on("did-finish-load", () => {
    adWindow.webContents.send("navigate-to-ad-window", ad, user);
  });

  adWindow.on("closed", () => {
    adWindows = adWindows.filter((win) => win !== adWindow);
  });

  adWindows.push(adWindow);
}

app.whenReady().then(() => {
  // Create the main window
  mainWindow = createMainWindow();

  //setup the auto launch
  setupAutoLaunch();

  // Initialize the Tray icon
  initializeTray(mainWindow);

  //IPC Handlers
  initializeIpcHandlers(mainWindow);
});

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
