const { app, BrowserWindow, Tray, Menu, ipcMain, screen } = require("electron");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const AutoLaunch = require("auto-launch"); // Add this line
// const { session } = require("electron");
// const axios = require("axios");

// const isDev = process.env.NODE_ENV === "development";
const isDev = true;

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

async function saveUserData(user) {
  console.log("saving user data");

  // set the cookies - session
  // const cookie = {
  //   url: "http://localhost:5000/api/v1/",
  //   name: "jwt",
  //   value: user.token,
  //   sameSite: "strict",
  // };
  // console.log("Cookie", cookie);

  // try {
  //   await session.defaultSession.cookies.set(cookie);
  //   console.log("Cookie set successfully");
  // } catch (error) {
  //   console.error("Failed to set cookie:", error);
  // }

  // Override the user data
  // const userResponse = await axios.get(
  //   "http://localhost:5000/api/v1/auth/profile",
  //   {
  //     withCredentials: true,
  //   }
  // );
  // console.log("userResponse", userResponse);

  // const updatedUser = {
  //   token: user.token,
  //   profile: userResponse.data.user,
  // };

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
    ? `file://${path.join(__dirname, "../../public/index.html")}`
    : `file://${path.join(__dirname, "../../dist/index.html")}`;

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
    return false;
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

  adWindow.loadURL(`file://${path.join(__dirname, "../../dist/index.html")}`);
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

  adWindow.loadURL(`file://${path.join(__dirname, "../../public/index.html")}`);
  adWindow.webContents.on("did-finish-load", () => {
    adWindow.webContents.send("navigate-to-ad-window", ad, user);
  });

  adWindow.on("closed", () => {
    adWindows = adWindows.filter((win) => win !== adWindow);
  });

  adWindows.push(adWindow);
}

// Auto-launch setup
const appAutoLauncher = new AutoLaunch({
  name: "YourAppName", // Replace with your app's name
  path: app.getPath("exe"), // Path to the executable
});

app.whenReady().then(() => {
  createMainWindow();

  // Enable auto-launch
  appAutoLauncher
    .isEnabled()
    .then((isEnabled) => {
      if (!isEnabled) {
        appAutoLauncher.enable();
      }
    })
    .catch((err) => {
      console.error("Auto-launch error:", err);
    });

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

  ipcMain.on("show-ad", (event, ad, user) => {
    console.log(ad);
    console.log(user);

    // Check if user's department matches any in the popup's department array
    const userDepartmentId = user.profile.department; // Assuming this is the department ID from the user object
    const popupDepartments = ad.department; // Assuming this is an array of department IDs in the popup

    if (popupDepartments.includes(userDepartmentId)) {
      // If match is found, show the ad
      if (ad.windowSize === "normal") {
        createAdWindow(ad, user);
      } else if (ad.windowSize === "full") {
        createFullAdWindow(ad, user);
      } else {
        createAdWindow(ad, user);
      }
    } else {
      console.log(
        "User's department does not match any departments for this ad. Ad will not be shown."
      );
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

app.on("before-quit", () => {
  // Perform cleanup or other tasks before the app quits
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
