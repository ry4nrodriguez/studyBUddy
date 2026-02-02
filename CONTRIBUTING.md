# Contributing to Study BUddy

Thanks for helping improve Study BUddy! This guide covers setup, workflow, and
expectations for contributors.

## Development setup

1. Install prerequisites:
   - Node.js 20+
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Configure env vars:
   - Copy `frontend/.env.example` → `frontend/.env.local`
   - Add your Mapbox token

## Running locally

```bash
cd frontend
npm run dev
```

The app runs at http://localhost:3000. No separate backend is needed.

## Code style

- Run `npm run lint` from `frontend/` before committing
- Use TypeScript types for all new code
- Follow existing patterns for components and API routes

## Tests

```bash
cd frontend
npm run test
```

## Pull requests

- Keep PRs focused and small when possible.
- Include clear descriptions and testing steps.
- Avoid committing `.env` or other secrets.

## Updating study space data

Edit `frontend/data/bu_study_spaces.json` to add or modify study locations.

## Reporting issues

Open a GitHub issue with reproduction steps and screenshots where relevant.
