const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

// Apply protect middleware to all routes
router.use(protect);

// Booking-specific route (MUST be above '/:id')
router.post('/:id/book', eventController.bookEvent);
router.get('/:id', eventController.getEvent);

// Regular event routes
router.post('/', eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.get('/user/bookings', eventController.getUserBookings); // Keep above '/:id'
router.get('/admin/analytics', eventController.getAnalytics);  // Keep above '/:id'
//
router.patch('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
