import { app } from "electron";
import fs from "fs";
import path from "path";
import { encrypt, decrypt } from "./encryption.js";

// Path where the user data will be stored
const userDataPath = path.join(app.getPath("userData"), "user_data.json");

/**
 * Saves encrypted user data to a file.
 * @param {Object} user - The user data object to save.
 */
async function saveUserData(user) {
  try {
    // Encrypt the user data
    const userData = encrypt(JSON.stringify(user));
    // Write the encrypted data to the file
    fs.writeFileSync(userDataPath, userData, "utf8");
    console.log("User data saved successfully.");
  } catch (error) {
    console.error("Error saving user data:", error);
  }
}

/**
 * Loads and decrypts user data from the file.
 * @returns {Object|null} - The decrypted user data object, or null if an error occurs or no data is found.
 */
function loadUserData() {
  // Check if the user data file exists
  if (fs.existsSync(userDataPath)) {
    try {
      // Read the encrypted data from the file
      const encryptedData = fs.readFileSync(userDataPath, "utf8");
      // Decrypt the data and parse it as JSON
      return JSON.parse(decrypt(encryptedData));
    } catch (error) {
      console.error("Error decrypting user data:", error);
      // Clear corrupted or unreadable data
      clearUserData();
      return null;
    }
  }
  // Return null if no data file exists
  return null;
}

/**
 * Clears user data by deleting the file if it exists.
 */
function clearUserData() {
  // Check if the user data file exists
  if (fs.existsSync(userDataPath)) {
    try {
      // Delete the user data file
      fs.unlinkSync(userDataPath);
      console.log("User data cleared successfully.");
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  }
}

export { saveUserData, loadUserData, clearUserData };
