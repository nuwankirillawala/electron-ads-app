import { app } from "electron";
import fs from "fs";
import path from "path";
import { encrypt, decrypt } from "./encryption.js";
const userDataPath = path.join(app.getPath("userData"), "user_data.json");

async function saveUserData(user) {
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

export { saveUserData, loadUserData, clearUserData };
