const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
    screenId: { type: String, required: true },
    showDate: { type: Date, required: true },
    showTime: { type: String, required: true },
    pricePerSeat: { type: Number, required: true },
    bookedSeats: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Showtime', showtimeSchema);
