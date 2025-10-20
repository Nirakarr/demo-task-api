import bcrypt from "bcryptjs";
import pool from "../database/connect_db.js";
import generateEncryptedToken from "../utils/tokenUtils.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req?.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult?.rows?.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });
    const user = userResult?.rows[0];
    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // create JWT and encrypt it using ENCRYPT_SECRET_KEY in env
    const encryptedToken = generateEncryptedToken(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      process.env.ENCRYPT_SECRET_KEY
    );

    // Store encrypted JWT in cookie
    res.cookie("auth_token", encryptedToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
