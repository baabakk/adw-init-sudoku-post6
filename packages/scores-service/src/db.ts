import Database from 'better-sqlite3';
import path from 'path';
import type { Difficulty } from '@init-sudoku-post6/contracts';
import type { Score, LeaderboardEntry } from './types';

/**
 * Singleton SQLite database instance.
 * The database file is stored alongside the package (packages/scores-service/scores.db).
 */
class ScoreDatabase {
  private static instance: ScoreDatabase;
  private db: Database.Database;

  private constructor() {
    // Resolve the path to the SQLite file relative to the compiled output directory.
    const dbPath = path.resolve(__dirname, '../../scores.db');
    this.db = new Database(dbPath);
    this.initialize();
  }

  /** Get the singleton instance. */
  public static getInstance(): ScoreDatabase {
    if (!ScoreDatabase.instance) {
      ScoreDatabase.instance = new ScoreDatabase();
    }
    return ScoreDatabase.instance;
  }

  /** Create the scores table if it does not exist. */
  private initialize(): void {
    const createTable = `
      CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playerName TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        timeTakenMs INTEGER NOT NULL,
        achievedAt TEXT NOT NULL
      );
    `;
    this.db.exec(createTable);
  }

  /** Insert a new score record and return its generated id. */
  public insertScore(record: Omit<Score, 'id'>): number {
    const stmt = this.db.prepare(
      `INSERT INTO scores (playerName, difficulty, timeTakenMs, achievedAt)
       VALUES (@playerName, @difficulty, @timeTakenMs, @achievedAt)`
    );
    const info = stmt.run({
      playerName: record.playerName,
      difficulty: record.difficulty,
      timeTakenMs: record.timeTakenMs,
      achievedAt: record.achievedAt,
    });
    return Number(info.lastInsertRowid);
  }

  /** Retrieve top N scores for a given difficulty, ordered by timeTakenMs ascending. */
  public getTopScores(difficulty: Difficulty, limit = 10): LeaderboardEntry[] {
    const stmt = this.db.prepare(
      `SELECT playerName, timeTakenMs, achievedAt FROM scores
       WHERE difficulty = ?
       ORDER BY timeTakenMs ASC, achievedAt ASC
       LIMIT ?`
    );
    const rows = stmt.all(difficulty, limit) as Array<LeaderboardEntry>;
    return rows;
  }
}

export const scoreDb = ScoreDatabase.getInstance();
