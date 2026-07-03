import type { SudokuBoard } from "@init-sudoku-post6/contracts";
import { getSolution } from "./puzzleGenerator";
import { isValidBoard } from "../utils/sudoku";

/**
 * Validate a submitted board against the stored solution for the given puzzleId.
 * Returns an object indicating validity and any error messages.
 */
export function validateBoard(puzzleId: string, submitted: SudokuBoard): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const solution = getSolution(puzzleId);
  if (!solution) {
    errors.push("Puzzle ID not found.");
    return { isValid: false, errors };
  }
  // First, ensure the submitted board respects Sudoku rules (optional but helpful).
  if (!isValidBoard(submitted)) {
    errors.push("Submitted board violates Sudoku rules.");
  }
  // Compare each cell with the solution.
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const submittedCell = submitted[r][c];
      const solutionCell = solution[r][c];
      if (submittedCell !== solutionCell) {
        errors.push(`Cell (${r + 1},${c + 1}) is incorrect.`);
      }
    }
  }
  const isValid = errors.length === 0;
  return { isValid, errors };
}
