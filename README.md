# Study BUddy

**study BUddy** is a web application designed to help Boston University students find open study spaces across campus. Students can use this web-app to locate available BU spaces in real-time, offering more options for quiet and productive study spaces on BU's campus.

## Features

-   Displays open study spaces across Boston University's campus.
-   Sorts study spaces based on proximity to the user's current location.
-   Provides up-to-date availability information for each study space.
-   Interactive map to visualize study space locations on BU's campus.
-   List view of study spaces with real-time status updates.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/ry4nrodriguez/my-study-spots.git
   cd my-study-spots
   ```

2. Install dependencies:
   ```
   npm run install:all
   ```

3. Configure environment variables:
   - Frontend: copy `frontend/.env.example` to `frontend/.env.local` and add your Mapbox token.
   - Backend: copy `backend/.env.example` to `backend/.env`.

4. Start the development servers:
   
   For the frontend:
   ```
   npm run dev:frontend
   ```
   
   For the backend:
   ```
   npm run dev:backend
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Tech Stack

### Frontend

-   **Next.js**: Handles server-side rendering and provides a robust React-based framework for building the frontend UI.
-   **Mapbox GL**: Provides the interactive map to display study space locations on Boston University's campus.
-   **Tailwind CSS**: Used for styling the UI components with utility-first CSS for responsive and consistent design.
-   **Geolocation API**: Retrieves the user's current location to sort study spaces by proximity.

### Backend

-   **Flask**: A lightweight Python web framework to handle API requests and logic for retrieving and processing study space availability data.
-   **JSON Data**: Local JSON file containing Boston University study space information.
-   **Haversine Formula**: Implemented in the backend to calculate the distance between the user and study space locations based on coordinates.

## Data Sources

The study space data for Boston University was compiled from:
- BU Libraries website
- Boston University Maps & Directory
- On-site verification of study spaces
- Building hours information from departmental websites

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Privacy

Study BUddy uses your browser location to sort study spaces by proximity. Location
data is sent to the backend only for sorting and is not stored.

## Docker (Optional)

Run both services with Docker Compose:

```
docker compose up --build
```
