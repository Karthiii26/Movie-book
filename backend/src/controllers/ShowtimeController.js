const asyncHandler = require('express-async-handler');
const Showtime = require('../models/Showtime');

const getShowtimesByMovie = asyncHandler(async (req, res) => {
    const showtimes = await Showtime.find({ movie: req.params.movieId }).populate('theatre');
    res.json(showtimes);
});

const getShowtimeById = asyncHandler(async (req, res) => {
    const showtime = await Showtime.findById(req.params.id).populate('movie').populate('theatre');
    if (showtime) {
        res.json(showtime);
    } else {
        res.status(404);
        throw new Error('Showtime not found');
    }
});

const createShowtime = asyncHandler(async (req, res) => {
    const showtime = new Showtime({ ...req.body, bookedSeats: [] });
    const createdShowtime = await showtime.save();
    res.status(201).json(createdShowtime);
});

const updateShowtime = asyncHandler(async (req, res) => {
    const showtime = await Showtime.findById(req.params.id);
    if (showtime) {
        Object.assign(showtime, req.body);
        const updatedShowtime = await showtime.save();
        res.json(updatedShowtime);
    } else {
        res.status(404);
        throw new Error('Showtime not found');
    }
});

const deleteShowtime = asyncHandler(async (req, res) => {
    const showtime = await Showtime.findById(req.params.id);
    if (showtime) {
        await showtime.deleteOne();
        res.json({ message: 'Showtime removed' });
    } else {
        res.status(404);
        throw new Error('Showtime not found');
    }
});

const getAllShowtimes = asyncHandler(async (req, res) => {
    const showtimes = await Showtime.find({}).populate('movie').populate('theatre');
    res.json(showtimes);
});

module.exports = { getShowtimesByMovie, getShowtimeById, createShowtime, updateShowtime, deleteShowtime, getAllShowtimes };
