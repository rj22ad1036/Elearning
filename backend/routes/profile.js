// import express from "express";
// import { PrismaClient } from "@prisma/client";
// import authMiddleware from "../middleware/auth.js";

// const prisma = new PrismaClient();
// const router = express.Router();

// // ✅ Fetch user quiz scores
// router.get("/scores", authMiddleware, async (req, res) => {
//   const scores = await prisma.score.findMany({
//     where: { userId: req.userId },
//     include: { course: true },
//   });
//   res.json(scores);
// });

// export default router;
