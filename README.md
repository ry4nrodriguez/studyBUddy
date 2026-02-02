# Study BUddy

**Study BUddy** is a web application designed to help Boston University students find open study spaces across campus. Students can use this web-app to locate available BU spaces in real-time, offering more options for quiet and productive study spaces on BU's campus.

## Features

- Displays open study spaces across Boston University's campus.
- Sorts study spaces based on proximity to the user's current location.
- Provides up-to-date availability information for each study space.
- Interactive map to visualize study space locations on BU's campus.
- List view of study spaces with real-time status updates.

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ry4nrodriguez/my-study-spots.git
   cd my-study-spots
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Configure environment variables:
   - Copy `frontend/.env.example` to `frontend/.env.local`
   - Add your Mapbox token (get one free at https://www.mapbox.com/)

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Tech Stack

- **Next.js**: React framework with API routes for the complete application
- **TypeScript**: Type-safe JavaScript for frontend and API development
- **Mapbox GL**: Interactive map to display study space locations
- **Tailwind CSS**: Utility-first CSS for responsive design
- **Radix UI**: Accessible UI component library
- **Geolocation API**: Retrieves the user's location to sort by proximity

## Data Sources

The study space data for Boston University was compiled from:
- BU Libraries website
- Boston University Maps & Directory
- On-site verification of study spaces
- Building hours information from departmental websites

## Deployment

The application is deployed on Vercel. See [DOCUMENTATION.md](DOCUMENTATION.md) for deployment instructions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Privacy

Study BUddy uses your browser location to sort study spaces by proximity. Location
data is processed in the API route and is not stored.

## Docker (Optional)

Run the frontend with Docker Compose:

```bash
docker compose up frontend
```
