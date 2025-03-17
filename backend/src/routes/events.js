const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// GET /api/events - Get events based on location and filters
router.get('/', eventController.getEvents);

// GET /api/events/:id - Get a single event by ID
router.get('/:id', eventController.getEventById);

// POST /api/events/refresh - Refresh events from external sources
router.post('/refresh', eventController.refreshEvents);

module.exports = router;