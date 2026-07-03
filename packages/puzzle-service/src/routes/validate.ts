import { Router, Request, Response } from "express";
import type { ValidatePuzzleRequest, ValidatePuzzleResponse } from "../../contracts/src/index";
import { validateBoard } from "../services/boardValidator";

const router = Router();

/** POST /validate */
router.post("/validate", (req: Request, res: Response) => {
  const body = req.body as ValidatePuzzleRequest;
  if (!body || typeof body.puzzleId !== "string" || !Array.isArray(body.board)) {
    return res.status(400).json({ error: "Invalid request payload." });
  }
  const { puzzleId, board } = body;
  const result = validateBoard(puzzleId, board);
  const response: ValidatePuzzleResponse = {
    puzzleId,
    isValid: result.isValid,
    ...(result.errors.length > 0 ? { errors: result.errors } : {}),
  };
  return res.json(response);
});

export default router;
