# BU Study Spots - Backend Documentation

## Overview

The backend of BU Study Spots is built with Flask, a lightweight Python web framework. It serves as the API layer that provides study space data to the frontend application. The backend is responsible for processing the raw study space data, determining the availability status of each location based on the current time, and calculating distances between the user and study spaces when user location is provided.

## File Structure

- `app.py`: Main Flask application with API endpoints and business logic
- `bu_study_spaces.json`: Data file containing all study space information
- `requirements.txt`: Python dependencies
- `Dockerfile`: Container configuration for deployment
- `.dockerignore`: Specifies files to exclude from Docker builds
- `.gitignore`: Specifies files to exclude from Git version control

## Dependencies

The backend relies on the following Python packages:
- Flask (3.0.3): Web framework
- Requests (2.32.3): HTTP library
- Other standard libraries: datetime, json, math, os

## Core Components

### `app.py`

#### Utility Functions

##### `haversine(lat1, lon1, lat2, lon2)`

Calculates the distance between two geographic coordinates using the Haversine formula.

```python
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c  # Returns distance in kilometers
```

**Parameters:**
- `lat1`: Latitude of the first point (in degrees)
- `lon1`: Longitude of the first point (in degrees)
- `lat2`: Latitude of the second point (in degrees)
- `lon2`: Longitude of the second point (in degrees)

**Returns:**
- Distance between the two points in kilometers

##### `get_slot_status(current_time, start_time_str, end_time_str)`

Determines the availability status of a study space based on its operating hours and the current time.

```python
def get_slot_status(current_time, start_time_str, end_time_str):
    start_time = datetime.strptime(start_time_str, "%H:%M:%S").time()
    end_time = datetime.strptime(end_time_str, "%H:%M:%S").time()
    
    # Check if the time spans midnight (end_time is earlier than start_time)
    spans_midnight = end_time < start_time
    
    # Calculate time until opening
    time_until = datetime.combine(datetime.today(), start_time) - datetime.combine(datetime.today(), current_time)
    time_until = time_until.total_seconds() / 60
    
    # For times that span midnight, we need special handling
    if spans_midnight:
        # If current time is after start time or before end time, it's available
        if start_time <= current_time or current_time <= end_time:
            return "available"
        # If we're approaching the start time
        elif time_until > 0 and time_until < 20:
            return "upcoming"
        else:
            return "unavailable"
    else:
        # Standard time slot handling (same day)
        if time_until > 0 and time_until < 20:
            return "upcoming"
        elif start_time <= current_time <= end_time:
            return "available"
        elif current_time > end_time:
            return "passed"
        else:
            return "unavailable"
```

**Parameters:**
- `current_time`: Current time as a datetime.time object
- `start_time_str`: Start time of the slot in "HH:MM:SS" format
- `end_time_str`: End time of the slot in "HH:MM:SS" format

**Returns:**
- Status string: "available", "upcoming", "unavailable", or "passed"

**Special Cases:**
- Handles time slots that span midnight (e.g., 22:00:00 to 02:00:00)
- Marks slots as "upcoming" if they start within the next 20 minutes

#### API Endpoints

##### `GET /api/test`

Simple test endpoint to verify the API is working.

```python
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "Test route is working!"})
```

**Returns:**
- JSON response with a success message

##### `GET/POST /api/open-classrooms`

Main endpoint that returns all study spaces with their availability status.

```python
@app.route('/api/open-classrooms', methods=['GET', 'POST'])
def get_open_classrooms():
    # Function implementation
```

**Request Methods:**
- `GET`: Returns all study spaces without distance calculations
- `POST`: Accepts user location data and returns study spaces with distance calculations

**POST Request Body:**
```json
{
  "lat": 42.3505,
  "lng": -71.1097
}
```

**Response:**
```json
[
  {
    "building": "Building Name",
    "building_code": "Code",
    "building_status": "available|upcoming|unavailable",
    "rooms": {
      "Room Number": {
        "slots": [
          {
            "StartTime": "HH:MM:SS",
            "EndTime": "HH:MM:SS",
            "Status": "available|upcoming|unavailable|passed"
          }
        ]
      }
    },
    "coords": [longitude, latitude],
    "distance": 0.5  // Only included if user location is provided
  }
]
```

**Processing Logic:**
1. Extracts user location from request (if POST)
2. Loads study space data from JSON file
3. Gets current time
4. For each building and room:
   - Determines availability status for each time slot
   - Aggregates room statuses to determine overall building status
   - Calculates distance from user (if location provided)
5. Sorts buildings by distance (if user location provided)
6. Returns JSON response with building information

## Data Structure

### `bu_study_spaces.json`

This file contains an array of buildings, each with detailed information about rooms and schedules.

#### Building Object

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

**Fields:**
- `name`: Full name of the building
- `code`: Short code/abbreviation for the building
- `coordinates`: Geographic coordinates as [longitude, latitude]
- `address`: Physical address of the building
- `rooms`: Array of room objects

#### Room Object

```json
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
```

**Fields:**
- `roomNumber`: Identifier for the room (e.g., floor number, room number)
- `schedule`: Array of schedule objects, typically containing one object with slots
- `Slots`: Array of time slots when the room is available
- `StartTime`: Opening time in 24-hour format
- `EndTime`: Closing time in 24-hour format

## Deployment

### Docker Configuration

The backend is containerized using Docker for easy deployment.

#### `Dockerfile`

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

CMD ["python", "app.py"]
```

#### Running the Backend

1. Build the Docker image:
   ```
   docker build -t bu-study-spots-backend .
   ```

2. Run the container:
   ```
   docker run -p 8080:8080 bu-study-spots-backend
   ```

## Development Guidelines

### Adding New Study Spaces

To add a new study space:

1. Open `bu_study_spaces.json`
2. Add a new building object following the structure above
3. Ensure coordinates are accurate (longitude, latitude)
4. Define rooms and their schedules
5. Restart the backend service

### Modifying Existing Study Spaces

To update an existing study space:

1. Locate the building in `bu_study_spaces.json`
2. Update the relevant fields (coordinates, rooms, schedules)
3. Restart the backend service

### Time Format Considerations

- All times must be in 24-hour format: "HH:MM:SS"
- For locations open past midnight, set the end time to a value less than the start time (e.g., StartTime: "22:00:00", EndTime: "02:00:00")
- The backend handles this special case correctly to determine availability 