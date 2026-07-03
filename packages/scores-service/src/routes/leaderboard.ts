import { Router, Request, Response } from 'express';
import type { GetLeaderboardRequest, GetLeaderboardResponse, Difficulty } from '@init-sudoku-post6/contracts';
import { scoreDb } from '../db';

const router = Router();

/**
 * GET /leaderboard – retrieve top 10 scores for a given difficulty.
 * Query parameter `difficulty` must be one of the allowed values.
 */
router.get('/', (req: Request<{}, {}, {}, GetLeaderboardRequest>, res: Response<GetLeaderboardResponse>) => {
  const { difficulty } = req.query;

  // Validate difficulty parameter.
  const allowedDifficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  if (!difficulty || !allowedDifficulties.includes(difficulty as Difficulty)) {
    return res.status(400).json({
      difficulty: difficulty as Difficulty,
      entries: [],
    } as GetLeaderboardResponse);
  }

  const entries = scoreDb.getTopScores(difficulty as Difficulty);
  const response: GetLeaderboardResponse = {
    difficulty: difficulty as Difficulty,
    entries,
  };
  res.json(response);
});

export default router;
