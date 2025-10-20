import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = express.Router();

// ✅ Get all quiz questions for a course
router.get("/:courseId", async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const quizzes = await prisma.quiz.findMany({ where: { courseId } });

  // Format options for frontend
  const formatted = quizzes.map((q) => ({
    id: q.id,
    question: q.question,
    options: [
      { key: "A", text: q.optionA },
      { key: "B", text: q.optionB },
      { key: "C", text: q.optionC },
      { key: "D", text: q.optionD },
    ],
    answer: q.answer,
  }));

  res.json(formatted);
});

// ✅ Submit quiz answers and calculate score
router.post("/submit", authMiddleware, async (req, res) => {
  const { courseId, answers } = req.body; // [{id: quizId, answer: "A"}]
  const quizzes = await prisma.quiz.findMany({ where: { courseId } });

  let correct = 0;
  quizzes.forEach((q) => {
    const userAnswer = answers.find((a) => a.id === q.id);
    if (userAnswer && userAnswer.answer === q.answer) correct++;
  });

  const score = await prisma.score.create({
    data: {
      userId: req.userId,
      courseId,
      score: correct,
    },
  });

  res.json({ message: "Quiz submitted", score: correct });
});

export default router;
