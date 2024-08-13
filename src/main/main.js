const { app, BrowserWindow, Tray, Menu, ipcMain, screen } = require("electron");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// const isDev = process.env.NODE_ENV === "development";
const isDev = false;

let mainWindow;
let tray;
let adWindows = [];

const userDataPath = path.join(app.getPath("userData"), "user_data.json");

const algorithm = "aes-256-cbc";
const key = crypto
  .createHash("sha256")
  .update(String("your-secret-key"))
  .digest("base64")
  .substr(0, 32); // Your fixed key

function encrypt(text) {
  const iv = crypto.randomBytes(16); // Initialization vector
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

function saveUserData(user) {
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

function createMainWindow() {
  const iconPath = path.join(__dirname, "../../public/assets/images/icon.png");
  const startUrl = isDev
    ? "http://localhost:9000/"
    : `file://${path.join(__dirname, "../../dist/index.html")}`;

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(startUrl);

  mainWindow.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  mainWindow.on("minimize", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });
}

function createAdWindow(ad) {
  const adWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  adWindow.loadURL(startUrl);
  adWindow.webContents.on("did-finish-load", () => {
    adWindow.webContents.send("navigate-to-ad-window", ad);
  });

  adWindow.on("closed", () => {
    adWindows = adWindows.filter((win) => win !== adWindow);
  });

  adWindows.push(adWindow);
}

function createFullAdWindow(ad) {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const adWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  adWindow.loadURL(startUrl);
  adWindow.webContents.on("did-finish-load", () => {
    adWindow.webContents.send("navigate-to-ad-window", ad);
  });

  adWindow.on("closed", () => {
    adWindows = adWindows.filter((win) => win !== adWindow);
  });

  adWindows.push(adWindow);
}

app.whenReady().then(() => {
  createMainWindow();

  tray = new Tray(path.join(__dirname, "../../public/assets/images/icon.png"));
  const contextMenu = Menu.buildFromTemplate([
    { label: "Show App", click: () => mainWindow.show() },
    {
      label: "Quit",
      click: () => {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);
  tray.setToolTip("Acorn HR App");
  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    mainWindow.show();
  });

  ipcMain.on("show-ad", (event, ad) => {
    if (ad.windowSize == "normal") {
      createAdWindow(ad);
    } else if (ad.windowSize == "full") {
      createFullAdWindow(ad);
    } else {
      createAdWindow(ad);
    }
  });

  ipcMain.on("minimize-window", () => {
    mainWindow.minimize();
  });

  ipcMain.on("close-window", () => {
    app.isQuiting = true;
    app.quit();
  });

  ipcMain.on("save-user-data", (event, user) => {
    saveUserData(user);
  });

  ipcMain.on("clear-user-data", () => {
    clearUserData();
  });

  const savedUser = loadUserData();
  if (savedUser) {
    mainWindow.webContents.on("did-finish-load", () => {
      mainWindow.webContents.send("auto-login", savedUser);
    });
  }
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
