// controllers/configController.js
require('dotenv').config(); // Ensure environment variables are loaded

// @desc    Get Google Maps API Key
// @route   GET /api/config/maps-key
// @access  Public (client-side needs this)
const getMapsApiKey = (req, res) => {
    // Only expose the specific API key, not all environment variables
    if (process.env.Maps_API_KEY) {
        res.json({ apiKey: process.env.Maps_API_KEY });
    } else {
        res.status(500).json({ message: 'Google Maps API key not configured on server.' });
    }
};

module.exports = {
    getMapsApiKey,
};