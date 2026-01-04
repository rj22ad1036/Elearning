import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

const router = express.Router();

const JWT_SECRET = "super_secret_key"; // 🔴 replace with env var in production

// ✅ Signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body; // Changed from username to name

    // Validate input
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Email, password, and name are required" });
    }

    // check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "User already exists" });

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create user
    const user = await prisma.user.create({
      data: { email, password: hashed, username: name }, // Map name to username
    });

    res.json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error during signup" });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    // generate JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return token and user data (without password)
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.username || user.email.split("@")[0],
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error during login" });
  }
});

export default router;
