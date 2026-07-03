import request from 'supertest';
import app from '../index';
import type { GetPuzzleResponse, ValidatePuzzleResponse } from '@init-sudoku-post6/contracts';

describe('Puzzle Service API routes', () => {
  test('GET /puzzle returns a puzzle for each difficulty', async () => {
    const difficulties = ['easy', 'medium', 'hard'] as const;
    for (const diff of difficulties) {
      const res = await request(app).get('/puzzle').query({ difficulty: diff });
      expect(res.status).toBe(200);
      const body = res.body as GetPuzzleResponse;
      expect(body).toHaveProperty('puzzleId');
      expect(body).toHaveProperty('difficulty', diff);
      expect(body).toHaveProperty('board');
      expect(body.board.length).toBe(9);
      body.board.forEach((row: any) => expect(row.length).toBe(9));
    }
  });

  test('POST /validate correctly validates a solved puzzle', async () => {
    // First generate a puzzle
    const getRes = await request(app).get('/puzzle').query({ difficulty: 'easy' });
    const puzzle = getRes.body as GetPuzzleResponse;
    // Retrieve the stored solution by calling the internal service (not via API).
    // Since the service stores the solution in memory, we can import the generator to get it.
    // However, for this test we will simply solve the puzzle ourselves using the utility.
    // Import the solver dynamically.
    const { solveBoard } = await import('../utils/sudoku');
    const boardCopy = puzzle.board.map((row: any) => row.slice());
    const solved = solveBoard(boardCopy);
    expect(solved).toBe(true);

    const validateRes = await request(app)
      .post('/validate')
      .send({ puzzleId: puzzle.puzzleId, board: boardCopy });
    expect(validateRes.status).toBe(200);
    const body = validateRes.body as ValidatePuzzleResponse;
    expect(body).toHaveProperty('puzzleId', puzzle.puzzleId);
    expect(body).toHaveProperty('isValid', true);
  });
});
