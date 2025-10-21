import jwt from "jsonwebtoken";
import crypto from "crypto";

// Function to create a JWT token and then encrypt it
export function generateEncryptedToken(payload, jwtSecret, encryptKey, expiresIn = "1h") {
  // First, create a JWT token with the payload and expiry
  const token = jwt.sign(payload, jwtSecret, { expiresIn });

  // Prepare the encryption key: SHA-256 hash of the secret
  const key = crypto.createHash("sha256").update(encryptKey).digest("base64").substring(0, 32);

  // Initialization vector for AES-256-CBC (just using zeros)
  const iv = Buffer.alloc(16, 0);

  // Create the cipher and encrypt the token
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
}

// Function to decrypt a token and verify the JWT
export function decryptToken(encryptedToken, jwtSecret, encryptKey) {
  // Prepare the decryption key same way as encryption
  const key = crypto.createHash("sha256").update(encryptKey).digest("base64").substring(0, 32);
  const iv = Buffer.alloc(16, 0);

  // Create decipher to decrypt the token
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedToken, "hex", "utf8");
  decrypted += decipher.final("utf8");

  // Verify the decrypted JWT and return the payload
  return jwt.verify(decrypted, jwtSecret);
}
