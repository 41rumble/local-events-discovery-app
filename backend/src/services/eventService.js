const axios = require('axios');
const Event = require('../models/Event');

// Fetch events from Eventbrite
const fetchEventbriteEvents = async (latitude, longitude, radius) => {
  try {
    // In a real implementation, we would call the Eventbrite API
    // For now, we'll return mock data
    
    // Mock Eventbrite events
    const mockEvents = [
      {
        title: 'Tech Meetup',
        description: 'Join us for a tech meetup discussing the latest in web development.',
        startTime: new Date(Date.now() + 86400000), // Tomorrow
        endTime: new Date(Date.now() + 86400000 + 7200000), // Tomorrow + 2 hours
        location: {
          name: 'Tech Hub',
          address: '123 Tech St, San Francisco, CA',
          coordinates: {
            type: 'Point',
            coordinates: [-122.4194, 37.7749]
          }
        },
        eventType: 'community',
        imageUrl: 'https://example.com/tech-meetup.jpg',
        bookingLink: 'https://eventbrite.com/events/123',
        source: 'eventbrite',
        sourceId: 'eb-123'
      },
      {
        title: 'Art Exhibition',
        description: 'Explore modern art at our gallery exhibition.',
        startTime: new Date(Date.now() + 172800000), // Day after tomorrow
        endTime: new Date(Date.now() + 172800000 + 14400000), // Day after tomorrow + 4 hours
        location: {
          name: 'Modern Gallery',
          address: '456 Art Ave, San Francisco, CA',
          coordinates: {
            type: 'Point',
            coordinates: [-122.4184, 37.7739]
          }
        },
        eventType: 'art',
        imageUrl: 'https://example.com/art-exhibition.jpg',
        bookingLink: 'https://eventbrite.com/events/456',
        source: 'eventbrite',
        sourceId: 'eb-456'
      }
    ];
    
    return mockEvents;
  } catch (error) {
    console.error('Error fetching Eventbrite events:', error);
    return [];
  }
};

// Fetch events from Ticketmaster
const fetchTicketmasterEvents = async (latitude, longitude, radius) => {
  try {
    // In a real implementation, we would call the Ticketmaster API
    // For now, we'll return mock data
    
    // Mock Ticketmaster events
    const mockEvents = [
      {
        title: 'Rock Concert',
        description: 'Experience the ultimate rock concert with live performances.',
        startTime: new Date(Date.now() + 259200000), // 3 days from now
        endTime: new Date(Date.now() + 259200000 + 10800000), // 3 days from now + 3 hours
        location: {
          name: 'Concert Hall',
          address: '789 Music Blvd, San Francisco, CA',
          coordinates: {
            type: 'Point',
            coordinates: [-122.4104, 37.7829]
          }
        },
        eventType: 'band',
        imageUrl: 'https://example.com/rock-concert.jpg',
        bookingLink: 'https://ticketmaster.com/events/789',
        source: 'ticketmaster',
        sourceId: 'tm-789'
      },
      {
        title: 'Basketball Game',
        description: 'Watch the championship basketball game live.',
        startTime: new Date(Date.now() + 345600000), // 4 days from now
        endTime: new Date(Date.now() + 345600000 + 7200000), // 4 days from now + 2 hours
        location: {
          name: 'Sports Arena',
          address: '101 Sports Way, San Francisco, CA',
          coordinates: {
            type: 'Point',
            coordinates: [-122.3894, 37.7669]
          }
        },
        eventType: 'sport',
        imageUrl: 'https://example.com/basketball-game.jpg',
        bookingLink: 'https://ticketmaster.com/events/101',
        source: 'ticketmaster',
        sourceId: 'tm-101'
      }
    ];
    
    return mockEvents;
  } catch (error) {
    console.error('Error fetching Ticketmaster events:', error);
    return [];
  }
};

// Fetch events from Meetup
const fetchMeetupEvents = async (latitude, longitude, radius) => {
  try {
    // In a real implementation, we would call the Meetup API
    // For now, we'll return mock data
    
    // Mock Meetup events
    const mockEvents = [
      {
        title: 'Hiking Group',
        description: 'Join our hiking group for a day of outdoor adventure.',
        startTime: new Date(Date.now() + 432000000), // 5 days from now
        endTime: new Date(Date.now() + 432000000 + 14400000), // 5 days from now + 4 hours
        location: {
          name: 'Mountain Trail',
          address: '202 Nature Path, San Francisco, CA',
          coordinates: {
            type: 'Point',
            coordinates: [-122.4784, 37.7549]
          }
        },
        eventType: 'community',
        imageUrl: 'https://example.com/hiking-group.jpg',
        bookingLink: 'https://meetup.com/events/202',
        source: 'meetup',
        sourceId: 'mu-202'
      },
      {
        title: 'Book Club',
        description: 'Discuss this month\'s book selection with fellow readers.',
        startTime: new Date(Date.now() + 518400000), // 6 days from now
        endTime: new Date(Date.now() + 518400000 + 7200000), // 6 days from now + 2 hours
        location: {
          name: 'Community Library',
          address: '303 Book St, San Francisco, CA',
          coordinates: {
            type: 'Point',
            coordinates: [-122.4294, 37.7649]
          }
        },
        eventType: 'community',
        imageUrl: 'https://example.com/book-club.jpg',
        bookingLink: 'https://meetup.com/events/303',
        source: 'meetup',
        sourceId: 'mu-303'
      }
    ];
    
    return mockEvents;
  } catch (error) {
    console.error('Error fetching Meetup events:', error);
    return [];
  }
};

// Fetch events from all external sources and save to database
exports.fetchEventsFromExternalSources = async (latitude, longitude, radius) => {
  try {
    // Fetch events from all sources
    const [eventbriteEvents, ticketmasterEvents, meetupEvents] = await Promise.all([
      fetchEventbriteEvents(latitude, longitude, radius),
      fetchTicketmasterEvents(latitude, longitude, radius),
      fetchMeetupEvents(latitude, longitude, radius)
    ]);
    
    // Combine all events
    const allEvents = [
      ...eventbriteEvents,
      ...ticketmasterEvents,
      ...meetupEvents
    ];
    
    // Save events to database (upsert based on source and sourceId)
    const savedEvents = [];
    
    for (const event of allEvents) {
      const savedEvent = await Event.findOneAndUpdate(
        { source: event.source, sourceId: event.sourceId },
        event,
        { upsert: true, new: true }
      );
      
      savedEvents.push(savedEvent);
    }
    
    return savedEvents;
  } catch (error) {
    console.error('Error fetching events from external sources:', error);
    throw error;
  }
};