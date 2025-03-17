// Event types
export type EventType = 'movie' | 'band' | 'sport' | 'festival' | 'theater' | 'art' | 'community';

export type EventSource = 'eventbrite' | 'ticketmaster' | 'meetup' | 'manual';

export interface Coordinates {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface EventLocation {
  name: string;
  address: string;
  coordinates: Coordinates;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: EventLocation;
  eventType: EventType;
  imageUrl?: string;
  bookingLink?: string;
  source: EventSource;
  sourceId?: string;
  createdAt: string;
  updatedAt: string;
}

// Location types
export interface GeocodingResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export interface ReverseGeocodingResult {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  formattedAddress: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  count: number;
  total: number;
  page: number;
  pages: number;
}

// Filter types
export interface EventFilters {
  eventTypes?: EventType[];
  startDate?: Date;
  endDate?: Date;
}

// User location
export interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
}