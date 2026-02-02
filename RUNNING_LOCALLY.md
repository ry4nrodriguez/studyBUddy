# Study BUddy - Local Development Setup

### Access URL
- **Application**: http://localhost:3000

---

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

That's it! The frontend is self-contained and includes all backend logic.

---

## Important Notes

### Environment setup
1. Copy `frontend/.env.example` to `frontend/.env.local`

### Mapbox Token Required
The frontend uses a Mapbox token for the map. You need to:

1. Get a free Mapbox token from https://www.mapbox.com/
2. Edit `frontend/.env.local` and replace `your_mapbox_token_here` with your actual token:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_actual_token_here
   ```
3. Restart the frontend server

**Without a valid Mapbox token, the map will not display.**

---

## Testing the Application

1. Open http://localhost:3000 in your browser
2. Allow location permission when prompted (optional but recommended)
3. You should see:
   - A list of BU buildings on the left
   - An interactive map on the right
   - Green/amber/red status indicators

---

## Stopping the Server

Press `CTRL+C` in the terminal to stop the server.

---

## Using Docker

You can also run the frontend with Docker Compose:

```bash
docker-compose up frontend
```

---

## Troubleshooting

### Map not showing
- Verify you have a valid Mapbox token in `frontend/.env.local`
- Check browser console for errors

### Data not loading
- Check `frontend/data/bu_study_spaces.json` exists
- Check browser console for API errors

---

## Legacy Backend (Optional)

The `backend/` folder contains a standalone Flask API that can be run separately:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

This is not required for normal development as the frontend is self-contained.

---

Generated: 2026-02-01
