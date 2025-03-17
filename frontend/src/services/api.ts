import axios from 'axios';
import { 
  Event, 
  EventFilters, 
  GeocodingResult, 
  ReverseGeocodingResult, 
  ApiResponse, 
  PaginatedResponse 
} from '../types';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:57453/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Event API calls
export const getEvents = async (
  latitude: number,
  longitude: number,
  radius: number = 50,
  filters?: EventFilters,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Event>> => {
  try {
    // Build query parameters
    const params: any = {
      latitude,
      longitude,
      radius,
      page,
      limit
    };

    // Add filters if provided
    if (filters?.eventTypes && filters.eventTypes.length > 0) {
      params.eventTypes = filters.eventTypes.join(',');
    }

    if (filters?.startDate) {
      params.startDate = filters.startDate.toISOString();
    }

    if (filters?.endDate) {
      params.endDate = filters.endDate.toISOString();
    }

    const response = await api.get<PaginatedResponse<Event>>('/events', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const getEventById = async (id: string): Promise<ApiResponse<Event>> => {
  try {
    const response = await api.get<ApiResponse<Event>>(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw error;
  }
};

export const refreshEvents = async (
  latitude: number,
  longitude: number,
  radius: number = 50
): Promise<ApiResponse<null>> => {
  try {
    const response = await api.post<ApiResponse<null>>('/events/refresh', null, {
      params: { latitude, longitude, radius }
    });
    return response.data;
  } catch (error) {
    console.error('Error refreshing events:', error);
    throw error;
  }
};

// Location API calls
export const geocodeAddress = async (address: string): Promise<ApiResponse<GeocodingResult>> => {
  try {
    const response = await api.post<ApiResponse<GeocodingResult>>('/locations/geocode', { address });
    return response.data;
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<ApiResponse<ReverseGeocodingResult>> => {
  try {
    const response = await api.get<ApiResponse<ReverseGeocodingResult>>('/locations/reverse-geocode', {
      params: { latitude, longitude }
    });
    return response.data;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    throw error;
  }
};