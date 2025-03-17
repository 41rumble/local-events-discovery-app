import React, { useState, useCallback, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { Event, EventType } from '../../types';
import { useEvents } from '../../contexts/EventsContext';
import { useLocation } from '../../contexts/LocationContext';

// Event type to color mapping
const eventTypeColors: Record<EventType, string> = {
  movie: '#e57373',
  band: '#81c784',
  sport: '#64b5f6',
  festival: '#ffb74d',
  theater: '#ba68c8',
  art: '#4db6ac',
  community: '#9575cd'
};

// Map container style
const containerStyle = {
  width: '100%',
  height: '500px'
};

// Map options
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true
};

const EventMap: React.FC = () => {
  const { events, isLoading, error, setSelectedEvent } = useEvents();
  const { userLocation } = useLocation();
  const [selectedMarker, setSelectedMarker] = useState<Event | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });
  
  // Handle map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);
  
  // Handle marker click
  const handleMarkerClick = (event: Event) => {
    setSelectedMarker(event);
  };
  
  // Handle info window click
  const handleInfoWindowClick = (event: Event) => {
    setSelectedEvent(event);
    setSelectedMarker(null);
  };
  
  // Close info window
  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };
  
  // Center map on user location when it changes
  useEffect(() => {
    if (map && userLocation) {
      map.panTo({ lat: userLocation.latitude, lng: userLocation.longitude });
    }
  }, [map, userLocation]);
  
  if (loadError) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error loading Google Maps. Please try again later.
      </Alert>
    );
  }
  
  if (!isLoaded) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="500px">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Event Map
      </Typography>
      
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="500px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <Box sx={{ position: 'relative' }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : undefined}
            zoom={12}
            options={mapOptions}
            onLoad={onMapLoad}
          >
            {/* User location marker */}
            {userLocation && (
              <Marker
                position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: '#4285F4',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 2
                }}
                title="Your Location"
              />
            )}
            
            {/* Event markers */}
            {events.map((event) => (
              <Marker
                key={event._id}
                position={{ 
                  lat: event.location.coordinates.coordinates[1], 
                  lng: event.location.coordinates.coordinates[0] 
                }}
                onClick={() => handleMarkerClick(event)}
                icon={{
                  path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                  scale: 6,
                  fillColor: eventTypeColors[event.eventType],
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 1
                }}
              />
            ))}
            
            {/* Info window for selected marker */}
            {selectedMarker && (
              <InfoWindow
                position={{ 
                  lat: selectedMarker.location.coordinates.coordinates[1], 
                  lng: selectedMarker.location.coordinates.coordinates[0] 
                }}
                onCloseClick={handleInfoWindowClose}
              >
                <Box sx={{ p: 1, maxWidth: 200 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {selectedMarker.title}
                  </Typography>
                  <Chip 
                    label={selectedMarker.eventType} 
                    size="small"
                    sx={{ 
                      backgroundColor: eventTypeColors[selectedMarker.eventType],
                      color: 'white',
                      mb: 1
                    }} 
                  />
                  <Typography variant="body2" gutterBottom>
                    {selectedMarker.location.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="primary" 
                    sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => handleInfoWindowClick(selectedMarker)}
                  >
                    View Details
                  </Typography>
                </Box>
              </InfoWindow>
            )}
          </GoogleMap>
        </Box>
      )}
    </Paper>
  );
};

export default EventMap;