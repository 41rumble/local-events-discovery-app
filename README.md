# Local Entertainment Discovery App

A mobile-friendly web application that helps users discover local entertainment events in real-time. The app features a visual timeline and map view that aggregates events from various sources (Eventbrite, Ticketmaster, Meetup) and displays them chronologically.

## Features

- **Location-based event discovery** using GPS (with 50km default radius) and manual location override
- **Dynamic visual timeline** showing chronological events with real-time updates
- **Filtering system** for event types (movies, bands, sports, festivals, theater, art, community)
- **Interactive map view** showing geographical distribution of events
- **Detailed event pages** with comprehensive information (title, description, timing, location, booking links)
- **Real-time notifications** for upcoming events based on user preferences

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI (MUI) for UI components
- Socket.io for real-time updates
- Google Maps API for map view
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB for data storage
- Socket.io for real-time updates
- Integration with Eventbrite, Ticketmaster, and Meetup APIs

## Project Structure

```
local-events-app/
├── frontend/                # React frontend
│   ├── public/              # Public assets
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API and socket services
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx          # Main App component
│   ├── package.json         # Frontend dependencies
│   └── .env                 # Frontend environment variables
├── backend/                 # Node.js backend
│   ├── src/                 # Source code
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # API controllers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── server.js        # Main server file
│   ├── package.json         # Backend dependencies
│   └── .env                 # Backend environment variables
└── README.md                # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- API keys for Eventbrite, Ticketmaster, Meetup, and Google Maps

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd local-events-app/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   NODE_ENV=development
   PORT=57453
   MONGODB_URI=mongodb://localhost:27017/local-events-app
   EVENTBRITE_API_KEY=your_eventbrite_api_key
   TICKETMASTER_API_KEY=your_ticketmaster_api_key
   MEETUP_API_KEY=your_meetup_api_key
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd local-events-app/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:57453/api
   REACT_APP_SOCKET_URL=http://localhost:57453
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. Start the frontend development server:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:52181`

## API Documentation

### Events API
- `GET /api/events` - Get events based on location and filters
- `GET /api/events/:id` - Get a single event by ID
- `POST /api/events/refresh` - Refresh events from external sources

### Locations API
- `POST /api/locations/geocode` - Geocode an address to coordinates
- `GET /api/locations/reverse-geocode` - Reverse geocode coordinates to address

## Future Enhancements
- User accounts and profiles
- Personalized event recommendations
- Social features (sharing, inviting friends)
- Ticket purchasing integration
- Event reminders and calendar integration