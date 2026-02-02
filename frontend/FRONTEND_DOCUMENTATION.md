# BU Study Spots - Frontend Documentation

## Overview

The frontend of BU Study Spots is built with Next.js, a React framework that enables server-side rendering and static site generation. The application provides an interactive map interface that displays study locations across the Boston University campus, along with a sidebar that shows detailed information about each location.

## File Structure

```
frontend/
├── app/                  # Next.js app directory
│   ├── api/              # API route handlers
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
├── lib/                  # Utility functions
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
- Next.js (14.2.13): React framework
- React (18.x): UI library
- Mapbox GL (3.7.0): Interactive mapping library
- Radix UI: Accessible UI component primitives
- Tailwind CSS: Utility-first CSS framework

## Core Components

### `app/page.tsx`

The main application page that orchestrates the entire application.

```typescript
export default function Home() {
    const [data, setData] = useState<dataFormat[]>([]);
    const [activeBuilding, setActiveBuilding] = useState<string | null>(null);
    const [userPos, setUserPos] = useState<[number, number] | null>(null);
    const [loading, setLoading] = useState(true);

    // Component implementation
}
```

**Key Responsibilities:**
- Manages application state:
  - `data`: Study space information from the backend
  - `activeBuilding`: Currently selected building
  - `userPos`: User's geographic coordinates
  - `loading`: Loading state indicator
- Handles user location detection using the browser's Geolocation API
- Fetches study space data from the backend API
- Coordinates interactions between the map and sidebar components
- Renders the main application layout with the Map and Left components

**Data Flow:**
1. On component mount, attempts to get the user's location
2. Sends location data to the backend API (if available)
3. Receives study space data and updates state
4. Passes data to child components (Map and Left)
5. Handles building selection and updates the active building state

### `components/Map.tsx`

The interactive map component that displays study locations.

```typescript
export default function Map({
    data,
    handleMarkerClick,
    userPos,
}: {
    data: dataFormat[];
    handleMarkerClick: (building: string) => void;
    userPos: any;
}) {
    // Component implementation
}
```

**Key Responsibilities:**
- Initializes and configures the Mapbox GL map
- Renders markers for each study location with appropriate colors based on availability
- Handles marker click events
- Manages map styling based on time of day
- Displays user location when available

**Props:**
- `data`: Array of study space objects from the backend
- `handleMarkerClick`: Callback function to handle marker clicks
- `userPos`: User's geographic coordinates (if available)

**Features:**
- Dynamic marker colors based on availability status:
  - Green: Available
  - Yellow: Upcoming (opening soon)
  - Red: Unavailable
- Map style changes based on time of day (dawn, day, dusk, night)
- Smooth animations when moving between locations
- User location marker with accuracy radius
- Popup information on marker hover

### `components/Left.tsx`

The sidebar component that displays detailed information about study spaces.

```typescript
export default function Left({
    data,
    activeBuilding,
    setActiveBuilding,
}: {
    data: DataFormat[];
    activeBuilding: string | null;
    setActiveBuilding: (building: string | null) => void;
}) {
    // Component implementation
}
```

**Key Responsibilities:**
- Shows a list of all buildings with their availability status
- Displays room-specific schedules for each building
- Formats time strings for better readability
- Provides visual indicators for availability status
- Handles building selection

**Props:**
- `data`: Array of study space objects from the backend
- `activeBuilding`: Currently selected building
- `setActiveBuilding`: Function to update the selected building

**Helper Functions:**
- `formatTime(timeString)`: Converts 24-hour time strings to 12-hour format with AM/PM
- `statusLabel(status)`: Renders a styled label for each status type
- `statusIndicator(status)`: Renders a colored indicator for each status type

**UI Components:**
- Accordion for expandable building sections
- Status indicators with appropriate colors
- Time slot listings with formatted times
- Room-specific information sections

### `components/Loading.tsx`

A simple loading indicator component displayed while data is being fetched.

```typescript
export default function Loading() {
    // Component implementation
}
```

**Features:**
- Animated spinner
- Centered on the screen
- Displayed during initial data loading

## Data Types

### Main Data Interface

```typescript
interface dataFormat {
    building: string;
    building_code: string;
    building_status: string;
    rooms: {
        [key: string]: {
            slots: { StartTime: string; EndTime: string; Status: string }[];
        };
    };
    coords: [number, number];
    distance: number;
}
```

This interface represents the structure of study space data received from the backend API.

## State Management

The application uses React's built-in state management with `useState` hooks. The main state is managed in the `page.tsx` component and passed down to child components as props.

Key state variables:
- `data`: Study space information from the backend
- `activeBuilding`: Currently selected building
- `userPos`: User's geographic coordinates
- `loading`: Loading state indicator

## API Integration

The frontend communicates with the backend through a simple REST API.

### Fetching Study Space Data

```typescript
const fetchData = async (userPosition = null) => {
    try {
        let response;
        if (userPosition) {
            response = await fetch("/api/open-classrooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    lat: userPosition[0],
                    lng: userPosition[1],
                }),
            });
        } else {
            response = await fetch("/api/open-classrooms");
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        setLoading(false);
    } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
    }
};
```

This function fetches study space data from the backend API, optionally including user location data for distance calculations.

## Styling

The application uses Tailwind CSS for styling, with some custom components from Radix UI. The styling approach follows these principles:

- Utility-first CSS with Tailwind classes
- Responsive design for various screen sizes
- Dark mode support
- Accessible color contrasts
- Consistent visual language

### Map Styling

The map uses Mapbox GL styles that change based on the time of day:
- Dawn: Soft lighting with warm tones
- Day: Bright, clear visibility
- Dusk: Warm, golden lighting
- Night: Dark theme with highlighted features

## User Location

The application uses the browser's Geolocation API to get the user's location:

```typescript
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            setUserPos([latitude, longitude]);
            // Fetch data with user position
        },
        (error) => {
            console.error("Error getting location:", error);
            // Fetch data without user position
        }
    );
} else {
    console.log("Geolocation is not supported by this browser.");
    // Fetch data without user position
}
```

## Environment Variables

The application uses environment variables for configuration:

- `NEXT_PUBLIC_MAPBOX_TOKEN`: Mapbox GL API token for map rendering
- `BACKEND_URL`: Backend API base URL for server-side calls (default: `http://localhost:8080`)
- `NEXT_PUBLIC_BACKEND_URL`: Optional fallback for local development

