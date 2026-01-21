const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    selectedSeats: [{ type: String, required: true }],
    totalAmount: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now },
    bookingStatus: { type: String, enum: ['CONFIRMED', 'CANCELLED'], default: 'CONFIRMED' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
