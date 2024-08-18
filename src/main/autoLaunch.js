const AutoLaunch = require("auto-launch");

function setupAutoLaunch() {
  const appAutoLauncher = new AutoLaunch({
    name: "YourAppName",
    path: app.getPath("exe"),
  });

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
}

module.exports = {
  setupAutoLaunch,
};
