import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.js";
import { authMiddleware } from "./middleware/auth.js";
import quizRoutes from "./routes/quiz.js";
import scoreRoutes from "./routes/scores.js";
import notesRoutes from "./routes/notes.js";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Auth routes
app.use("/auth", authRoutes);

// Quiz routes
app.use("/quiz", quizRoutes);

// Notes routes
app.use("/notes", notesRoutes);
// Score routes
app.use("/scores", scoreRoutes);

// Test route to check if server is working
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// ✅ Get all courses
app.get("/courses", async (req, res) => {
  const courses = await prisma.course.findMany({
    include: { videos: true },
  });
  res.json(courses);
});

// ✅ Get course with videos
app.get("/courses/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const course = await prisma.course.findUnique({
    where: { id },
    include: { videos: true },
  });
  res.json(course);
});
// // Protected: Save note
// app.post("/notes", authMiddleware, async (req, res) => {
//   const { videoId, content } = req.body;
//   const note = await prisma.note.create({
//     data: { userId: req.userId, videoId, content },
//   });
//   res.json(note);
// });

// // Protected: Get notes for a video
// app.get("/notes/:videoId", authMiddleware, async (req, res) => {
//   const videoId = parseInt(req.params.videoId);
//   const notes = await prisma.note.findMany({
//     where: { videoId, userId: req.userId },
//   });
//   res.json(notes);
// });

// // Protected: Get all notes for a user
// app.get("/notes/all", authMiddleware, async (req, res) => {
//   const notes = await prisma.note.findMany({
//     where: { userId: req.userId },
//   });
//   res.json(notes);
// });
// Protected: Get user's quiz scores
app.get("/profile/scores", authMiddleware, async (req, res) => {
  const scores = await prisma.score.findMany({
    where: { userId: req.userId },
  });
  res.json(scores);
});

app.listen(4000, () =>
  console.log("🚀 Server running on http://localhost:4000")
);
// Score routes
app.use("/scores", scoreRoutes);
