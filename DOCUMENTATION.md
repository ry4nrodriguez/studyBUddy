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

#### Backend
- **Flask**: Python web framework for the backend API
- **JSON**: Data storage for study space information
- **Docker**: Containerization for deployment

#### Frontend
- **Next.js**: React framework for the user interface
- **TypeScript**: Type-safe JavaScript for frontend development
- **Mapbox GL**: Interactive mapping library
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Accessible UI component library

## System Architecture

The application follows a client-server architecture:

1. **Backend (Flask)**: 
   - Serves study space data via a REST API
   - Processes and filters data based on current time
   - Calculates distances between user location and study spaces
   - Handles time-based availability logic

2. **Frontend (Next.js)**:
   - Renders the interactive map with Mapbox GL
   - Displays the sidebar with building and room information
   - Manages user location detection
   - Handles user interactions and state management

## Backend Documentation

### File Structure

- `app.py`: Main Flask application with API endpoints and business logic
- `bu_study_spaces.json`: Data file containing all study space information
- `requirements.txt`: Python dependencies
- `Dockerfile`: Container configuration for deployment

### Key Components

#### `app.py`

The main backend application file that handles API requests and processes study space data.

##### Functions

- `haversine(lat1, lon1, lat2, lon2)`: 
  Calculates the distance between two geographic coordinates using the Haversine formula.

- `get_slot_status(current_time, start_time_str, end_time_str)`: 
  Determines the availability status of a study space based on its operating hours and the current time.
  Handles special cases like time slots that span midnight.
  Returns one of: "available", "upcoming", "unavailable", or "passed".

##### API Endpoints

- `GET /api/test`: 
  Simple test endpoint to verify the API is working.

- `GET/POST /api/open-classrooms`: 
  Main endpoint that returns all study spaces with their availability status.
  When called with POST and user coordinates, it also calculates and includes the distance to each location.

### Data Structure

The `bu_study_spaces.json` file contains an array of buildings, each with the following structure:

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

## Frontend Documentation

### File Structure

- `app/`: Next.js application directory
  - `page.tsx`: Main application page
  - `layout.tsx`: Root layout component
  - `globals.css`: Global styles
- `components/`: React components
  - `Map.tsx`: Interactive map component
  - `Left.tsx`: Sidebar component for displaying building information
  - `Loading.tsx`: Loading indicator component
  - `ui/`: UI components from Radix UI
- `lib/`: Utility functions
- `public/`: Static assets

### Key Components

#### `page.tsx`

The main application page that orchestrates the entire application.

- Manages application state (data, active building, user position)
- Handles data fetching from the backend API
- Coordinates interactions between the map and sidebar components
- Manages user location detection

#### `Map.tsx`

The interactive map component that displays study locations.

- Initializes and configures the Mapbox GL map
- Renders markers for each study location with appropriate colors based on availability
- Handles marker click events
- Manages map styling based on time of day
- Displays user location when available

#### `Left.tsx`

The sidebar component that displays detailed information about study spaces.

- Shows a list of all buildings with their availability status
- Displays room-specific schedules for each building
- Formats time strings for better readability
- Provides visual indicators for availability status

## User Flow

1. User opens the application
2. The application requests permission to access the user's location
3. The backend API is called to fetch study space data
4. The map displays all study locations with color-coded markers
5. The sidebar shows a list of buildings sorted by proximity (if location is available)
6. User can click on markers or building names to see detailed information
7. Room-specific schedules and availability are displayed for the selected building

## Deployment

The application is designed to be deployed using Docker containers:

- Backend: Flask application containerized with Docker
- Frontend: Next.js application that can be deployed to various hosting platforms

## Maintenance and Updates

To update study space information:
1. Modify the `bu_study_spaces.json` file with new or updated locations
2. Restart the backend service to apply changes

## Future Enhancements

Potential areas for improvement:
- User authentication for personalized experiences
- Favorites or bookmarking functionality
- Occupancy level indicators for study spaces
- Integration with BU's official scheduling system
- Mobile app version 