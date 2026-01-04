import express from "express";
import prisma from "../prisma/client.js";
import { authMiddleware } from "../middleware/auth.js";
import { randomBytes } from "crypto";

const router = express.Router();

// ✅ PUBLIC ROUTES FIRST (before generic /:id routes)

// ✅ Get public notes for a specific video
router.get("/public/video/:videoId", async (req, res) => {
  const videoId = parseInt(req.params.videoId);
  if (isNaN(videoId)) return res.status(400).json({ error: "Invalid videoId" });

  try {
    console.log(`Fetching public notes for videoId: ${videoId}`);
    const notes = await prisma.note.findMany({
      where: { videoId, isPublic: true },
      include: { user: { select: { username: true } } },
      orderBy: { rating: "desc" },
    });

    console.log(`Found ${notes.length} public notes for videoId: ${videoId}`);
    res.json(notes);
  } catch (err) {
    console.error("Error fetching public notes - Details:", err.message);
    console.error("Full error:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch public notes", details: err.message });
  }
});

// ✅ Public route to view shared note
router.get("/public/:shareId", async (req, res) => {
  try {
    const { shareId } = req.params;
    if (!shareId) return res.status(400).json({ error: "Invalid shareId" });

    const note = await prisma.note.findUnique({
      where: { shareId },
      include: { user: true, video: { include: { course: true } } },
    });

    if (!note || !note.shared)
      return res.status(404).json({ error: "Note not found or not shared" });

    res.json({
      content: note.content,
      courseTitle: note.video?.course?.title || null,
      user: note.user?.username || null,
    });
  } catch (err) {
    console.error("Error fetching shared note:", err);
    res.status(500).json({ error: "Failed to fetch shared note" });
  }
});

// ✅ PROTECTED ROUTES (require authentication)

// ✅ Create a note
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { videoId, content } = req.body;
    console.log(
      `Creating note: videoId=${videoId}, userId=${req.userId}, content length=${content?.length}`
    );
    const note = await prisma.note.create({
      data: {
        content,
        videoId,
        userId: req.userId,
      },
    });
    console.log(`Note created successfully with id: ${note.id}`);
    res.json(note);
  } catch (err) {
    console.error("Error creating note - Details:", err.message);
    console.error("Full error:", err);
    res
      .status(500)
      .json({ error: "Failed to create note", details: err.message });
  }
});

// ✅ Get all notes for a user
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

// ✅ Convert a private note to public and get AI rating
router.post("/make-public/:id", authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid note id" });
  }

  try {
    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (note.userId !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Make note public with a default rating (no external API calls)
    const rating = 4.0; // Default rating for public notes

    const updated = await prisma.note.update({
      where: { id },
      data: { isPublic: true, rating },
    });

    res.json({
      message: "Note made public successfully",
      note: updated,
    });
  } catch (err) {
    console.error(`[ERROR] Failed to make note public:`, err.message);
    res.status(500).json({ error: "Failed to make note public" });
  }
});

// ✅ Generate a shareable link for a note
router.post("/share/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid note id" });

    const note = await prisma.note.findUnique({ where: { id } });
    if (!note) return res.status(404).json({ error: "Note not found" });
    if (note.userId !== req.userId)
      return res.status(403).json({ error: "Not authorized" });

    const shareId = randomBytes(8).toString("hex");

    const updated = await prisma.note.update({
      where: { id },
      data: { shared: true, shareId },
    });

    res.json({
      message: "Note shared successfully!",
      shareUrl: `http://localhost:3000/shared/${shareId}`,
    });
  } catch (err) {
    console.error("Error sharing note:", err);
    res.status(500).json({ error: "Failed to share note" });
  }
});

// ✅ Get notes for a specific video
router.get("/:videoId", authMiddleware, async (req, res) => {
  try {
    const videoId = parseInt(req.params.videoId);
    if (isNaN(videoId))
      return res.status(400).json({ error: "Invalid videoId" });

    console.log(
      `Fetching notes for videoId: ${videoId}, userId: ${req.userId}`
    );
    const notes = await prisma.note.findMany({
      where: { videoId, userId: req.userId },
      orderBy: { id: "desc" },
    });
    console.log(`Found ${notes.length} notes for videoId: ${videoId}`);
    res.json(notes);
  } catch (err) {
    console.error("Error fetching video notes - Details:", err.message);
    console.error("Full error:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch notes", details: err.message });
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
