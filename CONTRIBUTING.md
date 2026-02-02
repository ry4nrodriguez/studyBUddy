# Contributing to Study BUddy

Thanks for helping improve Study BUddy! This guide covers setup, workflow, and
expectations for contributors.

## Development setup

1. Install prerequisites:
   - Node.js 18+
   - Python 3.8+
2. Install dependencies:
   - `npm run install:all`
3. Configure env vars:
   - Copy `frontend/.env.example` → `frontend/.env.local`
   - Copy `backend/.env.example` → `backend/.env`

## Running locally

- Frontend: `npm run dev:frontend` (http://localhost:3000)
- Backend: `npm run dev:backend` (http://localhost:8080)

## Code style

- Frontend: `npm run lint` (from `frontend/`)
- Backend: keep PEP 8 conventions; use clear function names and docstrings

## Tests

- Backend: `python -m pytest` (from `backend/`)
- Frontend: `npm run test` (from `frontend/`, if configured)

## Pull requests

- Keep PRs focused and small when possible.
- Include clear descriptions and testing steps.
- Avoid committing `.env` or other secrets.

## Reporting issues

Open a GitHub issue with reproduction steps and screenshots where relevant.
