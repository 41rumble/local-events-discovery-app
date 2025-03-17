import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Event, EventFilters, PaginatedResponse } from '../types';
import { getEvents, refreshEvents } from '../services/api';
import { useLocation } from './LocationContext';
import { initializeSocket, onEventsUpdated, offEventsUpdated } from '../services/socket';

interface EventsContextType {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  filters: EventFilters;
  setFilters: (filters: EventFilters) => void;
  refreshEventsData: () => Promise<void>;
  selectedEvent: Event | null;
  setSelectedEvent: (event: Event | null) => void;
  pagination: {
    page: number;
    totalPages: number;
    totalEvents: number;
  };
  setPage: (page: number) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

interface EventsProviderProps {
  children: ReactNode;
}

export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const { userLocation } = useLocation();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilters>({});
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalEvents: 0
  });

  // Fetch events based on location and filters
  const fetchEvents = async () => {
    if (!userLocation) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response: PaginatedResponse<Event> = await getEvents(
        userLocation.latitude,
        userLocation.longitude,
        50, // Default radius 50km
        filters,
        pagination.page
      );
      
      setEvents(response.data || []);
      setPagination({
        page: response.page,
        totalPages: response.pages,
        totalEvents: response.total
      });
    } catch (error) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh events from external sources
  const refreshEventsData = async () => {
    if (!userLocation) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await refreshEvents(userLocation.latitude, userLocation.longitude, 50);
      // After refreshing, fetch the updated events
      await fetchEvents();
    } catch (error) {
      setError('Failed to refresh events');
      console.error('Error refreshing events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Set page for pagination
  const setPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Handle real-time updates
  const handleEventsUpdated = (data: { count: number }) => {
    if (data.count > 0) {
      // Refresh events when new events are available
      fetchEvents();
    }
  };

  // Initialize socket connection
  useEffect(() => {
    const socket = initializeSocket();
    onEventsUpdated(handleEventsUpdated);
    
    return () => {
      offEventsUpdated(handleEventsUpdated);
    };
  }, []);

  // Fetch events when location, filters, or page changes
  useEffect(() => {
    if (userLocation) {
      fetchEvents();
    }
  }, [userLocation, filters, pagination.page]);

  return (
    <EventsContext.Provider
      value={{
        events,
        isLoading,
        error,
        filters,
        setFilters,
        refreshEventsData,
        selectedEvent,
        setSelectedEvent,
        pagination,
        setPage
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

// Custom hook to use the events context
export const useEvents = (): EventsContextType => {
  const context = useContext(EventsContext);
  
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  
  return context;
};