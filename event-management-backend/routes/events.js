// routes/events.js
const express = require('express');
const router = express.Router();
const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    rsvpForEvent,
    getCreatedEventsByUser,
    getRsvpdEventsByUser
} = require('../controllers/eventController');
const protect = require('../middleware/authMiddleware').protect; // Correct way to import protect
const upload = require('../middleware/upload'); // Correct way to import upload middleware

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes (require authentication)
router.post('/', protect, upload, createEvent); // <--- Make sure this route is POST /api/events
router.put('/:id', protect, upload, updateEvent);     // <--- And this is PUT /api/events/:id
router.delete('/:id', protect, deleteEvent);
router.put('/:id/rsvp', protect, rsvpForEvent);

// User-specific dashboard data routes (already defined in routes/users.js)
// You've correctly put these in routes/users.js, so they don't need to be here.
// However, if you chose to put them here, ensure their paths are correct.
// For consistency, stick to the separation if you created routes/users.js

module.exports = router;