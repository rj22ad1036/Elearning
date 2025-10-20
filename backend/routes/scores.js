import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get logged-in user’s scores
router.get("/me", authMiddleware, async (req, res) => {
  const scores = await prisma.score.findMany({
    where: { userId: req.userId },
    include: { course: true },
  });
  res.json(scores);
});

// Get leaderboard for a course
router.get("/leaderboard/:courseId", async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const leaderboard = await prisma.score.findMany({
    where: { courseId },
    include: { user: true },
    orderBy: { score: "desc" },
    take: 5,
  });
  res.json(leaderboard);
});

export default router;
