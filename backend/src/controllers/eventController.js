const Event = require('../models/Event');
const { fetchEventsFromExternalSources } = require('../services/eventService');

// Get events based on location and filters
exports.getEvents = async (req, res) => {
  try {
    const { 
      latitude, 
      longitude, 
      radius = 50, // Default radius 50km
      eventTypes,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = req.query;

    // Validate required parameters
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude are required' 
      });
    }

    // Build query
    const query = {
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(radius) * 1000 // Convert km to meters
        }
      }
    };

    // Add event type filter if provided
    if (eventTypes) {
      const types = eventTypes.split(',');
      query.eventType = { $in: types };
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const events = await Event.find(query)
      .sort({ startTime: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// Refresh events from external sources
exports.refreshEvents = async (req, res) => {
  try {
    const { latitude, longitude, radius = 50 } = req.query;

    // Validate required parameters
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude are required' 
      });
    }

    // Fetch events from external sources
    const newEvents = await fetchEventsFromExternalSources(
      parseFloat(latitude),
      parseFloat(longitude),
      parseInt(radius)
    );

    // Notify connected clients about new events
    const io = req.app.get('io');
    io.emit('eventsUpdated', { count: newEvents.length });

    res.status(200).json({
      success: true,
      message: `Successfully fetched ${newEvents.length} new events`,
      count: newEvents.length
    });
  } catch (error) {
    console.error('Error refreshing events:', error);
    res.status(500).json({
      success: false,
      message: 'Error refreshing events',
      error: error.message
    });
  }
};