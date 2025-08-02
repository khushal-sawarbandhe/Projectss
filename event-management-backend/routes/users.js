// routes/users.js (excerpt)
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getCreatedEventsByUser,
    getRsvpdEventsByUser,
} = require('../controllers/eventController');
const {
    // REMOVED: toggleFavoriteEvent,
    // REMOVED: getFavoriteEventsByUser
} = require('../controllers/authController');

// Routes for Events created/rsvpd by user
router.get('/:id/events/created', protect, getCreatedEventsByUser);
router.get('/:id/events/rsvpd', protect, getRsvpdEventsByUser);

// REMOVED: Routes for Favorite Events
// router.post('/:id/favorites/toggle/:eventId', protect, toggleFavoriteEvent);
// router.get('/:id/favorites', protect, getFavoriteEventsByUser);

module.exports = router;