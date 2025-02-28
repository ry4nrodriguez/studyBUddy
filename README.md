# My Study Spots

**My Study Spots** is a web application designed to help students find open classrooms for studying. When libraries and other common study areas are full, students can use this app to locate available classrooms in real-time, offering more options for quiet and productive study spaces on campus.

![alt text](SpotsDemoImage.png)

This project is a fork of [Spots](https://github.com/notAkki/spots.git) by notAkki.

## Features

-   Displays open classrooms across campus.
-   Sorts classrooms based on proximity to the user's current location.
-   Provides up-to-date availability of classrooms.
-   Interactive map to visualize classroom locations.
-   List view of classrooms with real-time status updates.

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

3. Start the development servers:
   
   For the frontend:
   ```
   npm run dev:frontend
   ```
   
   For the backend:
   ```
   npm run dev:backend
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Tech Stack

### Frontend

-   **Next.js**: Handles server-side rendering and provides a robust React-based framework for building the frontend UI.
-   **Mapbox GL**: Provides the interactive map to display classroom locations.
-   **Tailwind CSS**: Used for styling the UI components with utility-first CSS for responsive and consistent design.
-   **Geolocation API**: Retrieves the user's current location to sort classrooms by proximity.

### Backend

-   **Flask**: A lightweight Python web framework to handle API requests and logic for retrieving and processing classroom availability data.
-   **Requests**: A Python library used in Flask to fetch classroom data from external APIs.
-   **Haversine Formula**: Implemented in the backend to calculate the distance between the user and classroom locations based on coordinates.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
