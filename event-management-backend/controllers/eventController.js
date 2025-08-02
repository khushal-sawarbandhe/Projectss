// controllers/eventController.js
const Event = require('../models/Event');
const User = require('../models/User');
const fs = require('fs'); // <--- **NEW: IMPORT fs**
const path = require('path'); // <--- **NEW: IMPORT path**

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
    const { title, description, date, time, location, availableSpots } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : ''; 
    if (!title || !description || !date || !time || !location || availableSpots === undefined) {
        if (req.file) { fs.unlinkSync(req.file.path); }
        return res.status(400).json({ message: 'Please fill all required fields' });
    }
    try {
        const newEvent = new Event({
            title,
            description,
            date,
            time,
            location,
            availableSpots,
            creator: req.user.id,
            imageUrl: imageUrl,
        });
        const event = await newEvent.save();
        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        if (req.file) { fs.unlinkSync(req.file.path); }
        res.status(500).json({ message: 'Server error: Could not create event' });
    }
};

const getEvents = async (req, res) => {
    try {
        const { search, sortBy } = req.query;
        let query = {};
        let sortOptions = { date: 1 };
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { location: searchRegex }
            ];
        }
        if (sortBy) {
            switch (sortBy) {
                case 'date_desc':
                    sortOptions = { date: -1 }; break;
                case 'date_asc':
                    sortOptions = { date: 1 }; break;
                case 'attendees_desc':
                    sortOptions = { attendees: -1 }; break;
                case 'attendees_asc':
                    sortOptions = { attendees: 1 }; break;
                default:
                    sortOptions = { date: 1 };
            }
        }
        const events = await Event.find(query).populate('creator', 'name email').sort(sortOptions);
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Server error: Could not fetch events with filters/sort' });
    }
};

const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('creator', 'name email')
            .populate('attendees', 'name email');
        if (!event) { return res.status(404).json({ message: 'Event not found' }); }
        res.json(event);
    } catch (error) {
        console.error(error);
        if (error.name === 'CastError') { return res.status(404).json({ message: 'Event not found with that ID' }); }
        res.status(500).json({ message: 'Server error: Could not fetch event' });
    }
};

const updateEvent = async (req, res) => {
    const { title, description, date, time, location, availableSpots } = req.body;
    const { id } = req.params;
    const newImageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    try {
        let event = await Event.findById(id);
        if (!event) {
            if (req.file) { fs.unlinkSync(req.file.path); }
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.creator.toString() !== req.user.id) {
            if (req.file) { fs.unlinkSync(req.file.path); }
            return res.status(401).json({ message: 'Not authorized to update this event' });
        }
        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.time = time || event.time;
        event.location = location || event.location;
        event.availableSpots = availableSpots || event.availableSpots;
        if (newImageUrl !== undefined) {
            if (event.imageUrl && event.imageUrl.startsWith('/uploads/')) {
                const oldImagePath = path.join(__dirname, '..', event.imageUrl);
                if (fs.existsSync(oldImagePath)) { fs.unlinkSync(oldImagePath); }
            }
            event.imageUrl = newImageUrl;
        } else if (req.body.clearImage === 'true') {
            if (event.imageUrl && event.imageUrl.startsWith('/uploads/')) {
                const oldImagePath = path.join(__dirname, '..', event.imageUrl);
                if (fs.existsSync(oldImagePath)) { fs.unlinkSync(oldImagePath); }
            }
            event.imageUrl = '';
        }
        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        if (req.file) { fs.unlinkSync(req.file.path); }
        if (error.name === 'CastError') { return res.status(404).json({ message: 'Event not found with that ID' }); }
        res.status(500).json({ message: 'Server error: Could not update event' });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) { return res.status(404).json({ message: 'Event not found' }); }
        if (event.creator.toString() !== req.user.id) { return res.status(401).json({ message: 'Not authorized to delete this event' }); }
        if (event.imageUrl && event.imageUrl.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, '..', event.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log(`Deleted image file from disk: ${imagePath}`);
            }
        }
        await Event.deleteOne({ _id: req.params.id });
        res.json({ message: 'Event removed' });
    } catch (error) {
        console.error('Error deleting event:', error);
        if (error.name === 'CastError') { return res.status(404).json({ message: 'Event not found with that ID' }); }
        res.status(500).json({ message: 'Server error: Could not delete event' });
    }
};

const rsvpForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) { return res.status(404).json({ message: 'Event not found' }); }
        if (event.attendees.includes(req.user.id)) { return res.status(400).json({ message: 'You have already RSVPd for this event' }); }
        if (event.attendees.length >= event.availableSpots) { return res.status(400).json({ message: 'No more spots available for this event' }); }
        event.attendees.push(req.user.id);
        await event.save();
        res.json({ message: 'Successfully RSVPd for the event!' });
    } catch (error) {
        console.error(error);
        if (error.name === 'CastError') { return res.status(404).json({ message: 'Event not found with that ID' }); }
        res.status(500).json({ message: 'Server error: Could not RSVP for event' });
    }
};

const getCreatedEventsByUser = async (req, res) => {
    try {
        if (req.params.id !== req.user.id) { return res.status(403).json({ message: 'Unauthorized access to created events' }); }
        const events = await Event.find({ creator: req.user.id }).populate('creator', 'name email').sort({ date: 1 });
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error: Could not fetch created events' });
    }
};

const getRsvpdEventsByUser = async (req, res) => {
    try {
        if (req.params.id !== req.user.id) { return res.status(403).json({ message: 'Unauthorized access to RSVPd events' }); }
        const events = await Event.find({ attendees: req.user.id }).populate('creator', 'name email').sort({ date: 1 });
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error: Could not fetch RSVPd events' });
    }
};

module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    rsvpForEvent,
    getCreatedEventsByUser,
    getRsvpdEventsByUser,
};