import { io, Socket } from 'socket.io-client';
import { UserLocation } from '../types';

let socket: Socket | null = null;

// Initialize socket connection
export const initializeSocket = (): Socket => {
  if (!socket) {
    socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:57453', {
      transports: ['websocket'],
      autoConnect: true
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  return socket;
};

// Disconnect socket
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Update user location
export const updateLocation = (location: UserLocation): void => {
  if (socket) {
    socket.emit('updateLocation', location);
  }
};

// Listen for events updated
export const onEventsUpdated = (callback: (data: { count: number }) => void): void => {
  if (socket) {
    socket.on('eventsUpdated', callback);
  }
};

// Remove event listener
export const offEventsUpdated = (callback: (data: { count: number }) => void): void => {
  if (socket) {
    socket.off('eventsUpdated', callback);
  }
};