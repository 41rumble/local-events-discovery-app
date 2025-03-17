import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Layout from './components/layout/Layout';
import LocationDetector from './components/location/LocationDetector';
import EventFilters from './components/events/EventFilters';
import EventTimeline from './components/events/EventTimeline';
import EventDetail from './components/events/EventDetail';
import EventMap from './components/map/EventMap';
import { LocationProvider } from './contexts/LocationContext';
import { EventsProvider } from './contexts/EventsContext';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'timeline' | 'map'>('timeline');

  // Listen for view change events
  useEffect(() => {
    const handleViewChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ view: 'timeline' | 'map' }>;
      setCurrentView(customEvent.detail.view);
    };

    window.addEventListener('viewChange', handleViewChange);

    return () => {
      window.removeEventListener('viewChange', handleViewChange);
    };
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <LocationProvider>
        <EventsProvider>
          <Layout>
            <LocationDetector />
            <EventFilters />
            
            {currentView === 'timeline' ? (
              <EventTimeline />
            ) : (
              <EventMap />
            )}
            
            <EventDetail />
          </Layout>
        </EventsProvider>
      </LocationProvider>
    </LocalizationProvider>
  );
}

export default App;
