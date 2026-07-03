import { validateBoard } from '../services/boardValidator';
import { generatePuzzle, getSolution } from '../services/puzzleGenerator';
import type { Difficulty } from '@init-sudoku-post6/contracts';

test('validateBoard returns valid for correct solution', () => {
  const diff: Difficulty = 'easy';
  const puzzle = generatePuzzle(diff);
  const solution = getSolution(puzzle.puzzleId);
  expect(solution).toBeDefined();
  const result = validateBoard(puzzle.puzzleId, solution!);
  expect(result.isValid).toBe(true);
  expect(result.errors).toHaveLength(0);
});

test('validateBoard returns invalid for incorrect board', () => {
  const diff: Difficulty = 'easy';
  const puzzle = generatePuzzle(diff);
  const solution = getSolution(puzzle.puzzleId);
  expect(solution).toBeDefined();
  // Modify a cell to be incorrect
  const badBoard = solution!.map(row => row.slice());
  badBoard[0][0] = (badBoard[0][0] ?? 0) % 9 + 1; // change value
  const result = validateBoard(puzzle.puzzleId, badBoard);
  expect(result.isValid).toBe(false);
  expect(result.errors.length).toBeGreaterThan(0);
});
