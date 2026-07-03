# Puzzle Service

A lightweight HTTP service that generates Sudoku puzzles and validates submitted solutions.

## API

### GET `/puzzle?difficulty=easy|medium|hard`

Returns a newly generated Sudoku puzzle.

**Response** (`GetPuzzleResponse`):
```json
{
  "puzzleId": "string",   // unique identifier for the puzzle
  "difficulty": "easy" | "medium" | "hard",
  "board": [[1, null, 5, ...], ...] // 9×9 array, `null` denotes an empty cell
}
```

### POST `/validate`

Validates a completed board against the stored solution.

**Request** (`ValidatePuzzleRequest`):
```json
{
  "puzzleId": "string",
  "board": [[1,2,3,...], ...]
}
```

**Response** (`ValidatePuzzleResponse`):
```json
{
  "puzzleId": "string",
  "isValid": true | false,
  "errors": ["optional error messages"]
}
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Start the server (default port 3000)
npm start
```

The service stores puzzle solutions in memory only; they are lost when the process restarts.