These are stored in the `.env.local` file and accessed via `process.env`. On Vercel,
set `BACKEND_URL` in Project Settings → Environment Variables so the API route can
reach the deployed backend.

## Building and Deployment

### Development

To run the application in development mode:

```bash
npm run dev
```

This starts the Next.js development server on http://localhost:3000.

### Production Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## Best Practices

The frontend codebase follows these best practices:

1. **TypeScript for Type Safety**
   - All components and functions are typed
   - Interfaces define data structures

2. **Component Separation**
   - Clear separation of concerns between components
   - Reusable UI components in the `ui` directory

3. **Responsive Design**
   - Mobile-first approach with responsive breakpoints
   - Adapts to different screen sizes

4. **Accessibility**
   - Semantic HTML elements
   - ARIA attributes where needed
   - Keyboard navigation support
   - Color contrast compliance

5. **Performance Optimization**
   - Efficient re-rendering with proper state management
   - Lazy loading of map resources
   - Optimized marker rendering

## Troubleshooting

Common issues and solutions:

1. **Map Not Loading**
   - Check if Mapbox token is correctly set in `.env.local`
   - Verify network connectivity to Mapbox services

2. **Location Detection Issues**
   - Ensure location permissions are granted in the browser
   - Check if the device has GPS capabilities

3. **Data Not Displaying**
   - Verify backend API is running and accessible
   - Check browser console for API errors

4. **Styling Issues**
   - Clear browser cache to ensure latest CSS is loaded
   - Verify Tailwind configuration is correct 