const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');

// @desc    Create new booking
// @route   POST /api/bookings
const createBooking = asyncHandler(async (req, res) => {
    const { movie, theatre, showtime, selectedSeats, totalAmount } = req.body;

    // 1. Validate User
    if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user missing');
    }

    // 2. Validate Admin Status (safely)
    if (req.user.isAdmin) {
        res.status(403);
        throw new Error('Administrators are not allowed to book tickets');
    }

    // 3. Validate Inputs
    if (!selectedSeats || selectedSeats.length === 0) {
        res.status(400);
        throw new Error('No seats selected');
    }

    // 4. Fetch and Validate Showtime
    const showtimeRecord = await Showtime.findById(showtime);
    if (!showtimeRecord) {
        res.status(404);
        throw new Error('Showtime not found');
    }

    // 5. Check for Double Booking (with safe array access)
    const currentBookedSeats = showtimeRecord.bookedSeats || [];
    const alreadyBooked = selectedSeats.some(seat => currentBookedSeats.includes(seat));

    if (alreadyBooked) {
        res.status(400);
        throw new Error('One or more selected seats are already booked');
    }

    // 6. Create Booking (safely accessing user ID)
    const userId = req.user._id || req.user.id;

    const booking = new Booking({
        user: userId,
        movie,
        theatre,
        showtime,
        selectedSeats,
        totalAmount,
        bookingStatus: 'CONFIRMED'
    });

    const createdBooking = await booking.save();

    // 7. Update Showtime
    showtimeRecord.bookedSeats = [...currentBookedSeats, ...selectedSeats];
    await showtimeRecord.save();

    res.status(201).json(createdBooking);
});

const getMyBookings = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        res.status(401);
        throw new Error('Not authorized');
    }
    const bookings = await Booking.find({ user: req.user._id })
        .populate('movie')
        .populate('theatre')
        .populate('showtime');
    res.json(bookings);
});

const cancelBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    if (!req.user || booking.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to cancel this booking');
    }

    if (booking.bookingStatus === 'CANCELLED') {
        res.status(400);
        throw new Error('Booking is already cancelled');
    }

    const showtimeRecord = await Showtime.findById(booking.showtime);
    if (showtimeRecord) {
        showtimeRecord.bookedSeats = showtimeRecord.bookedSeats.filter(
            seat => !booking.selectedSeats.includes(seat)
        );
        await showtimeRecord.save();
    }

    booking.bookingStatus = 'CANCELLED';
    await booking.save();
    res.json({ message: 'Booking cancelled' });
});

const getAllBookings = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        res.status(403);
        throw new Error('Not authorized as admin');
    }
    const bookings = await Booking.find({})
        .populate('user', 'name email')
        .populate('movie')
        .populate('theatre')
        .populate('showtime');
    res.json(bookings);
});

module.exports = { createBooking, getMyBookings, cancelBooking, getAllBookings };
