# init-sudoku-post6 — shared foundation

Generated deterministically by DevOps from the approved project-decomposition.

**Stack:** TypeScript (npm workspaces)
- install: `npm install`
- build: `npm run build`
- test: `npm run test`

## Subsystems (one feature team each)
- **web-client** — Web Client: Browser SPA that renders an interactive Sudoku board, allows difficulty selection, fetches puzzles from Puzzle Service, submits completed boards for validation, and displays the leaderboard from Scores Service.
  - owns: packages/web
  - dependsOn: puzzle-service, scores-service
- **puzzle-service** — Puzzle Service: HTTP service that generates valid, uniquely-solvable Sudoku puzzles per difficulty and validates submitted boards. No persistence required; puzzles are generated on demand.
  - owns: packages/puzzle-service
  - dependsOn: none
- **scores-service** — Scores Service: HTTP service that persists completed-game results (player name, difficulty, time-to-solve) in a SQLite database and serves a per-difficulty top-10 leaderboard sorted by time-to-solve.
  - owns: packages/scores-service
  - dependsOn: none

## Shared contracts
- packages/contracts
