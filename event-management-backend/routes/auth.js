// routes/auth.js (excerpt)
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser); // <-- THIS LINE
router.post('/login', loginUser);

// Private route (requires token)
router.get('/me', protect, getMe);

module.exports = router;