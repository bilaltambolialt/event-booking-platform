const mongoose = require('mongoose');
const Event = require('../models/Event');
const User = require('../models/User');
const { sendBookingConfirmation } = require('../services/emailService');
const { generateQRCode } = require('../utils/qrGenerator');


// @desc    Create a new event (Admin only)
// @route   POST /api/events
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get all events
// @route   GET /api/events
exports.getAllEvents = async (req, res) => {
  try {
    // Adding search/filter capability (Bonus Feature)
    const { search, minSeats, maxSeats } = req.query;
    const filter = {};
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (minSeats) {
      filter.totalSeats = { ...filter.totalSeats, $gte: parseInt(minSeats) };
    }
    if (maxSeats) {
      filter.totalSeats = { ...filter.totalSeats, $lte: parseInt(maxSeats) };
    }

    const events = await Event.find(filter);
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get a single event
// @route   GET /api/events/:id
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    console.error('Get Event error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update an event
// @route   PATCH /api/events/:id
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
  console.log("🗑️ DELETE event route hit with ID:", req.params.id);
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Book a seat for an event
// @route   POST /api/events/:id/book


// @desc    Create a new event (Admin only)
// @route   POST /api/events
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get all events
// @route   GET /api/events
exports.getAllEvents = async (req, res) => {
  try {
    // Adding search/filter capability (Bonus Feature)
    const { search, minSeats, maxSeats } = req.query;
    const filter = {};
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (minSeats) {
      filter.totalSeats = { ...filter.totalSeats, $gte: parseInt(minSeats) };
    }
    if (maxSeats) {
      filter.totalSeats = { ...filter.totalSeats, $lte: parseInt(maxSeats) };
    }

    const events = await Event.find(filter);
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get a single event
// @route   GET /api/events/:id
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    console.error('Get Event error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update an event
// @route   PATCH /api/events/:id
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
  console.log("🗑️ DELETE event route hit with ID:", req.params.id);
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.bookEvent = async (req, res) => {
  console.log("📦 bookEvent hit with ID:", req.params.id);
  const eventId = req.params.id;
  const userId = req.user.id;

  try {
    // Step 1: Atomically increase bookedSeats only if available
    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        $expr: { $lt: ["$bookedSeats", "$totalSeats"] } // bookedSeats < totalSeats
      },
      { $inc: { bookedSeats: 1 } },
      { new: true }
    );

    if (!event) {
      return res.status(409).json({
        success: false,
        error: 'No seats available or already booked'
      });
    }

    // Step 2: Update user booking
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { bookedEvents: eventId } }
    );

    // Step 3: Email QR code (bonus)
    const user = await User.findById(userId);
    const qrCode = await generateQRCode(user.email, eventId);
    console.log("📧 About to send email using:", typeof sendBookingConfirmation);
    await sendBookingConfirmation(user.email, event, qrCode);

    res.status(200).json({
      success: true,
      data: {
        ...event.toObject(),
        qrCode
      }
    });

  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};



// @desc    Get user's bookings
// @route   GET /api/my-bookings
exports.getUserBookings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('bookedEvents', 'name date location totalSeats bookedSeats');

    res.status(200).json({
      success: true,
      data: user.bookedEvents
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve bookings'
    });
  }
};

// @desc    Get admin analytics
// @route   GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const events = await Event.find();
    
    const analytics = {
      totalEvents: events.length,
      totalSeatsBooked: events.reduce((sum, event) => sum + event.bookedSeats, 0),
      events: events.map(event => ({
        name: event.name,
        booked: event.bookedSeats,
        capacity: event.totalSeats,
        occupancy: (event.bookedSeats / event.totalSeats * 100).toFixed(1) + '%'
      }))
    };

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate analytics'
    });
  }
};
// @desc    Get user's bookings
// @route   GET /api/my-bookings
exports.getUserBookings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('bookedEvents', 'name date location totalSeats bookedSeats');

    res.status(200).json({
      success: true,
      data: user.bookedEvents
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve bookings'
    });
  }
};

// @desc    Get admin analytics
// @route   GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const events = await Event.find();
    
    const analytics = {
      totalEvents: events.length,
      totalSeatsBooked: events.reduce((sum, event) => sum + event.bookedSeats, 0),
      events: events.map(event => ({
        name: event.name,
        booked: event.bookedSeats,
        capacity: event.totalSeats,
        occupancy: (event.bookedSeats / event.totalSeats * 100).toFixed(1) + '%'
      }))
    };

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate analytics'
    });
  }
};