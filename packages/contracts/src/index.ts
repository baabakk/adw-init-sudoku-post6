/**
 * Shared contract types for the Sudoku platform.
 * All services and the web client import these types to ensure type‑safe HTTP communication.
 * The file is compiled with `strict` enabled.
 */

/** Difficulty levels supported by the puzzle generator and scoring system. */
export type Difficulty = 'easy' | 'medium' | 'hard';

/** A single Sudoku cell. `null` represents an empty cell. */
export type SudokuCell = number | null;
/** A 9×9 Sudoku board. Each inner array is a row of 9 cells.
 * The type does not enforce the exact length at compile time, but runtime implementations
 * should guarantee a 9×9 grid.
 */
export type SudokuBoard = SudokuCell[][];

/** Request payload for GET /puzzle?difficulty=… */
export interface GetPuzzleRequest {
  /** Desired difficulty of the generated puzzle. */
  difficulty: Difficulty;
}

/** Response payload for GET /puzzle. */
export interface GetPuzzleResponse {
  /** Unique identifier for the generated puzzle – used for later validation. */
  puzzleId: string;
  /** The difficulty that was requested. */
  difficulty: Difficulty;
  /** The initial board state; empty cells are `null`. */
  board: SudokuBoard;
}

/** Request payload for POST /validate. */
export interface ValidatePuzzleRequest {
  /** Identifier of the puzzle being validated. */
  puzzleId: string;
  /** The board submitted by the player. */
  board: SudokuBoard;
}

/** Response payload for POST /validate. */
export interface ValidatePuzzleResponse {
  /** Echoes the puzzle identifier. */
  puzzleId: string;
  /** `true` if the submitted board solves the puzzle correctly. */
  isValid: boolean;
  /** Optional list of validation error messages when `isValid` is false. */
  errors?: string[];
}

/** Request payload for POST /scores. */
export interface SubmitScoreRequest {
  /** Identifier of the puzzle that was solved. */
  puzzleId: string;
  /** Player's display name. */
  playerName: string;
  /** Difficulty of the puzzle that was solved. */
  difficulty: Difficulty;
  /** Time taken to solve the puzzle, in milliseconds. */
  timeTakenMs: number;
}

/** Response payload for POST /scores. */
export interface SubmitScoreResponse {
  /** Indicates whether the score was stored successfully. */
  success: boolean;
  /** Identifier of the stored score record (present when `success` is true). */
  scoreId?: string;
  /** Optional human‑readable message, e.g., error details when `success` is false. */
  message?: string;
}

/** Request payload for GET /leaderboard?difficulty=… */
export interface GetLeaderboardRequest {
  /** Difficulty for which the leaderboard should be returned. */
  difficulty: Difficulty;
}

/** Single entry in a leaderboard response. */
export interface LeaderboardEntry {
  /** Player's display name. */
  playerName: string;
  /** Time taken to solve the puzzle, in milliseconds. */
  timeTakenMs: number;
  /** ISO‑8601 timestamp when the score was recorded. */
  achievedAt: string;
}

/** Response payload for GET /leaderboard. */
export interface GetLeaderboardResponse {
  /** Difficulty of the leaderboard entries. */
  difficulty: Difficulty;
  /** Up to ten best scores for the requested difficulty, ordered by `timeTakenMs` ascending. */
  entries: LeaderboardEntry[];
}
