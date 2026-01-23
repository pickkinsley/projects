# Jones County XC

A full-stack web application with a React frontend and Go backend.

## Project Structure

```
jones-county-xc/
├── frontend/     # React app (Vite + Tailwind CSS)
├── backend/      # Go HTTP server
├── docs/         # Documentation
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- Go (v1.21+)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at http://localhost:5173

### Backend

```bash
cd backend
go run main.go
```

The backend runs at http://localhost:8080

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/hello` | GET | Returns greeting message |

## Development

Run both servers simultaneously:
- Frontend: `cd frontend && npm run dev`
- Backend: `cd backend && go run main.go`

The frontend is configured to proxy API requests to the backend with CORS enabled for local development.
