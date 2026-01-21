const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking, getAllBookings } = require('../controllers/BookingController');
const { protect, admin } = require('../middleware/AuthMiddleware');

router.post('/', protect, createBooking);
router.get('/mybookings', protect, getMyBookings);
router.get('/all', protect, admin, getAllBookings);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
