const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

// Public routes (if any)
// router.get('/public-events', eventController.getPublicEvents); // if needed

// 🔐 Protected routes
router.use(protect);

// Specific first — these must go above /:id
router.get('/user/bookings', eventController.getUserBookings);
router.get('/admin/analytics', eventController.getAnalytics);

// Booking route
router.post('/:id/book', eventController.bookEvent);

// CRUD
router.post('/', eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);
router.patch('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
