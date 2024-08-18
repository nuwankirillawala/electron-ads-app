const { Tray, Menu } = require("electron");
const path = require("path");

let tray;

function initializeTray(mainWindow) {
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
  tray.setToolTip("YourAppName");
  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    mainWindow.show();
  });
}

module.exports = {
  initializeTray,
};
