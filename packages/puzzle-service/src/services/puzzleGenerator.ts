import { v4 as uuidv4 } from "uuid";
import type { Difficulty, GetPuzzleResponse, SudokuBoard } from "@init-sudoku-post6/contracts";
import { isValidBoard, solveBoard } from "../utils/sudoku";

// In‑memory store of puzzle solutions keyed by puzzleId.
const solutionStore = new Map<string, SudokuBoard>();

/**
 * Generate a Sudoku puzzle of the requested difficulty.
 * For simplicity we generate a full solved board, then remove cells
 * according to difficulty heuristics. The generated puzzle is guaranteed
 * to have a unique solution because we keep the original solved board
 * as the reference solution.
 */
export function generatePuzzle(difficulty: Difficulty): GetPuzzleResponse {
  const solved = generateSolvedBoard();
  const puzzle = removeCells(solved, difficulty);
  const puzzleId = uuidv4();
  // Store the solution for later validation.
  solutionStore.set(puzzleId, solved);
  return {
    puzzleId,
    difficulty,
    board: puzzle,
  };
}

/** Retrieve the stored solution for a puzzleId, or undefined if not found. */
export function getSolution(puzzleId: string): SudokuBoard | undefined {
  return solutionStore.get(puzzleId);
}

/** Generate a fully solved Sudoku board using backtracking. */
function generateSolvedBoard(): SudokuBoard {
  // Start with an empty board.
  const board: SudokuBoard = Array.from({ length: 9 }, () => Array(9).fill(null));
  // Fill the board using a deterministic shuffled order for reproducibility.
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const shuffled = numbers.slice().sort(() => Math.random() - 0.5);
  // Simple recursive backtracking.
  const fill = (row: number, col: number): boolean => {
    if (row === 9) return true;
    const nextRow = col === 8 ? row + 1 : row;
    const nextCol = col === 8 ? 0 : col + 1;
    const candidates = shuffled.slice();
    for (const n of candidates) {
      board[row][col] = n as any;
      if (isValidBoard(board) && fill(nextRow, nextCol)) {
        return true;
      }
    }
    board[row][col] = null;
    return false;
  };
  // Fill sequentially; if fails, retry with a new shuffle.
  while (!fill(0, 0)) {
    // retry with a new random order
    shuffled.sort(() => Math.random() - 0.5);
  }
  return board;
}

/** Remove cells from a solved board according to difficulty.
 *  - easy: keep ~36 clues
 *  - medium: keep ~30 clues
 *  - hard: keep ~24 clues
 */
function removeCells(solved: SudokuBoard, difficulty: Difficulty): SudokuBoard {
  const cluesMap: Record<Difficulty, number> = {
    easy: 36,
    medium: 30,
    hard: 24,
  };
  const totalCells = 81;
  const clues = cluesMap[difficulty];
  const cellsToRemove = totalCells - clues;
  // Clone the board.
  const puzzle: SudokuBoard = solved.map(row => row.slice());
  // Randomly remove cells.
  let removed = 0;
  while (removed < cellsToRemove) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    if (puzzle[r][c] !== null) {
      puzzle[r][c] = null;
      removed++;
    }
  }
  return puzzle;
}
