import AutoLaunch from "auto-launch";
import { app } from "electron";

function setupAutoLaunch() {
  const appAutoLauncher = new AutoLaunch({
    name: "QuantumHRApp",
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

export { setupAutoLaunch };
