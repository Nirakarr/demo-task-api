import {decryptToken} from "../utils/tokenUtils.js";

export const authRequired = (req, res, next) => {
  try {
    const encryptedToken = req.cookies?.auth_token || req.headers["authorization"]?.split(" ")[1];
    if (!encryptedToken) return res.status(401).json({ message: "Unauthorized" });

    const payload = decryptToken(encryptedToken, process.env.JWT_SECRET, process.env.ENCRYPT_SECRET_KEY);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token Not Found.", error: error.message });
  }
};