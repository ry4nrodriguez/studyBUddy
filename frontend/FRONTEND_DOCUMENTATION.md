# BU Study Spots - Frontend Documentation

## Overview

The frontend of BU Study Spots is built with Next.js, a React framework that enables server-side rendering and static site generation. The application is self-contained, including both the UI and the API route that processes study space data. No separate backend is required.

## File Structure

```
frontend/
├── app/                  # Next.js app directory
│   ├── api/              # API route handlers
│   │   └── open-classrooms/
│   │       └── route.ts  # Self-contained API route
│   ├── fonts/            # Custom font files
│   ├── globals.css       # Global CSS styles
│   ├── layout.tsx        # Root layout component
│   ├── page.tsx          # Main application page
│   └── favicon.ico       # Site favicon
├── components/           # React components
│   ├── ui/               # UI components from Radix UI
│   ├── Left.tsx          # Sidebar component
│   ├── Loading.tsx       # Loading indicator component
│   └── Map.tsx           # Map component
├── data/                 # Data files
│   └── bu_study_spaces.json  # Study space data
├── lib/                  # Utility functions and services
│   ├── availability.ts   # Time slot status logic
│   ├── distance.ts       # Haversine distance calculation
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Helper utilities
├── public/               # Static assets
├── .env.local            # Environment variables
├── next.config.mjs       # Next.js configuration
├── package.json          # Project dependencies
├── postcss.config.mjs    # PostCSS configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Dependencies

The frontend relies on the following key packages:
- Next.js (16.x): React framework with API routes
- React (18.x): UI library
- Mapbox GL (3.x): Interactive mapping library
- Radix UI: Accessible UI component primitives
- Tailwind CSS: Utility-first CSS framework

## Services

### `lib/availability.ts`

Determines the availability status of a time slot based on the current time.

```typescript
export type SlotStatus = "available" | "upcoming" | "unavailable" | "passed";

export function getSlotStatus(
    currentTime: Date,
    startTimeStr: string,
    endTimeStr: string
): SlotStatus;
```

**Features:**
- Handles time slots in HH:MM:SS format
- Supports slots that span midnight
- Returns "upcoming" when a slot starts within 20 minutes
- Returns "passed" for slots that have ended

### `lib/distance.ts`

Calculates the distance between two geographic coordinates using the Haversine formula.

```typescript
export function haversineKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number;
```

**Returns:** Distance in kilometers.

## API Route

### `app/api/open-classrooms/route.ts`

The self-contained API route that processes study space data.

**Endpoints:**
- `GET /api/open-classrooms`: Returns all study spaces with current availability status
- `POST /api/open-classrooms`: Accepts user coordinates, returns spaces sorted by distance

**Request Body (POST):**
```json
{
  "lat": 42.35,
  "lng": -71.1
}
```

**Response:**
```json
[
  {
    "building": "Mugar Memorial Library",
    "building_code": "MUG",
    "building_status": "available",
    "rooms": {
      "1st Floor": {
        "slots": [
          {
            "StartTime": "07:00:00",
            "EndTime": "02:00:00",
            "Status": "available"
          }
        ]
      }
    },
    "coords": [-71.10757, 42.35104],
    "distance": 0.5
  }
]
```

## Core Components

### `app/page.tsx`

The main application page that orchestrates the entire application.

```typescript
export default function Home() {
    const [data, setData] = useState<BuildingData[]>([]);
    const [activeBuilding, setActiveBuilding] = useState<string | null>(null);
    const [userPos, setUserPos] = useState<[number, number] | null>(null);
    const [loading, setLoading] = useState(true);

    // Component implementation
}
```

**Key Responsibilities:**
- Manages application state
- Handles user location detection using the Geolocation API
- Fetches study space data from the API route
- Coordinates interactions between the map and sidebar components

### `components/Map.tsx`

The interactive map component that displays study locations.

**Props:**
- `data`: Array of study space objects
- `handleMarkerClick`: Callback for marker clicks
- `userPos`: User's geographic coordinates

**Features:**
- Dynamic marker colors based on availability status:
  - Green: Available
  - Yellow: Upcoming (opening soon)
  - Red: Unavailable
- Map style changes based on time of day
- User location marker with accuracy radius

### `components/Left.tsx`

The sidebar component that displays detailed information about study spaces.

**Props:**
- `data`: Array of study space objects
- `activeBuilding`: Currently selected building
- `setActiveBuilding`: Function to update the selected building

**Features:**
- Accordion for expandable building sections
- Status indicators with appropriate colors
- Time slot listings with formatted times

### `components/Loading.tsx`

A loading indicator component displayed while data is being fetched.

## Data Types

### Raw Data Types (from JSON)

```typescript
interface RawSlot {
    StartTime: string;
    EndTime: string;
}

interface RawRoom {
    roomNumber: string;
    schedule: RawScheduleEntry[];
}

interface RawBuilding {
    name: string;
    code: string;
    coordinates: [number, number];
    address?: string;
    rooms: RawRoom[];
}
```

### Response Types

```typescript
type RoomSlotStatus = "available" | "upcoming" | "unavailable" | "passed";

interface RoomSlot {
    StartTime: string;
    EndTime: string;
    Status: RoomSlotStatus;
}

interface BuildingData {
    building: string;
    building_code: string;
    building_status: RoomSlotStatus;
    rooms: Record<string, { slots: RoomSlot[] }>;
    coords: [number, number];
    distance: number;
}
```

## Environment Variables

The application uses a single environment variable:

- `NEXT_PUBLIC_MAPBOX_TOKEN`: Mapbox GL API token for map rendering

Store this in `.env.local` (copy from `.env.example`).

## Building and Deployment

### Development

```bash
npm run dev
```

Starts the Next.js development server on http://localhost:3000.

### Production Build

```bash
npm run build
npm run start
```

### Vercel Deployment

The application deploys to Vercel with these settings:
- **Root Directory**: `frontend`
- **Framework Preset**: Next.js
- No environment variables required except `NEXT_PUBLIC_MAPBOX_TOKEN`

## Testing

```bash
npm run test
```

Tests cover:
- API route GET and POST handlers
- Location validation
- `getSlotStatus` function with various time scenarios
- `haversineKm` distance calculation

## Troubleshooting

1. **Map Not Loading**
   - Check if Mapbox token is correctly set in `.env.local`
   - Verify network connectivity to Mapbox services

2. **Location Detection Issues**
   - Ensure location permissions are granted in the browser
   - The app works without location (spaces won't be sorted by distance)

3. **Data Not Displaying**
   - Check browser console for API errors
   - Verify `data/bu_study_spaces.json` exists

4. **Styling Issues**
   - Clear browser cache to ensure latest CSS is loaded
   - Verify Tailwind configuration is correct
