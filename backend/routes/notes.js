import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// ✅ Create a note
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { videoId, content } = req.body;
    const note = await prisma.note.create({
      data: {
        content,
        videoId,
        userId: req.userId,
      },
    });
    res.json(note);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ error: "Failed to create note" });
  }
});

// ✅ Get all notes for a user (placed before /:videoId)
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.userId },
      orderBy: { id: "desc" },
    });
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// ✅ Get notes for a specific video
router.get("/:videoId", authMiddleware, async (req, res) => {
  try {
    const videoId = parseInt(req.params.videoId);
    if (isNaN(videoId))
      return res.status(400).json({ error: "Invalid videoId" });

    const notes = await prisma.note.findMany({
      where: { videoId, userId: req.userId },
      orderBy: { id: "desc" },
    });
    res.json(notes);
  } catch (err) {
    console.error("Error fetching video notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// ✅ Update a note
router.put("/:noteId", authMiddleware, async (req, res) => {
  try {
    const noteId = parseInt(req.params.noteId);
    const { content } = req.body;

    if (isNaN(noteId)) return res.status(400).json({ error: "Invalid noteId" });

    if (!content.trim())
      return res.status(400).json({ error: "Content cannot be empty" });

    const note = await prisma.note.update({
      where: {
        id: noteId,
        userId: req.userId, // Ensure user owns the note
      },
      data: { content },
    });
    res.json(note);
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ error: "Failed to update note" });
  }
});

// ✅ Delete a note
router.delete("/:noteId", authMiddleware, async (req, res) => {
  try {
    const noteId = parseInt(req.params.noteId);

    if (isNaN(noteId)) return res.status(400).json({ error: "Invalid noteId" });

    await prisma.note.delete({
      where: {
        id: noteId,
        userId: req.userId, // Ensure user owns the note
      },
    });
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

export default router;
