import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { UserLocation } from '../types';
import { reverseGeocode } from '../services/api';
import { updateLocation } from '../services/socket';

interface LocationContextType {
  userLocation: UserLocation | null;
  isLoading: boolean;
  error: string | null;
  setManualLocation: (latitude: number, longitude: number) => Promise<void>;
  detectCurrentLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to get address from coordinates
  const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string | undefined> => {
    try {
      const response = await reverseGeocode(latitude, longitude);
      return response.data?.formattedAddress;
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      return undefined;
    }
  };

  // Set location and update socket
  const setLocationAndNotify = async (latitude: number, longitude: number): Promise<void> => {
    try {
      const address = await getAddressFromCoordinates(latitude, longitude);
      const newLocation: UserLocation = { latitude, longitude, address };
      
      setUserLocation(newLocation);
      updateLocation(newLocation);
      
      // Store in localStorage for persistence
      localStorage.setItem('userLocation', JSON.stringify(newLocation));
    } catch (error) {
      console.error('Error setting location:', error);
      throw error;
    }
  };

  // Set manual location
  const setManualLocation = async (latitude: number, longitude: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await setLocationAndNotify(latitude, longitude);
    } catch (error) {
      setError('Failed to set manual location');
      console.error('Error setting manual location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Detect current location using browser geolocation
  const detectCurrentLocation = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }
      
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });
      
      const { latitude, longitude } = position.coords;
      await setLocationAndNotify(latitude, longitude);
    } catch (error) {
      setError('Failed to detect your location');
      console.error('Error detecting current location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load saved location from localStorage on initial render
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation) as UserLocation;
        setUserLocation(parsedLocation);
      } catch (error) {
        console.error('Error parsing saved location:', error);
        localStorage.removeItem('userLocation');
      }
    } else {
      // Automatically detect location on first load
      detectCurrentLocation();
    }
  }, []);

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        isLoading,
        error,
        setManualLocation,
        detectCurrentLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use the location context
export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  
  return context;
};