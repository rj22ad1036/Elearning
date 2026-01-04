import express from "express";
import cors from "cors";
import prisma from "./prisma/client.js";
import authRoutes from "./routes/auth.js";
import { authMiddleware } from "./middleware/auth.js";
import quizRoutes from "./routes/quiz.js";
import scoreRoutes from "./routes/scores.js";
import notesRoutes from "./routes/notes.js";

const app = express();

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
  try {
    const courses = await prisma.course.findMany({
      include: { videos: true },
    });
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// ✅ Get course with videos
app.get("/courses/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const course = await prisma.course.findUnique({
      where: { id },
      include: { videos: true },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

// Protected: Get user's quiz scores
app.get("/profile/scores", authMiddleware, async (req, res) => {
  try {
    const scores = await prisma.score.findMany({
      where: { userId: req.userId },
    });
    res.json(scores);
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ error: "Failed to fetch scores" });
  }
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("\n[GLOBAL ERROR HANDLER]");
  console.error("  Method:", req.method);
  console.error("  URL:", req.url);
  console.error("  Message:", error.message);
  console.error("  Stack:", error.stack);
  res
    .status(500)
    .json({ error: "Internal server error", details: error.message });
});

app.listen(4000, () =>
  console.log("🚀 Server running on http://localhost:4000")
);
