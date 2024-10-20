import { ipcMain, app } from "electron";
import { saveUserData, clearUserData, loadUserData } from "./userData.js";
import { createAdWindow, createFullAdWindow } from "./windows.js";

let isMutedPopups = false;
let runInBackground = false;

function initializeIpcHandlers(mainWindow) {
  ipcMain.on("show-ad", (event, ad, user) => {
    // Check if user is logged in by verifying the presence of a token or profile data
    if (!user || !user.token || !user.profile) {
      console.log("User is not logged in. Popup will not be shown.");
      return;
    }

    // Check if the popups are muted
    if (isMutedPopups) {
      console.log("Popups are muted. Popup will not be shown.");
      return;
    }

    const userDepartmentId = user.profile.department._id;
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(userTimeZone);
    const userWorkingCountry = user.profile.workingCountry;
    const popupDepartments = ad.departments || [];
    const popupTimeZone = ad.timezone || null;

    // Department Filter
    const departmentMatch =
      popupDepartments.length === 0 ||
      popupDepartments.includes(userDepartmentId);

    // Country Filter
    let countryMatch = false;

    if (popupTimeZone) {
      // If popup has a country filter, check user's country
      if (userTimeZone === popupTimeZone) {
        countryMatch = true;
      }
    } else {
      // If no country filter in the popup, match is true
      countryMatch = true;
    }

    console.log("popup:", JSON.stringify(ad, null, 2));
    console.log("popupTimeZone: " + popupTimeZone);
    console.log("userTimeZone: " + userTimeZone);
    console.log("countryMatch: " + countryMatch);

    // Show Ad if both department and country match
    if (departmentMatch && countryMatch) {
      if (ad.windowSize === "normal") {
        createAdWindow(ad, user, runInBackground);
      } else if (ad.windowSize === "full") {
        createFullAdWindow(ad, user, runInBackground);
      } else {
        createAdWindow(ad, user, runInBackground);
      }
    } else {
      console.log(
        "Popup will not be shown due to department or timezone mismatch."
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

  ipcMain.on("update-mute-status", (event, isMuted) => {
    console.log("Mute status:", isMuted);
    isMutedPopups = isMuted;
  });

  ipcMain.on("update-run-in-background", (event, runInBg) => {
    console.log("Run in background status:", runInBg);
    runInBackground = runInBg;
  });

  const savedUser = loadUserData();
  if (savedUser) {
    mainWindow.webContents.on("did-finish-load", () => {
      mainWindow.webContents.send("auto-login", savedUser);
    });
  }
}

export { initializeIpcHandlers };
