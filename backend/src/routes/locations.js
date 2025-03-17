const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// POST /api/locations/geocode - Geocode an address to coordinates
router.post('/geocode', locationController.geocodeAddress);

// GET /api/locations/reverse-geocode - Reverse geocode coordinates to address
router.get('/reverse-geocode', locationController.reverseGeocode);

module.exports = router;