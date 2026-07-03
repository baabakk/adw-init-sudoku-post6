import { v4 as uuidv4 } from "uuid";
import type { Difficulty, GetPuzzleResponse, SudokuBoard } from "@init-sudoku-post6/contracts";
import { createPuzzleFromFull, generateFullBoard } from "../utils/sudoku";

/** Mapping of difficulty to number of clues (filled cells) in the puzzle. */
const cluesByDifficulty: Record<Difficulty, number> = {
  easy: 36,
  medium: 32,
  hard: 28,
};

/** In‑memory store of puzzle solutions keyed by puzzleId. */
const solutionStore = new Map<string, SudokuBoard>();

/** Generate a Sudoku puzzle for the given difficulty.
 * Returns the puzzleId and the puzzle board (with empty cells as null).
 */
export function generatePuzzle(difficulty: Difficulty): GetPuzzleResponse {
  const clues = cluesByDifficulty[difficulty];
  // Generate a full solved board.
  const fullBoard = generateFullBoard();
  // Derive a puzzle with the desired number of clues while preserving uniqueness.
  const puzzleBoard = createPuzzleFromFull(fullBoard, clues);
  const puzzleId = uuidv4();
  // Store the solution for later validation.
  solutionStore.set(puzzleId, fullBoard);
  return {
    puzzleId,
    difficulty,
    board: puzzleBoard,
  };
}

/** Retrieve the stored solution board for a puzzleId. Returns undefined if not found. */
export function getSolution(puzzleId: string): SudokuBoard | undefined {
  return solutionStore.get(puzzleId);
}
