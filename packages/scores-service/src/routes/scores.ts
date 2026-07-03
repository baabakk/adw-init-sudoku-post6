import { Router, Request, Response } from 'express';
import type { SubmitScoreRequest, SubmitScoreResponse, Difficulty } from '@init-sudoku-post6/contracts';
import { scoreDb } from '../db';

const router = Router();

/**
 * POST /scores – store a completed game result.
 * Expected body conforms to SubmitScoreRequest.
 */
router.post('/', (req: Request<{}, {}, SubmitScoreRequest>, res: Response<SubmitScoreResponse>) => {
  const { puzzleId, playerName, difficulty, timeTakenMs } = req.body;

  // Basic validation – ensure required fields are present and of correct type.
  if (!puzzleId || !playerName || !difficulty || typeof timeTakenMs !== 'number') {
    return res.status(400).json({
      success: false,
      message: 'Invalid request payload. All fields are required.',
    });
  }

  // Ensure difficulty matches the contract type (runtime check).
  const allowedDifficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  if (!allowedDifficulties.includes(difficulty)) {
    return res.status(400).json({
      success: false,
      message: `Invalid difficulty. Must be one of ${allowedDifficulties.join(', ')}`,
    });
  }

  const achievedAt = new Date().toISOString();
  const scoreId = scoreDb.insertScore({
    playerName,
    difficulty,
    timeTakenMs,
    achievedAt,
  });

  const response: SubmitScoreResponse = {
    success: true,
    scoreId: String(scoreId),
  };
  res.json(response);
});

export default router;
