# BU Study Spots - Project Documentation

## Project Overview

BU Study Spots is a web application designed to help Boston University students find available study spaces across campus. The application displays an interactive map with real-time information about study locations, their availability status, and operating hours. Students can use this tool to quickly locate open study spaces, especially during busy periods when libraries and common areas are often full.

### Key Features

- **Interactive Map**: Displays all study locations across the BU campus with color-coded markers indicating availability status.
- **Real-time Availability**: Shows which study spaces are currently open, upcoming, or unavailable.
- **Location-based Sorting**: Sorts study spaces by proximity to the user's current location.
- **Detailed Information**: Provides room-specific schedules and availability for each building.
- **Responsive Design**: Works on both desktop and mobile devices.

### Technology Stack

- **Next.js**: React framework with API routes for the complete application
- **TypeScript**: Type-safe JavaScript for frontend and API development
- **Mapbox GL**: Interactive mapping library
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Accessible UI component library

## System Architecture

The application is a single-tier Next.js application that runs entirely on Vercel:

1. **Frontend (Next.js)**:
   - Renders the interactive map with Mapbox GL
   - Displays the sidebar with building and room information
   - Manages user location detection
   - Handles user interactions and state management

2. **API Route (`/api/open-classrooms`)**:
   - Processes study space data from the bundled JSON file
   - Calculates real-time availability based on current time
   - Computes distances from user location using Haversine formula
   - Returns sorted building data

## File Structure

```
frontend/
├── app/
│   ├── api/
│   │   └── open-classrooms/
│   │       └── route.ts      # Self-contained API route
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # Root layout component
│   └── globals.css           # Global styles
├── components/
│   ├── Map.tsx               # Interactive map component
│   ├── Left.tsx              # Sidebar component
│   ├── Loading.tsx           # Loading indicator
│   └── ui/                   # Radix UI components
├── data/
│   └── bu_study_spaces.json  # Study space data
├── lib/
│   ├── types.ts              # TypeScript type definitions
│   ├── availability.ts       # Time slot status logic
│   ├── distance.ts           # Haversine distance calculation
│   └── utils.ts              # Helper functions
└── public/                   # Static assets
```

## Key Components

### API Route (`app/api/open-classrooms/route.ts`)

The self-contained API route that handles all backend logic:

- **`GET /api/open-classrooms`**: Returns all study spaces with current availability status
- **`POST /api/open-classrooms`**: Accepts user coordinates, returns spaces sorted by distance

### Services

#### `lib/availability.ts`

Determines the availability status of a time slot:

- `getSlotStatus(currentTime, startTime, endTime)`: Returns "available", "upcoming", "unavailable", or "passed"
- Handles special cases like time slots that span midnight

#### `lib/distance.ts`

Calculates geographic distances:

- `haversineKm(lat1, lon1, lat2, lon2)`: Returns distance in kilometers using the Haversine formula

### Frontend Components

#### `page.tsx`

The main application page that orchestrates the entire application:

- Manages application state (data, active building, user position)
- Handles data fetching from the API route
- Coordinates interactions between the map and sidebar components
- Manages user location detection

#### `Map.tsx`

The interactive map component:

- Initializes and configures the Mapbox GL map
- Renders markers with colors based on availability status
- Handles marker click events
- Displays user location when available

#### `Left.tsx`

The sidebar component:

- Shows a list of all buildings with their availability status
- Displays room-specific schedules for each building
- Formats time strings for better readability
- Provides visual indicators for availability status

## Data Structure

The `bu_study_spaces.json` file contains an array of buildings:

```json
{
  "name": "Building Name",
  "code": "Building Code",
  "coordinates": [longitude, latitude],
  "address": "Building Address",
  "rooms": [
    {
      "roomNumber": "Room Identifier",
      "schedule": [
        {
          "Slots": [
            {
              "StartTime": "HH:MM:SS",
              "EndTime": "HH:MM:SS"
            }
          ]
        }
      ]
    }
  ]
}
```

## User Flow

1. User opens the application
2. The application requests permission to access the user's location
3. The API route is called to fetch study space data with availability
4. The map displays all study locations with color-coded markers
5. The sidebar shows a list of buildings sorted by proximity (if location is available)
6. User can click on markers or building names to see detailed information
7. Room-specific schedules and availability are displayed for the selected building

## Deploying to Vercel

This repo is a monorepo: the Next.js app lives in `frontend/`. For Vercel to serve the app correctly:

1. **Settings** → **General** → **Root Directory**: set to **`frontend`**.
2. Turn **off** "Include files outside the root directory in the Build Step".
3. **Framework Preset**: must be **Next.js** (not "Other" or "None").
4. Leave **Build Command** and **Output Directory** empty (uses defaults).
5. **Redeploy** after saving.

No environment variables are required for the core functionality. Only `NEXT_PUBLIC_MAPBOX_TOKEN` is needed for the map.

## Maintenance and Updates

To update study space information:

1. Edit `frontend/data/bu_study_spaces.json` with new or updated locations
2. Commit and push to trigger a new deployment

## Legacy Backend

The `backend/` folder contains a standalone Flask API that can be deployed separately if needed. See `backend/BACKEND_DOCUMENTATION.md` for details. For most use cases, the self-contained Next.js API route is sufficient.

## Future Enhancements

Potential areas for improvement:

- User authentication for personalized experiences
- Favorites or bookmarking functionality
- Occupancy level indicators for study spaces
- Integration with BU's official scheduling system
- Mobile app version
