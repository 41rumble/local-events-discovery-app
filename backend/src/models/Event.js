const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  location: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    }
  },
  eventType: {
    type: String,
    enum: ['movie', 'band', 'sport', 'festival', 'theater', 'art', 'community'],
    required: true
  },
  imageUrl: {
    type: String
  },
  bookingLink: {
    type: String
  },
  source: {
    type: String,
    enum: ['eventbrite', 'ticketmaster', 'meetup', 'manual'],
    required: true
  },
  sourceId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for geospatial queries
eventSchema.index({ 'location.coordinates': '2dsphere' });

// Create index for time-based queries
eventSchema.index({ startTime: 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;