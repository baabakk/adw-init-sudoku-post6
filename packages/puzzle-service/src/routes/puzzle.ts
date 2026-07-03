import { Router, Request, Response } from "express";
import { generatePuzzle } from "../services/puzzleGenerator";
import type { Difficulty } from "@init-sudoku-post6/contracts";

const router = Router();

/** GET /puzzle?difficulty=easy|medium|hard */
router.get("/puzzle", (req: Request, res: Response) => {
  const difficultyParam = req.query.difficulty as string | undefined;
  if (!difficultyParam) {
    return res.status(400).json({ error: "Missing difficulty query parameter." });
  }
  const difficulty = difficultyParam as Difficulty;
  if (!["easy", "medium", "hard"].includes(difficulty)) {
    return res.status(400).json({ error: "Invalid difficulty. Must be one of easy, medium, hard." });
  }
  const puzzle = generatePuzzle(difficulty);
  return res.json(puzzle);
});

export default router;
