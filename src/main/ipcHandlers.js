import { ipcMain, app } from "electron";
import { saveUserData, clearUserData, loadUserData } from "./userData.js";
import { createAdWindow, createFullAdWindow } from "./windows.js";

function initializeIpcHandlers(mainWindow) {
  ipcMain.on("show-ad", (event, ad, user) => {
    // Check if user is logged in by verifying the presence of a token or profile data
    if (!user || !user.token || !user.profile) {
      console.log("User is not logged in. Ad will not be shown.");
      return;
    }

    const userDepartmentId = user.profile.department;
    const userCountry = user.profile.country;
    const userWorkingCountry = user.profile.workingCountry;
    const popupDepartments = ad.department || [];
    const popupCountry = ad.country || null;

    // Department Filter
    const departmentMatch =
      popupDepartments.length === 0 ||
      popupDepartments.includes(userDepartmentId);

    // Country Filter
    let countryMatch = false;

    if (popupCountry) {
      // If popup has a country filter, check user's country and workingCountry
      if (userCountry === userWorkingCountry && userCountry === popupCountry) {
        countryMatch = true;
      } else if (
        userCountry !== userWorkingCountry &&
        userWorkingCountry === popupCountry
      ) {
        countryMatch = true;
      }
    } else {
      // If no country filter in the popup, match is true
      countryMatch = true;
    }

    // Show Ad if both department and country match
    if (departmentMatch && countryMatch) {
      if (ad.windowSize === "normal") {
        createAdWindow(ad, user);
      } else if (ad.windowSize === "full") {
        createFullAdWindow(ad, user);
      } else {
        createAdWindow(ad, user);
      }
    } else {
      console.log(
        "Ad will not be shown due to department or country mismatch."
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
}

export { initializeIpcHandlers };
