const asyncHandler = require('express-async-handler');
const Theatre = require('../models/Theatre');

const getTheatres = asyncHandler(async (req, res) => {
    const theatres = await Theatre.find({});
    res.json(theatres);
});

const createTheatre = asyncHandler(async (req, res) => {
    const theatre = new Theatre(req.body);
    const createdTheatre = await theatre.save();
    res.status(201).json(createdTheatre);
});

module.exports = { getTheatres, createTheatre };
