import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = "super_secret_key"; // 🔴 replace with env var in production

// ✅ Signup
router.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;

  // check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: "User already exists" });

  // hash password
  const hashed = await bcrypt.hash(password, 10);

  // create user
  const user = await prisma.user.create({
    data: { email, password: hashed, username },
  });

  res.json({ message: "User created successfully" });
});

// ✅ Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid credentials" });

  // generate JWT
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

  res.json({ token });
});

export default router;
