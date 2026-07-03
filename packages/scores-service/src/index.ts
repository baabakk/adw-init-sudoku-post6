import express, { json } from 'express';
import type { Request, Response } from 'express';
import scoresRouter from './routes/scores';
import leaderboardRouter from './routes/leaderboard';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware
app.use(json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/scores', scoresRouter);
app.use('/leaderboard', leaderboardRouter);

app.listen(PORT, () => {
  console.log(`Scores service listening on port ${PORT}`);
});

export default app;
