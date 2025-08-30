import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ✅ Get all courses
app.get("/courses", async (req, res) => {
  const courses = await prisma.course.findMany();
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

// ✅ Save a note
app.post("/notes", async (req, res) => {
  const { userId, videoId, content } = req.body;
  const note = await prisma.note.create({
    data: { userId, videoId, content },
  });
  res.json(note);
});

// ✅ Get notes for a video
app.get("/notes/:videoId", async (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const notes = await prisma.note.findMany({
    where: { videoId },
    include: { user: true },
  });
  res.json(notes);
});

app.listen(4000, () =>
  console.log("🚀 Server running on http://localhost:4000")
);
