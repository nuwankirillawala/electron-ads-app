import { ipcMain, app, Notification } from "electron";
import { saveUserData, clearUserData, loadUserData } from "./userData.js";
import { createAdWindow, createFullAdWindow } from "./windows.js";

// State Variables
let isMutedPopups = false;
let runInBackground = false;
let popupQueue = [];
const MAX_QUEUE_SIZE = 5;
let pauseTimer = null;

/**
 * Initialize IPC Handlers
 * This function sets up all IPC communication between the Electron main process
 * and the renderer process (React).
 */
function initializeIpcHandlers(mainWindow) {
  /**
   * Function to emit the current popup queue to the renderer
   */
  const emitQueueUpdate = () => {
    mainWindow.webContents.send("popup-queue-updated", popupQueue);
  };

  /**
   * Handle setting pause duration for popups
   * Sets up reminders for when the pause period is nearing its end.
   */
  ipcMain.on("set-pause-duration", (event, minutes) => {
    // Clear any existing pause timers
    if (pauseTimer) {
      clearTimeout(pauseTimer);
    }

    const pauseEndTime = Date.now() + minutes * 60 * 1000;

    // Set reminders: 5 minutes and 1 minute before the pause ends
    const reminderTime5Min = pauseEndTime - 5 * 60 * 1000;
    const reminderTime1Min = pauseEndTime - 1 * 60 * 1000;

    if (reminderTime5Min > Date.now()) {
      setTimeout(() => {
        showReminderNotification("Popup pause ending in 5 minutes.");
      }, reminderTime5Min - Date.now());
    }

    if (reminderTime1Min > Date.now()) {
      setTimeout(() => {
        showReminderNotification("Popup pause ending in 1 minute.");
      }, reminderTime1Min - Date.now());
    }
  });

  /**
   * Function to show a reminder notification
   * @param {string} message - The message to display in the notification
   */
  const showReminderNotification = (message) => {
    new Notification({
      title: "QuantumHR Notify - Popup Reminder",
      body: message,
      silent: false,
    }).show();
  };

  /**
   * Handle showing ads and managing the popup queue
   */
  ipcMain.on("show-ad", (event, ad, user, state) => {
    if (!user || !user.token || !user.profile) {
      console.log("User is not logged in. Popup will not be shown.");
      return;
    }

    // Check user department and timezone for ad eligibility
    const userDepartmentId = user.profile.department._id;
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const popupDepartments = ad.departments || [];
    const popupTimeZone = ad.timezone || null;

    const departmentMatch =
      popupDepartments.length === 0 ||
      popupDepartments.includes(userDepartmentId);
    const countryMatch = !popupTimeZone || userTimeZone === popupTimeZone;

    // Show or queue the popup if conditions match
    if (departmentMatch && countryMatch) {
      if (popupQueue.length >= MAX_QUEUE_SIZE) {
        popupQueue.shift(); // Remove the oldest popup to maintain queue size
      }

      if (state === "new" || state === null) {
        popupQueue.push({ ad, user });
      }

      // Emit queue update to the renderer
      emitQueueUpdate();

      if (!isMutedPopups) {
        console.log(
          "Popup displayed and stored in the queue. Queue length:",
          popupQueue.length
        );

        // Display the ad based on window size
        if (ad.windowSize === "normal") {
          createAdWindow(ad, user, runInBackground);
        } else if (ad.windowSize === "full") {
          createFullAdWindow(ad, user, runInBackground);
        } else {
          createAdWindow(ad, user, runInBackground);
        }
      } else {
        console.log(
          "Popup stored in the queue. Queue length:",
          popupQueue.length
        );
      }
    } else {
      console.log(
        "Popup will not be shown due to department or timezone mismatch."
      );
    }
  });

  /**
   * IPC Handler for retrieving the popup queue
   */
  ipcMain.handle("get-popup-queue", () => {
    return popupQueue;
  });

  // Window Controls
  /**
   * Handle window minimize action
   */
  ipcMain.on("minimize-window", () => {
    mainWindow.minimize();
  });

  /**
   * Handle window close action
   */
  ipcMain.on("close-window", () => {
    app.quit();
  });

  // User Data Management
  /**
   * Save user data
   */
  ipcMain.on("save-user-data", (event, user) => {
    saveUserData(user);
  });

  /**
   * Clear user data
   */
  ipcMain.on("clear-user-data", () => {
    clearUserData();
  });

  // Update Mute and Background States
  /**
   * Update the mute status for popups
   */
  ipcMain.on("update-mute-status", (event, isMuted) => {
    console.log("Mute status:", isMuted);
    isMutedPopups = isMuted;
  });

  /**
   * Update the background running status of the app
   */
  ipcMain.on("update-run-in-background", (event, runInBg) => {
    console.log("Run in background status:", runInBg);
    runInBackground = runInBg;
  });

  // Auto-login Logic
  const savedUser = loadUserData();
  if (savedUser) {
    mainWindow.webContents.on("did-finish-load", () => {
      mainWindow.webContents.send("auto-login", savedUser);
    });
  }
}

export { initializeIpcHandlers };
