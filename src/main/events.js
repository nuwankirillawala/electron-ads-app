const { app, BrowserWindow } = require("electron");

function registerAppEvents() {
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
}

module.exports = {
  registerAppEvents,
};
