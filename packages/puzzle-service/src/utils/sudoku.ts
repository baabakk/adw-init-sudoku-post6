/**
 * Sudoku utility functions: validation, solving, and board generation helpers.
 * These functions operate on the `SudokuBoard` type defined in the shared contracts.
 */
import type { SudokuBoard, SudokuCell } from "@init-sudoku-post6/contracts";

/** Check if an array of 9 cells contains duplicate numbers (ignoring null). */
function hasDuplicates(cells: SudokuCell[]): boolean {
  const seen = new Set<number>();
  for (const cell of cells) {
    if (cell === null) continue;
    if (seen.has(cell)) return true;
    seen.add(cell);
  }
  return false;
}

/** Validate that a board respects Sudoku rules (rows, columns, 3×3 boxes). */
export function isValidBoard(board: SudokuBoard): boolean {
  // Rows
  for (const row of board) {
    if (hasDuplicates(row)) return false;
  }
  // Columns
  for (let col = 0; col < 9; col++) {
    const column: SudokuCell[] = [];
    for (let row = 0; row < 9; row++) column.push(board[row][col]);
    if (hasDuplicates(column)) return false;
  }
  // Boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const box: SudokuCell[] = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          box.push(board[boxRow * 3 + r][boxCol * 3 + c]);
        }
      }
      if (hasDuplicates(box)) return false;
    }
  }
  return true;
}

/** Find the next empty cell coordinates; returns null if board is full. */
function findEmpty(board: SudokuBoard): [number, number] | null {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === null) return [r, c];
    }
  }
  return null;
}

/** Return a shuffled copy of numbers 1‑9. */
function shuffledNumbers(): number[] {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  return nums;
}

/** Solve the board in‑place using backtracking. Returns true if solved. */
export function solveBoard(board: SudokuBoard): boolean {
  const empty = findEmpty(board);
  if (!empty) return true; // solved
  const [row, col] = empty;
  for (const num of shuffledNumbers()) {
    board[row][col] = num;
    if (isValidBoard(board) && solveBoard(board)) {
      return true;
    }
    board[row][col] = null;
  }
  return false;
}

/** Count the number of possible solutions for a board, up to a limit. */
export function countSolutions(board: SudokuBoard, limit = 2): number {
  const empty = findEmpty(board);
  if (!empty) return 1; // a complete valid board counts as one solution
  const [row, col] = empty;
  let count = 0;
  for (let num = 1; num <= 9; num++) {
    board[row][col] = num as SudokuCell;
    if (isValidBoard(board)) {
      const subCount = countSolutions(board, limit - count);
      count += subCount;
      if (count >= limit) {
        board[row][col] = null;
        return count;
      }
    }
    board[row][col] = null;
  }
  return count;
}

/** Generate a completely filled, valid Sudoku board. */
export function generateFullBoard(): SudokuBoard {
  const board: SudokuBoard = Array.from({ length: 9 }, () => Array(9).fill(null));
  // Use solveBoard which fills the board with a random valid solution.
  const solved = solveBoard(board);
  if (!solved) {
    // In practice this should never happen because the algorithm always finds a solution.
    throw new Error("Failed to generate a full Sudoku board.");
  }
  return board;
}

/** Remove cells from a full board to create a puzzle with a target number of clues.
 *  The function ensures the resulting puzzle has a unique solution.
 */
export function createPuzzleFromFull(fullBoard: SudokuBoard, clues: number): SudokuBoard {
  const board: SudokuBoard = fullBoard.map(row => row.slice()); // deep copy
  const cells: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) cells.push([r, c]);
  }
  // Shuffle removal order
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  let removed = 0;
  const totalCells = 81;
  for (const [r, c] of cells) {
    if (totalCells - removed <= clues) break; // stop when we have enough clues
    const backup = board[r][c];
    board[r][c] = null;
    // Clone board for counting solutions
    const clone: SudokuBoard = board.map(row => row.slice());
    const solutions = countSolutions(clone, 2);
    if (solutions !== 1) {
      // Revert removal if uniqueness is broken
      board[r][c] = backup;
    } else {
      removed++;
    }
  }
  return board;
}
