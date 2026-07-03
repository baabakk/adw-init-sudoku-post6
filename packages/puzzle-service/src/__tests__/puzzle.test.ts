import { generatePuzzle } from "../services/puzzleGenerator";
import { isValidBoard } from "../utils/sudoku";

test('generatePuzzle returns a valid board with correct difficulty', () => {
  const difficulties = ['easy', 'medium', 'hard'] as const;
  difficulties.forEach((diff) => {
    const puzzle = generatePuzzle(diff);
    expect(puzzle).toHaveProperty('puzzleId');
    expect(puzzle).toHaveProperty('difficulty', diff);
    expect(puzzle).toHaveProperty('board');
    // Board should be a 9x9 array
    expect(puzzle.board.length).toBe(9);
    puzzle.board.forEach((row) => expect(row.length).toBe(9));
    // The board should be a valid Sudoku board (no rule violations)
    expect(isValidBoard(puzzle.board)).toBe(true);
  });
});
