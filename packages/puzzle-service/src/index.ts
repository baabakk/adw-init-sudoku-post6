import express, { Request, Response, NextFunction } from "express";
import puzzleRouter from "./routes/puzzle";
import validateRouter from "./routes/validate";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use(puzzleRouter);
app.use(validateRouter);

// Simple health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Error handling middleware (fallback)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Puzzle service listening on port ${PORT}`);
  });
}

export default app;
