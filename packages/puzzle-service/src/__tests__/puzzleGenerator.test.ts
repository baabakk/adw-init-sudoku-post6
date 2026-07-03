import { generatePuzzle, getSolution } from '../services/puzzleGenerator';
import { solveBoard, isValidBoard } from '../utils/sudoku';
import type { Difficulty } from '@init-sudoku-post6/contracts';

test('generatePuzzle creates a solvable puzzle and stores solution', () => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  difficulties.forEach((diff) => {
    const puzzle = generatePuzzle(diff);
    expect(puzzle).toHaveProperty('puzzleId');
    expect(puzzle).toHaveProperty('difficulty', diff);
    expect(puzzle).toHaveProperty('board');
    // Ensure stored solution can solve the puzzle
    const solution = getSolution(puzzle.puzzleId);
    expect(solution).toBeDefined();
    // Copy puzzle board and solve it
    const boardCopy = puzzle.board.map((row) => row.slice());
    const solved = solveBoard(boardCopy);
    expect(solved).toBe(true);
    // The solved board should match the stored solution
    expect(boardCopy).toEqual(solution);
    // The puzzle board should be a valid board (no rule violations)
    expect(isValidBoard(puzzle.board)).toBe(true);
  });
});
