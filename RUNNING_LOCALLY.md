# Study BUddy - Local Development Setup

### Access URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080

### Services Status
✅ Backend (Flask) - Running on port 8080
✅ Frontend (Next.js) - Running on port 3000

---

## Quick Start Commands

### Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Or Use Root Commands
```bash
# From project root
npm run dev:backend   # Start backend
npm run dev:frontend  # Start frontend
```

---

## Important Notes

### Environment setup
1. Copy `frontend/.env.example` to `frontend/.env.local`
2. Copy `backend/.env.example` to `backend/.env`

### ⚠️ Mapbox Token Required
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

## Stopping the Servers

Press `CTRL+C` in each terminal to stop the servers.

---

## Next Steps

1. **Get Mapbox Token**: Required for map to work
2. **Test Location**: Allow browser location access for distance sorting
3. **Explore Data**: Check out the 24+ study spaces across BU campus

---

## Troubleshooting

### Frontend won't connect to backend
- Check backend is running on port 8080
- Check `frontend/.env.local` has correct `NEXT_PUBLIC_BACKEND_URL`

### Map not showing
- Verify you have a valid Mapbox token in `frontend/.env.local`
- Check browser console for errors

### Backend errors
- Make sure virtual environment is activated: `source backend/.venv/bin/activate`
- Check `backend/bu_study_spaces.json` exists

---

Generated: 2026-02-01
