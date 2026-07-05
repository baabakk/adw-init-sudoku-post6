# init-sudoku-post6 — shared foundation

Generated deterministically by DevOps from the approved project-decomposition.

**Stack:** TypeScript (npm workspaces)
- install: `npm install`
- build: `npm run build`
- test: `npm test`

## Subsystems (one feature team each)
- **web-client** — Web Client: Browser SPA that renders an interactive Sudoku board, allows difficulty selection, fetches puzzles from Puzzle Service, submits completed boards for validation, and displays leaderboard from Scores Service.
  - owns: packages/web
  - dependsOn: puzzle-service, scores-service
- **puzzle-service** — Puzzle Service: Node.js HTTP service that generates valid, uniquely-solvable Sudoku puzzles per difficulty and validates submitted boards. Exposes GET /puzzle and POST /validate endpoints. Uses SQLite for persistence (or in-memory cache).
  - owns: packages/puzzle-service
  - dependsOn: none
- **scores-service** — Scores Service: Node.js HTTP service that persists completed game results and serves a per-difficulty top-10 leaderboard. Exposes POST /scores and GET /leaderboard endpoints. Uses SQLite for persistence.
  - owns: packages/scores-service
  - dependsOn: none

## Shared contracts
- packages/contracts
