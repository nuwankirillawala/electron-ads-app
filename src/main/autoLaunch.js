import AutoLaunch from "auto-launch";
import { app } from "electron";

/**
 * Sets up auto-launch for the application.
 * This ensures that the app starts automatically when the system boots.
 */
function setupAutoLaunch() {
  // Create an instance of AutoLaunch with the application details
  const appAutoLauncher = new AutoLaunch({
    name: "QuantumHRApp", // Name of the application
    path: app.getPath("exe"), // Path to the application executable
  });

  // Check if auto-launch is already enabled
  appAutoLauncher
    .isEnabled()
    .then((isEnabled) => {
      if (!isEnabled) {
        // Enable auto-launch if it is not already enabled
        appAutoLauncher
          .enable()
          .then(() => {
            console.log("Auto-launch enabled successfully.");
          })
          .catch((err) => {
            console.error("Error enabling auto-launch:", err);
          });
      } else {
        console.log("Auto-launch is already enabled.");
      }
    })
    .catch((err) => {
      console.error("Auto-launch check error:", err);
    });
}

export { setupAutoLaunch };
