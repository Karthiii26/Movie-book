const asyncHandler = require('express-async-handler');
const Movie = require('../models/Movie');
const { getPosterUrl } = require('../services/tmdbService');

const getMovies = asyncHandler(async (req, res) => {
    const { language } = req.query;
    let query = { isActive: true };
    if (language && language !== 'All Languages') {
        query.language = language;
    }
    const movies = await Movie.find(query);
    res.json(movies);
});

const getMovieById = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
        res.json(movie);
    } else {
        res.status(404);
        throw new Error('Movie not found');
    }
});

const createMovie = asyncHandler(async (req, res) => {
    const { title, description, duration, language, genre, releaseDate, posterUrl, trailerUrl, director } = req.body;
    let finalPosterUrl = posterUrl || await getPosterUrl(title);
    const movie = new Movie({
        title, description, duration, language, genre, releaseDate, posterUrl: finalPosterUrl, trailerUrl, director, isActive: true
    });
    const createdMovie = await movie.save();
    res.status(201).json(createdMovie);
});

const updateMovie = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
        Object.assign(movie, req.body);
        const updatedMovie = await movie.save();
        res.json(updatedMovie);
    } else {
        res.status(404);
        throw new Error('Movie not found');
    }
});

const deleteMovie = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
        await movie.deleteOne();
        res.json({ message: 'Movie removed' });
    } else {
        res.status(404);
        throw new Error('Movie not found');
    }
});

module.exports = { getMovies, getMovieById, createMovie, updateMovie, deleteMovie };
