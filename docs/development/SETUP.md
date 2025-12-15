# Setup

Canonical setup instructions live here.

## Prerequisites

- Node.js + pnpm
- Python 3.11+

## Install

```bash
pnpm install
```

## Backend

```bash
pnpm dev:server
```

Backend runs at `http://localhost:5000`.

## Frontend

```bash
pnpm dev:client
```

Frontend runs at `http://localhost:3000`.

## Environment Variables

- Backend (`server/.env`):
  - `OPENAI_API_KEY`
- Frontend (`client/.env` or deployment env):
  - `VITE_API_URL` (production)

## See also

- Detailed legacy setup doc: `/docs/setup/SETUP.md`
