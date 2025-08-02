// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path'); // NEW: Import path module for serving static files

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express();

// Middleware
// Enable JSON body parsing for incoming requests
app.use(express.json()); 
// Enable CORS for all origins (important for frontend-backend communication)
app.use(cors());

// Serve static files from the 'uploads' directory
// When a request comes to /uploads, Express will look into the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Use path.join for robustness

// Define a simple root route for testing if the API is running
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Use API routes
// These lines connect your API endpoints to the Express app
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/users', require('./routes/users'));

// Define the port the server will listen on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});