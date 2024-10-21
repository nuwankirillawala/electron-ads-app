import crypto from "crypto";

// AES-256-CBC Encryption Algorithm
const algorithm = "aes-256-cbc";

// Create a 32-byte key using a SHA-256 hash of the secret key
const key = crypto
  .createHash("sha256")
  .update("ZeusPromi1234Athena5678DelphiHades") // Replace this with your actual secret key
  .digest("base64")
  .substr(0, 32);

/**
 * Encrypts a given text using AES-256-CBC algorithm.
 * @param {string} text - The plain text to encrypt.
 * @returns {string} - The encrypted text in the format 'iv:encrypted'.
 */
function encrypt(text) {
  const iv = crypto.randomBytes(16); // Generate a random 16-byte initialization vector (IV)
  const cipher = crypto.createCipheriv(algorithm, key, iv); // Create the cipher with the algorithm, key, and IV

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Return the IV and encrypted text separated by a colon
  return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts a given encrypted text using AES-256-CBC algorithm.
 * @param {string} text - The encrypted text in the format 'iv:encrypted'.
 * @returns {string} - The decrypted plain text.
 */
function decrypt(text) {
  const [ivHex, encrypted] = text.split(":"); // Split the IV and the encrypted text
  const iv = Buffer.from(ivHex, "hex"); // Convert the IV from hex to a Buffer
  const decipher = crypto.createDecipheriv(algorithm, key, iv); // Create the decipher with the algorithm, key, and IV

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export { encrypt, decrypt };
