// models/Event.js (excerpt)
const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    // ... (existing fields)
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    availableSpots: {
        type: Number,
        required: true,
        min: 1,
    },
    attendees: [ // Users who have RSVP'd
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    imageUrl: { // <--- ADD THIS FIELD
        type: String,
        default: '', // Default to empty string if no image
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;