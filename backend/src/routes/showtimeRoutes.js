const express = require('express');
const router = express.Router();
const { getShowtimesByMovie, getShowtimeById, createShowtime, updateShowtime, deleteShowtime, getAllShowtimes } = require('../controllers/ShowtimeController');
const { protect, admin } = require('../middleware/AuthMiddleware');

router.get('/movie/:movieId', getShowtimesByMovie);
router.get('/all/global', protect, admin, getAllShowtimes);
router.get('/:id', getShowtimeById);
router.post('/', protect, admin, createShowtime);
router.put('/:id', protect, admin, updateShowtime);
router.delete('/:id', protect, admin, deleteShowtime);

module.exports = router;
